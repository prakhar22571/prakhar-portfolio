import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { errorMiddleware } from "../middlewares/error.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { User } from "../models/userSchema.js";
import { Message } from "../models/messageSchema.js";
import { Project } from "../models/projectSchema.js";
import { Skill } from "../models/skillSchema.js";
import { serializeProfile } from "../utils/profile.js";
import { saveWithAssets, validateUpload } from "../utils/assets.js";
import userRouter from "../routes/userRouter.js";
import {
  getSingleProject,
  updateProject,
} from "../controller/projectController.js";
import {
  forgotPassword,
  resetPassword,
  login,
} from "../controller/userController.js";
import { requireOwner } from "../utils/owner.js";
const ownerId = new mongoose.Types.ObjectId().toString();
process.env.JWT_SECRET_KEY = "local-test-secret";
process.env.PORTFOLIO_OWNER_ID = ownerId;
afterEach(() => {
  process.env.PORTFOLIO_OWNER_ID = ownerId;
});
function response() {
  return {
    statusCode: 200,
    status(value) {
      this.statusCode = value;
      return this;
    },
    cookie() {
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}
async function invoke(handler, req) {
  const res = response();
  let failure;
  await handler(req, res, (error) => {
    failure = error;
  });
  return { res, failure };
}
const userData = {
  fullName: "Owner",
  email: "owner@example.com",
  phone: "123",
  aboutMe: "About",
  password: "original-password",
  portfolioURL: "https://example.com",
  avatar: { public_id: "avatar", url: "https://example.com/avatar.png" },
  resume: { public_id: "resume", url: "https://example.com/resume.pdf" },
};

test("malformed IDs and duplicate keys return JSON errors without throwing", () => {
  for (const error of [
    { name: "CastError", path: "_id" },
    { code: 11000, keyValue: { email: "a" } },
  ]) {
    const res = response();
    errorMiddleware(error, {}, res, () => {});
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.message);
  }
});
test("public signup route has been removed", () => {
  assert.equal(
    userRouter.stack.some((layer) => layer.route?.path === "/register"),
    false,
  );
});
test("profile serialization excludes auth fields even when selected", () => {
  const input = {
    ...userData,
    _id: ownerId,
    password: "hash",
    resetPasswordToken: "token",
    resetPasswordExpire: new Date(),
  };
  for (const publicOnly of [true, false]) {
    const result = serializeProfile(input, { publicOnly });
    for (const key of ["password", "resetPasswordToken", "resetPasswordExpire"])
      assert.equal(key in result, false);
    assert.equal(result.avatar.public_id, undefined);
    assert.equal("email" in result, !publicOnly);
  }
});
test("deleted users and non-owner accounts cannot authenticate", async (t) => {
  t.mock.method(User, "findById", async () => null);
  const token = jwt.sign({ id: ownerId }, process.env.JWT_SECRET_KEY);
  const missing = await invoke(isAuthenticated, {
    headers: { authorization: `Bearer ${token}` },
    cookies: {},
  });
  assert.equal(missing.failure.statusCode, 401);
  await assert.rejects(requireOwner({ _id: new mongoose.Types.ObjectId() }), {
    statusCode: 403,
  });
});
test("multiple legacy users fail closed without explicit owner configuration", async (t) => {
  delete process.env.PORTFOLIO_OWNER_ID;
  t.mock.method(User, "find", () => ({
    select: () => ({ limit: async () => [{ _id: ownerId }, { _id: "other" }] }),
  }));
  await assert.rejects(requireOwner({ _id: ownerId }), { statusCode: 503 });
});
test("login denies a non-owner even when their password is valid", async (t) => {
  t.mock.method(User, "findOne", () => ({
    select: async () => ({
      _id: new mongoose.Types.ObjectId(),
      comparePassword: async () => true,
    }),
  }));
  const { failure } = await invoke(login, {
    body: { email: "someone@example.com", password: "valid-password" },
  });
  assert.equal(failure.statusCode, 403);
});
test("missing projects return 404 for reads and both update forms", async (t) => {
  t.mock.method(Project, "findById", async () => null);
  for (const handler of [getSingleProject, updateProject])
    for (const files of [undefined, { projectBanner: {} }]) {
      const { failure } = await invoke(handler, {
        params: { id: ownerId },
        body: {},
        files,
      });
      assert.equal(failure.statusCode, 404);
    }
});
test("password save hook hashes once and preserves hashes on unrelated saves", async (t) => {
  t.mock.method(User.collection, "insertOne", async () => ({
    acknowledged: true,
    insertedId: ownerId,
  }));
  t.mock.method(User.collection, "updateOne", async () => ({
    acknowledged: true,
    modifiedCount: 1,
  }));
  const user = new User(userData);
  await user.save();
  const hash = user.password;
  assert.ok(await bcrypt.compare(userData.password, hash));
  user.fullName = "Updated owner";
  await user.save();
  assert.equal(user.password, hash);
  const selected = User.hydrate(
    { ...user.toObject(), password: undefined },
    { password: 0 },
  );
  selected.getResetPasswordToken();
  await selected.save({ validateBeforeSave: false });
  assert.equal(selected.password, undefined);
});
test("reset rejects expired tokens and accepts a valid owner token without exposing the new hash", async (t) => {
  const find = t.mock.method(User, "findOne", async () => null);
  let result = await invoke(resetPassword, {
    params: { token: "expired" },
    body: { password: "new-password", confirmPassword: "new-password" },
  });
  assert.equal(result.failure.statusCode, 400);
  const user = new User({ ...userData, _id: ownerId });
  user.resetPasswordToken = "hashed-token";
  t.mock.method(user, "save", async () => user);
  find.mock.mockImplementation(async () => user);
  result = await invoke(resetPassword, {
    params: { token: "valid" },
    body: { password: "new-password", confirmPassword: "new-password" },
  });
  assert.equal(result.failure, undefined);
  assert.equal(user.resetPasswordToken, undefined);
  assert.equal(result.res.body.user.password, undefined);
  assert.ok(result.res.body.token);
});
test("forgot-password for an unknown account returns a generic response", async (t) => {
  t.mock.method(User, "findOne", async () => null);
  const { res, failure } = await invoke(forgotPassword, {
    body: { email: "unknown@example.com" },
  });
  assert.equal(failure, undefined);
  assert.equal(res.body.success, true);
});
test("timestamps are evaluated for each message", async () => {
  const first = new Message({ message: "First" });
  await setTimeout(10);
  const second = new Message({ message: "Second" });
  assert.ok(second.createdAt > first.createdAt);
});
test("project validation is consistent and undeployed projects may omit a URL", async () => {
  const data = {
    title: "Project",
    description: "Description",
    technologies: "JS",
    stack: "Full Stack",
    deployed: "No",
    gitRepoLink: "https://example.com/repo",
    projectBanner: userData.avatar,
  };
  const project = new Project(data);
  await project.validate();
  project.deployed = "Yes";
  await assert.rejects(project.validate(), /projectLink/);
  project.projectLink = "javascript:alert(1)";
  await assert.rejects(project.validate(), /HTTP/);
  await assert.rejects(
    new Skill({
      title: "JS",
      proficiency: 101,
      svg: userData.avatar,
    }).validate(),
    /100/,
  );
});
async function withImage(callback) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "portfolio-assets-"));
  const filePath = path.join(dir, "test.png");
  await writeFile(filePath, Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  try {
    await callback({ tempFilePath: filePath, mimetype: "image/png", size: 8 });
  } finally {
    assert.ok(
      path.resolve(dir).startsWith(path.resolve(os.tmpdir()) + path.sep),
    );
    await rm(dir, { recursive: true, force: true });
  }
}
test("asset replacement commits before deleting the previous asset", () =>
  withImage(async (file) => {
    const events = [];
    const uploader = {
      upload: async () => {
        events.push("upload");
        return { public_id: "new", secure_url: "https://example.com/new" };
      },
      destroy: async (id) => {
        events.push("delete:" + id);
      },
    };
    await saveWithAssets(
      {
        uploads: [{ key: "avatar", file, folder: "test" }],
        previous: { avatar: { public_id: "old" } },
        save: async () => {
          events.push("save");
        },
      },
      uploader,
    );
    assert.deepEqual(events, ["upload", "save", "delete:old"]);
  }));
test("failed persistence rolls back new assets and preserves existing files", () =>
  withImage(async (file) => {
    const deleted = [];
    const uploader = {
      upload: async () => ({
        public_id: "new",
        secure_url: "https://example.com/new",
      }),
      destroy: async (id) => {
        deleted.push(id);
      },
    };
    await assert.rejects(
      saveWithAssets(
        {
          uploads: [{ key: "avatar", file }],
          previous: { avatar: { public_id: "old" } },
          save: async () => {
            throw new Error("database failed");
          },
        },
        uploader,
      ),
      /database failed/,
    );
    assert.deepEqual(deleted, ["new"]);
  }));
test("a failed second upload rolls back the first without deleting old assets", () =>
  withImage(async (file) => {
    const deleted = [];
    let count = 0;
    const uploader = {
      upload: async () => {
        if (++count === 2) throw new Error("upload failed");
        return { public_id: "new", secure_url: "https://example.com/new" };
      },
      destroy: async (id) => deleted.push(id),
    };
    await assert.rejects(
      saveWithAssets(
        {
          uploads: [
            { key: "avatar", file },
            { key: "resume", file },
          ],
          previous: { avatar: { public_id: "old" } },
          save: () => assert.fail("must not save"),
        },
        uploader,
      ),
      /upload failed/,
    );
    assert.deepEqual(deleted, ["new"]);
  }));
test("uploads reject missing, oversized, and incorrectly typed files", () =>
  withImage(async (file) => {
    await assert.rejects(validateUpload(null, "avatar"), /required/);
    await assert.rejects(
      validateUpload({ ...file, size: 11 * 1024 * 1024 }, "avatar"),
      { statusCode: 413 },
    );
    await assert.rejects(
      validateUpload({ ...file, mimetype: "application/pdf" }, "resume", "pdf"),
      /content/,
    );
  }));

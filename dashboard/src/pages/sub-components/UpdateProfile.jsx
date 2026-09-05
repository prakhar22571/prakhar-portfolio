import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@portfolio/shared/components/ui/button";
import { Input } from "@portfolio/shared/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@portfolio/shared/components/file-upload";
import { updateProfile } from "@/store/slices/userSlice";
import { useMutation } from "@/hooks/use-mutation";
import { profileFields, profileValues } from "@/lib/profile-fields";
export default function UpdateProfile() {
  const { user, loading } = useSelector((state) => state.user);
  const [values, setValues] = useState(() => profileValues(user));
  const [avatar, setAvatar] = useState(null);
  const [resume, setResume] = useState(null);
  const mutate = useMutation();
  async function submit(event) {
    event.preventDefault();
    const data = new FormData();
    for (const [key, value] of Object.entries(values)) data.append(key, value);
    if (avatar) data.append("avatar", avatar);
    if (resume) data.append("resume", resume);
    if (await mutate(updateProfile(data), "Profile updated.")) {
      setAvatar(null);
      setResume(null);
    }
  }
  return (
    <form className="grid gap-5" onSubmit={submit}>
      <h1 className="text-3xl font-bold">Update profile</h1>
      <div className="grid md:grid-cols-2 gap-5">
        <FileUpload
          label="Profile image"
          file={avatar}
          currentUrl={user.avatar?.url}
          onChange={setAvatar}
        />
        <FileUpload
          label="Resume"
          kind="pdf"
          file={resume}
          currentUrl={user.resume?.url}
          onChange={setResume}
        />
      </div>
      {profileFields.map(({ key, label, multiline, ...props }) => {
        const Field = multiline ? Textarea : Input;
        return (
          <label key={key} className="grid gap-2">
            {label}
            <Field
              {...props}
              value={values[key]}
              onChange={(event) =>
                setValues((old) => ({ ...old, [key]: event.target.value }))
              }
            />
          </label>
        );
      })}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update profile"}
      </Button>
    </form>
  );
}

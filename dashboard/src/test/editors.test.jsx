import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SkillEditor } from "@/components/skill-editor";
import { ProjectForm } from "@/components/project-form";
describe("skill editing", () => {
  test("untouched rows do not save or share edits", async () => {
    const saveA = vi.fn().mockResolvedValue(true),
      saveB = vi.fn().mockResolvedValue(true);
    render(
      <>
        <SkillEditor
          skill={{ title: "JS", proficiency: 80 }}
          onSave={saveA}
          onDelete={vi.fn()}
        />
        <SkillEditor
          skill={{ title: "CSS", proficiency: 60 }}
          onSave={saveB}
          onDelete={vi.fn()}
        />
      </>,
    );
    const a = screen.getByLabelText("Proficiency for JS"),
      b = screen.getByLabelText("Proficiency for CSS");
    fireEvent.focus(a);
    fireEvent.blur(a);
    expect(saveA).not.toHaveBeenCalled();
    fireEvent.change(a, { target: { value: "90" } });
    fireEvent.blur(a);
    await waitFor(() => expect(saveA).toHaveBeenCalledWith(90));
    fireEvent.focus(b);
    fireEvent.blur(b);
    expect(saveB).not.toHaveBeenCalled();
    expect(b.value).toBe("60");
  });
  test("invalid values do not reach the API", () => {
    const save = vi.fn();
    render(
      <SkillEditor
        skill={{ title: "JS", proficiency: 80 }}
        onSave={save}
        onDelete={vi.fn()}
      />,
    );
    const input = screen.getByLabelText("Proficiency for JS");
    fireEvent.change(input, { target: { value: "101" } });
    fireEvent.blur(input);
    expect(save).not.toHaveBeenCalled();
    expect(screen.getByRole("alert").textContent).toContain("0 to 100");
  });
});
test("failed project saves preserve the draft and return navigation does not submit", async () => {
  const save = vi.fn().mockResolvedValue(false);
  render(
    <MemoryRouter>
      <ProjectForm
        title="Update project"
        initialProject={{
          title: "Original",
          description: "Description",
          technologies: "JS",
          stack: "Full Stack",
          deployed: "No",
          gitRepoLink: "https://example.com/repo",
          projectBanner: { url: "https://example.com/banner.png" },
        }}
        onSubmit={save}
      />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByLabelText("Project title"), {
    target: { value: "My unsaved edit" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save project" }));
  await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
  expect(screen.getByLabelText("Project title").value).toBe("My unsaved edit");
  const data = save.mock.calls[0][0];
  expect(data.get("title")).toBe("My unsaved edit");
  expect(data.has("projectBanner")).toBe(false);
  fireEvent.click(screen.getByRole("link", { name: "Return to Dashboard" }));
  expect(save).toHaveBeenCalledTimes(1);
});

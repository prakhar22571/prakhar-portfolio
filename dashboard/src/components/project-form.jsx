import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "@portfolio/shared/components/ui/button";
import {
  GlassCard,
  CardContent,
} from "@portfolio/shared/components/ui/glass-card";
import { Input } from "@portfolio/shared/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@portfolio/shared/components/file-upload";
import { Link } from "react-router-dom";
const empty = {
  title: "",
  description: "",
  technologies: "",
  stack: "",
  deployed: "No",
  gitRepoLink: "",
  projectLink: "",
};
const stacks = ["Full Stack", "Mern", "Mean", "Next.JS", "React.JS"];
export function ProjectForm({ initialProject, onSubmit, loading, title }) {
  const [values, setValues] = useState({ ...empty, ...initialProject });
  const [banner, setBanner] = useState(null);
  const [error, setError] = useState("");
  const update = (key, value) =>
    setValues((previous) => ({ ...previous, [key]: value }));
  async function submit(event) {
    event.preventDefault();
    if (!initialProject && !banner) {
      setError("Choose a project banner.");
      return;
    }
    setError("");
    const data = new FormData();
    for (const key of Object.keys(empty)) data.append(key, values[key] ?? "");
    if (banner) data.append("projectBanner", banner);
    const saved = await onSubmit(data);
    if (saved) {
      if (!initialProject) setValues(empty);
      setBanner(null);
    }
  }
  return (
    <div className="max-w-4xl mx-auto p-5">
      <GlassCard>
        <CardContent className="p-6 sm:p-10">
          <div className="flex justify-between gap-4 mb-8">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <Button asChild>
              <Link to="/">Return to Dashboard</Link>
            </Button>
          </div>
          <form onSubmit={submit} className="grid gap-5">
            {Object.entries({
              title: "Project title",
              description: "Description",
              technologies: "Technologies (comma separated)",
            }).map(([key, label]) => {
              const Field = key === "title" ? Input : Textarea;
              return (
                <label className="grid gap-2" key={key}>
                  {label}
                  <Field
                    required
                    value={values[key]}
                    onChange={(event) => update(key, event.target.value)}
                  />
                </label>
              );
            })}
            <label className="grid gap-2">
              Stack
              <select
                className="border rounded-md bg-background p-2"
                required
                value={values.stack}
                onChange={(event) => update("stack", event.target.value)}
              >
                <option value="">Select a stack</option>
                {[...new Set([...stacks, values.stack].filter(Boolean))].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </label>
            <label className="grid gap-2">
              Deployed
              <select
                className="border rounded-md bg-background p-2"
                value={values.deployed}
                onChange={(event) => update("deployed", event.target.value)}
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
            {[
              ["gitRepoLink", "GitHub repository"],
              ["projectLink", "Project URL"],
            ].map(([key, label]) => (
              <label className="grid gap-2" key={key}>
                {label}
                <Input
                  type="url"
                  required={key === "gitRepoLink" || values.deployed === "Yes"}
                  value={values[key] || ""}
                  onChange={(event) => update(key, event.target.value)}
                />
              </label>
            ))}
            <FileUpload
              label="Project banner"
              file={banner}
              currentUrl={initialProject?.projectBanner?.url}
              onChange={setBanner}
            />
            {error && <p role="alert">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save project"}
            </Button>
          </form>
        </CardContent>
      </GlassCard>
    </div>
  );
}

ProjectForm.propTypes = {
  initialProject: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  title: PropTypes.string,
};

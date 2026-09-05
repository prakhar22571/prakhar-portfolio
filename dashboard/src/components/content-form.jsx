import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "@portfolio/shared/components/ui/button";
import { Input } from "@portfolio/shared/components/ui/input";
import {
  GlassCard,
  CardContent,
} from "@portfolio/shared/components/ui/glass-card";
import { FileUpload } from "@portfolio/shared/components/file-upload";
import { Textarea } from "@/components/ui/textarea";
export function ContentForm({ title, fields, imageLabel, saving, onSubmit }) {
  const empty = Object.fromEntries(fields.map((field) => [field.key, ""]));
  const [values, setValues] = useState(empty);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (imageLabel && !file) {
      setError("Choose an image.");
      return;
    }
    setError("");
    let data = values;
    if (imageLabel) {
      data = new FormData();
      for (const [key, value] of Object.entries(values))
        data.append(key, value);
      data.append("svg", file);
    }
    if (await onSubmit(data)) {
      setValues(empty);
      setFile(null);
    }
  }
  return (
    <div className="max-w-3xl mx-auto p-5">
      <GlassCard>
        <CardContent className="p-6 sm:p-10">
          <h1 className="text-3xl font-semibold mb-6">{title}</h1>
          <form className="grid gap-5" onSubmit={submit}>
            {fields.map(({ key, label, multiline, ...props }) => {
              const Field = multiline ? Textarea : Input;
              return (
                <label key={key} className="grid gap-2">
                  {label}
                  <Field
                    {...props}
                    value={values[key]}
                    onChange={(event) =>
                      setValues((old) => ({
                        ...old,
                        [key]: event.target.value,
                      }))
                    }
                  />
                </label>
              );
            })}
            {imageLabel && (
              <FileUpload label={imageLabel} file={file} onChange={setFile} />
            )}
            {error && <p role="alert">{error}</p>}
            <Button disabled={saving} type="submit">
              {saving ? "Saving..." : "Save"}
            </Button>
          </form>
        </CardContent>
      </GlassCard>
    </div>
  );
}

ContentForm.propTypes = {
  title: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      multiline: PropTypes.bool,
    }),
  ),
  imageLabel: PropTypes.string,
  saving: PropTypes.bool,
  onSubmit: PropTypes.func,
};

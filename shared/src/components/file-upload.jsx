import PropTypes from "prop-types";
import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, FileText } from "lucide-react";

export function FileUpload({
  label,
  file,
  onChange,
  currentUrl,
  kind = "image",
}) {
  const id = useId();
  const input = useRef(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!file) {
      setPreview("");
      if (input.current) input.current.value = "";
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function selectFile(candidate) {
    if (!candidate) return;
    const validType =
      kind === "pdf"
        ? candidate.type === "application/pdf"
        : [
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/webp",
            "image/svg+xml",
          ].includes(candidate.type);
    if (!validType || candidate.size > 10 * 1024 * 1024) {
      setError(
        kind === "pdf"
          ? "Choose a PDF up to 10 MB."
          : "Choose a PNG, JPG, GIF, WebP, or SVG up to 10 MB.",
      );
      return;
    }
    setError("");
    onChange(candidate);
  }
  const image = preview || currentUrl;
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div
        className="glass rounded-xl border-dashed p-6 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          selectFile(event.dataTransfer.files[0]);
        }}
      >
        {kind === "image" && image ? (
          <img
            src={image}
            alt={label}
            className="mx-auto max-h-64 rounded-lg object-contain"
          />
        ) : kind === "pdf" ? (
          <FileText className="mx-auto h-12 w-12" />
        ) : (
          <ImagePlus className="mx-auto h-12 w-12" />
        )}
        {file && <p className="mt-2 text-sm break-all">{file.name}</p>}
        {kind === "pdf" && currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="block mt-2 underline"
          >
            View current resume
          </a>
        )}
        <input
          ref={input}
          id={id}
          type="file"
          className="mt-4 max-w-full"
          accept={
            kind === "pdf"
              ? "application/pdf"
              : "image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
          }
          onChange={(event) => selectFile(event.target.files[0])}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Choose a file or drag it here. Maximum 10 MB.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

FileUpload.propTypes = {
  label: PropTypes.string,
  file: PropTypes.object,
  onChange: PropTypes.func,
  currentUrl: PropTypes.string,
  kind: PropTypes.string,
};

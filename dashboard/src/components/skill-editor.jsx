import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Input } from "@portfolio/shared/components/ui/input";
import { Button } from "@portfolio/shared/components/ui/button";
import { GlassCard } from "@portfolio/shared/components/ui/glass-card";
export function SkillEditor({ skill, onSave, onDelete }) {
  const [value, setValue] = useState(String(skill.proficiency));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setValue(String(skill.proficiency)), [skill.proficiency]);
  async function save() {
    if (busy) return;
    const number = Number(value);
    if (
      value.trim() === "" ||
      !Number.isFinite(number) ||
      number < 0 ||
      number > 100
    ) {
      setError("Enter a proficiency from 0 to 100.");
      return;
    }
    setError("");
    if (number !== skill.proficiency) {
      setBusy(true);
      await onSave(number);
      setBusy(false);
    }
  }
  async function handleDelete() {
    setBusy(true);
    await onDelete();
    setBusy(false);
  }
  return (
    <GlassCard className="p-5 grid gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{skill.title}</h2>
        <Button disabled={busy} variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <label className="grid gap-2">
        Proficiency for {skill.title}
        <Input
          type="number"
          min="0"
          max="100"
          disabled={busy}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={save}
        />
      </label>
      {error && (
        <p role="alert" className="text-red-500">
          {error}
        </p>
      )}
    </GlassCard>
  );
}

SkillEditor.propTypes = {
  skill: PropTypes.shape({
    title: PropTypes.string.isRequired,
    proficiency: PropTypes.number.isRequired,
  }),
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
};

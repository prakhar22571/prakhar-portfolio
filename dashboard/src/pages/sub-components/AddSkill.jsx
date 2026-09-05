import { useSelector } from "react-redux";
import { addNewSkill } from "@/store/slices/skillSlice";
import { ContentForm } from "@/components/content-form";
import { useMutation } from "@/hooks/use-mutation";
const fields = [
  { key: "title", label: "Title", required: true },
  {
    key: "proficiency",
    label: "Proficiency",
    type: "number",
    min: 0,
    max: 100,
    required: true,
  },
];
export default function AddSkill() {
  const saving = useSelector((state) => state.skill.loading);
  const mutate = useMutation();
  return (
    <ContentForm
      title="Add skill"
      fields={fields}
      imageLabel="Skill image"
      saving={saving}
      onSubmit={(data) => mutate(addNewSkill(data), "Skill added.")}
    />
  );
}

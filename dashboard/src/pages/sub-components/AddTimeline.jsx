import { useSelector } from "react-redux";
import { addNewTimeline } from "@/store/slices/timelineSlice";
import { ContentForm } from "@/components/content-form";
import { useMutation } from "@/hooks/use-mutation";
const fields = [
  { key: "title", label: "Title", required: true },
  { key: "description", label: "Description", multiline: true, required: true },
  { key: "from", label: "From", type: "number" },
  { key: "to", label: "To (leave empty for present)", type: "number" },
];
export default function AddTimeline() {
  const saving = useSelector((state) => state.timeline.loading);
  const mutate = useMutation();
  return (
    <ContentForm
      title="Add timeline"
      fields={fields}
      saving={saving}
      onSubmit={(data) => mutate(addNewTimeline(data), "Timeline added.")}
    />
  );
}

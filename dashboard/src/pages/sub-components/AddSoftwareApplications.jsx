import { useSelector } from "react-redux";
import { addNewSoftwareApplication } from "@/store/slices/softwareApplicationSlice";
import { ContentForm } from "@/components/content-form";
import { useMutation } from "@/hooks/use-mutation";
const fields = [{ key: "name", label: "Application name", required: true }];
export default function AddSoftwareApplications() {
  const saving = useSelector((state) => state.softwareApplications.loading);
  const mutate = useMutation();
  return (
    <ContentForm
      title="Add software application"
      fields={fields}
      imageLabel="Application image"
      saving={saving}
      onSubmit={(data) =>
        mutate(addNewSoftwareApplication(data), "Application added.")
      }
    />
  );
}

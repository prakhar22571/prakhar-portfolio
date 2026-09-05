import { useSelector } from "react-redux";
import { addNewProject } from "@/store/slices/projectSlice";
import { useMutation } from "@/hooks/use-mutation";
import { ProjectForm } from "@/components/project-form";
export default function AddProject() {
  const loading = useSelector((state) => state.project.loading);
  const mutate = useMutation();
  return (
    <ProjectForm
      title="Add project"
      loading={loading}
      onSubmit={(data) => mutate(addNewProject(data), "Project added.")}
    />
  );
}

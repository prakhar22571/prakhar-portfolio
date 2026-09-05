import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "@/lib/api";
import { updateProject } from "@/store/slices/projectSlice";
import { useMutation } from "@/hooks/use-mutation";
import { useProject } from "@portfolio/shared/hooks/use-project";
import { Status } from "@portfolio/shared/components/status";
import { ProjectForm } from "@/components/project-form";
export default function UpdateProject() {
  const { id } = useParams();
  const { projects, loading: saving } = useSelector((state) => state.project);
  const cached = projects.find((project) => project._id === id);
  const { project, loading, error, retry } = useProject(api, id, cached);
  const mutate = useMutation();
  return project ? (
    <ProjectForm
      key={id}
      title="Update project"
      initialProject={project}
      loading={saving}
      onSubmit={(data) => mutate(updateProject(id, data), "Project updated.")}
    />
  ) : (
    <Status loading={loading} error={error} onRetry={retry} />
  );
}

import { Link, useParams } from "react-router-dom";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { useProject } from "@portfolio/shared/hooks/use-project";
import { ProjectDetails } from "@portfolio/shared/components/project-details";
import { Status } from "@portfolio/shared/components/status";
import { Button } from "@portfolio/shared/components/ui/button";
export default function ViewProject() {
  const { id } = useParams();
  const cached = useSelector((state) =>
    state.project.projects.find((project) => project._id === id),
  );
  const { project, loading, error, retry } = useProject(api, id, cached);
  return (
    <div className="max-w-4xl mx-auto p-5">
      {project ? (
        <ProjectDetails project={project}>
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </ProjectDetails>
      ) : (
        <Status loading={loading} error={error} onRetry={retry} />
      )}
    </div>
  );
}

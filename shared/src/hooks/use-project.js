import { useEffect, useState } from "react";

export function useProject(api, id, cachedProject) {
  const [state, setState] = useState({
    id,
    project: null,
    loading: true,
    error: null,
  });
  const [attempt, retry] = useState(0);
  useEffect(() => {
    if (cachedProject) return;
    const controller = new AbortController();
    setState({ id, project: null, loading: true, error: null });
    api
      .get(`/api/v1/project/get/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!data.project) throw new Error("Project not found.");
        if (!controller.signal.aborted)
          setState({ id, project: data.project, loading: false, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({
            id,
            project: null,
            loading: false,
            error: error.response?.data?.message || error.message,
          });
      });
    return () => controller.abort();
  }, [api, id, cachedProject, attempt]);
  if (cachedProject)
    return { project: cachedProject, loading: false, error: null };
  return {
    ...(state.id === id
      ? state
      : { project: null, loading: true, error: null }),
    retry: () => retry((value) => value + 1),
  };
}

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getAllSkills } from "@/store/slices/skillSlice";
import { getAllProjects } from "@/store/slices/projectSlice";
import { getAllTimeline } from "@/store/slices/timelineSlice";
import { getAllSoftwareApplications } from "@/store/slices/softwareApplicationSlice";
import { getAllMessages } from "@/store/slices/messageSlice";
import { Button } from "@portfolio/shared/components/ui/button";
const sources = [
  ["skill", getAllSkills],
  ["project", getAllProjects],
  ["timeline", getAllTimeline],
  ["softwareApplications", getAllSoftwareApplications],
  ["messages", getAllMessages],
];
export function DataStatus() {
  const authenticated = useSelector((state) => state.user.isAuthenticated);
  const errors = useSelector(
    (state) => sources.map(([key]) => state[key].error),
    shallowEqual,
  );
  const dispatch = useDispatch();
  if (!authenticated) return null;
  return (
    <div className="sm:ml-16 px-5">
      {sources.map(
        ([key, reload], index) =>
          errors[index] && (
            <div
              role="alert"
              key={key}
              className="flex gap-4 items-center py-2"
            >
              <p>{errors[index]}</p>
              <Button onClick={() => dispatch(reload())}>Retry {key}</Button>
            </div>
          ),
      )}
    </div>
  );
}

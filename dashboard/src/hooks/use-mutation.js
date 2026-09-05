import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
export function useMutation() {
  const dispatch = useDispatch();
  return async (action, message) => {
    try {
      await dispatch(action).unwrap();
      if (message) toast.success(message);
      return true;
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error.message || "Request failed.",
      );
      return false;
    }
  };
}

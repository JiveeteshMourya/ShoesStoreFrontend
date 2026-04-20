import { useAppDispatch } from "../store/hooks";
import { addToast } from "../store/slices/uiSlice";

export function useToast() {
  const dispatch = useAppDispatch();

  const toast = ({ message, type = "info", duration = 4000 }) =>
    dispatch(addToast({ message, type, duration }));

  return {
    success: message => toast({ message, type: "success" }),
    error: message => toast({ message, type: "error" }),
    info: message => toast({ message, type: "info" }),
    warning: message => toast({ message, type: "warning" }),
  };
}

import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";



export function useEditWidgetId() {
  const { editWidgetId } = useContext(AdminContext);
  return editWidgetId;
}
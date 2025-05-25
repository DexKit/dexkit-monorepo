import { useContext } from "react";
import { ContainerContext } from "../ContainerContext";

export default function useParams() {
  return useContext(ContainerContext);
}

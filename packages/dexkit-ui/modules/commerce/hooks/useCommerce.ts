import { useContext } from "react";
import { CommerceContext } from "../context";

export default function useCommerce() {
  return useContext(CommerceContext);
}

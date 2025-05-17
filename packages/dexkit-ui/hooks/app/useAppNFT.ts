import { useContext } from "react";
import { AppConfigContext } from "../../context/AppConfigContext";

export function useAppNFT() {
  return useContext(AppConfigContext).appNFT;
}

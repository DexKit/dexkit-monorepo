import React from "react";
import { CommerceContainerState } from "./types";

export const ContainerContext = React.createContext<CommerceContainerState>({
  params: {},
  set: () => {},
  get: () => "",
  containerId: "",
  setContainer: () => {},
  goBack: () => {},
});

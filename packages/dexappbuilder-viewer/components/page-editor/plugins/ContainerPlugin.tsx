import { Container } from "@mui/material";
import type { CellPlugin } from "@react-page/editor";

const ContainerPlugin: CellPlugin = {
  Renderer: ({ children }) => <Container>{children}</Container>,
  id: "container",
  title: "Container",
  description: "The container centers your content horizontally.",
  version: 1,
};

export default ContainerPlugin;

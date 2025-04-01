import { Grid } from "@mui/material";
import type { CellPlugin } from "@react-page/editor";

type Data = {
  spacing: number;
};

// you can pass the shape of the data as the generic type argument
const GridPlugin: CellPlugin<Data> = {
  Renderer: ({ children, data }) => (
    <Grid container spacing={data.spacing}>
      {children}
    </Grid>
  ),
  id: "grid",
  title: "Grid",
  description: "Grid container, insert columns inside container",
  version: 1,
  controls: {
    type: "autoform",
    schema: {
      // this JSONschema is type checked against the generic type argument
      // the autocompletion of your IDE helps to create this schema
      properties: {
        spacing: {
          type: "number",
          default: 2,
        },
      },
      required: ["spacing"],
    },
  },
};

export default GridPlugin;

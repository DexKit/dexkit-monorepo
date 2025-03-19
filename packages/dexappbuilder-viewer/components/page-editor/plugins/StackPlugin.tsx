import { Box, Container, Stack } from "@mui/material";
import type { CellPlugin } from "@react-page/editor";
import { useMemo } from "react";

type Data = {
  padding: number;
  spacing: number;
  direction: "row" | "row-reverse" | "column" | "column-reverse";
  position: string;
};

const StackPlugin: CellPlugin<Data> = {
  Renderer: ({ children, data }) => {
    const position = useMemo(() => {
      if (data.position === "center") {
        return "center";
      }
      if (data.position === "start") {
        return "flex-start";
      }
      if (data.position === "end") {
        return "flex-end";
      }
    }, [data.position]);

    return (
      <Stack
        sx={{ p: data.padding }}
        justifyContent={position}
        alignItems={position}
        direction={data.direction}
      >
        {children}
      </Stack>
    );
  },
  id: "stack",
  title: "Stack",
  description:
    "Manages layout of children components along vertical and horizontal axis",
  version: 1,
  controls: {
    type: "autoform",
    schema: {
      // this JSONschema is type checked against the generic type argument
      // the autocompletion of your IDE helps to create this schema
      properties: {
        padding: {
          type: "number",
          default: 2,
          minimum: 0,
        },
        position: {
          type: "string",
          title: "Position",
          enum: ["center", "start", "end"],
        },
        direction: {
          type: "string",
          title: "Direction",
          enum: ["row", "row-reverse", "column", "column-reverse"],
        },
      },
      required: [],
    },
  },
};

export default StackPlugin;

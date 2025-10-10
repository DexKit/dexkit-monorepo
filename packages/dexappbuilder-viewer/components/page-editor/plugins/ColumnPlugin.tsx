import { Grid } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';

type Data = {
  width: number;
};

// you can pass the shape of the data as the generic type argument
const ColumnPlugin: CellPlugin<Data> = {
  Renderer: ({ data, children }) => (
    <Grid size={data.width}>
      {children}
    </Grid>
  ),
  id: 'column',
  title: 'Column',
  description: 'Build your columns inside the grid container',
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      // this JSONschema is type checked against the generic type argument
      // the autocompletion of your IDE helps to create this schema
      properties: {
        width: {
          type: 'number',
          default: 4,
          minimum: 1,
          maximum: 12,
          multipleOf: 1,
        },
      },
      required: ['width'],
    },
  },
};

export default ColumnPlugin;

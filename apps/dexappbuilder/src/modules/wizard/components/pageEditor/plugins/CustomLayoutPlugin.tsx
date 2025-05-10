import CustomLayoutPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/CustomLayoutPlugin';
import type { CellPlugin } from '@react-page/editor';

const CustomLayoutPlugin: CellPlugin<{
  backgroundColor: string;
  paddingX: number;
  paddingY: number;
  cellSpacingOverride?: boolean;
  cellSpacingX: number;
  cellSpacingY: number;
}> = {
  ...CustomLayoutPluginViewer,

  controls: {
    type: 'autoform',
    schema: {
      required: ['backgroundColor'],
      properties: {
        backgroundColor: { type: 'string', title: 'Background Color' },
        paddingX: { type: 'number', title: 'Horizontal Padding' },
        paddingY: { type: 'number', title: 'Vertical Padding' },
        cellSpacingOverride: {
          type: 'boolean',
          title: 'Override Cell Spacing',
        },
        cellSpacingX: {
          type: 'number',
          title: 'Horizontal Cell Spacing',
        },
        cellSpacingY: { type: 'number', title: 'Vertical Cell Spacing' },
      },
    },
  },
};

export default CustomLayoutPlugin;

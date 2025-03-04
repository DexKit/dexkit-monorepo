import codeSnippetViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/CodeSnippet';
import type { CellPlugin } from '@react-page/editor';
import dynamic from 'next/dynamic';
// lazy load to keep initial bundle small
const CodeSnippet = dynamic(() => import('../components/CodeSnippet'));

const codeSnippet: CellPlugin<{
  code: string;
  language: string;
}> = {
  ...codeSnippetViewer,
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        language: {
          type: 'string',
        },
        code: {
          type: 'string',
          uniforms: {
            multiline: true,
          },
        },
      },
      required: ['code'],
    },
  },
};
export default codeSnippet;

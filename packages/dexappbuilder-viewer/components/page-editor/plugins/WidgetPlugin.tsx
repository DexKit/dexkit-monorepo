import { Widget } from "@dexkit/ui/components/Widget";
import type { CellPlugin } from "@react-page/editor";

type Data = {
  html?: string;
};
// you can pass the shape of the data as the generic type argument
const WidgetPlugin: CellPlugin<Data> = {
  Renderer: ({ data }) => <Widget htmlString={data?.html || "<></>"} />,
  id: "dexkit-widget-plugin",
  title: "Widget",
  description: "Insert custom html and scripts",
  version: 1,
};

export default WidgetPlugin;

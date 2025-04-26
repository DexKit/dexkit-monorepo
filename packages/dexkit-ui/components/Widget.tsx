import parse from "html-react-parser";
import Script from "next/script";

const parser = (input: string) =>
  parse(input, {
    replace: (domNode) => {
      //@ts-ignore
      if (domNode.type === "script" && domNode.attribs.src) {
        //@ts-ignore
        return <Script {...domNode?.attribs} src={domNode.attribs.src || ""} />;
      }
      //@ts-ignore
      if (
        domNode.type === "script" &&
        //@ts-ignore
        domNode.children &&
        //@ts-ignore
        domNode.children.lenght &&
        //@ts-ignore
        domNode.children[0].data
      ) {
        return (
          //@ts-ignore
          <Script
            //@ts-ignore
            {...domNode?.attribs}
            //@ts-ignore
            id={domNode?.attribs?.id || "inline-script"}
            //@ts-ignore
          >{`${domNode?.children[0]?.data}`}</Script>
        );
      }
    },
  });

export function Widget({ htmlString }: { htmlString: string }) {
  return <>{parser(htmlString)}</>;
}

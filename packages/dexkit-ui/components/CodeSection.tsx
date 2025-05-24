import { CodePageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useEffect } from "react";
import { Widget } from "./Widget";

export interface CodeSectionProps {
  section: CodePageSection;
}

export default function CodeSection(props: any) {
  const { js, css, html } = props.section.config;

  useEffect(() => {
    const script = document.createElement("script");

    script.innerHTML = js;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [js]);

  return (
    <>
      {css && <Widget htmlString={`<style>${css}</style>`} />}
      {html && <Widget htmlString={html} />}
    </>
  );
}

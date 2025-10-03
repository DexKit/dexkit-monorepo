import AutoAwesome from "@mui/icons-material/AutoAwesome";
import { ExecuteState } from "@uiw/react-md-editor";
import * as commands from "@uiw/react-md-editor/commands";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useIntl } from "react-intl";
import CompletationProvider from "./CompletationProvider";

import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface Props {
  setValue: (val?: string) => void;
  value: string;
}

export default function DKMDEditor({ setValue, value }: Props) {
  const { formatMessage } = useIntl();
  const [initialPrompt, setInitialPrompt] = useState("");

  const [textPos, setTextPos] = useState({ before: "", after: "" });

  return (
    <CompletationProvider
      onCompletation={(output: string) => {
        setValue(`${textPos.before}${output}${textPos.after}`);
      }}
      multiline
      messages={[
        {
          role: "system",
          content: "You are a helpful markdown editor assistant.",
        },
        {
          role: "user",
          content:
            "Only return the result of what I ask. Do not return quotes for the results",
        },
      ]}
      initialPrompt={initialPrompt}
    >
      {({ open, ref }) => (
        <MDEditor
          value={value}
          onChange={setValue}
          ref={ref}
          style={{ height: '300px' }}
          commands={[
            ...commands.getCommands(),
            {
              keyCommand: "ai",
              name: formatMessage({
                id: "artificial.inteligence",
                defaultMessage: "Artificial Inteligence",
              }),

              render: (command: any, disabled: any, executeCommand: any) => {
                return (
                  <button
                    disabled={disabled}
                    onClick={(evn) => {
                      evn.preventDefault();
                      evn.stopPropagation();
                      setTimeout(() => {
                        executeCommand(command, command.groupName);
                      }, 0);
                    }}
                  >
                    <AutoAwesome fontSize="inherit" />
                  </button>
                );
              },
              icon: <AutoAwesome fontSize="inherit" />,
              execute: async (state: ExecuteState) => {
                open();

                setInitialPrompt(state.selectedText);

                const before = state.text.substring(0, state.selection.start);

                const after = state.text.substring(
                  state.selection.end,
                  state.text.length
                );

                setTextPos({ before, after });
              },
            },
          ]}
        />
      )}
    </CompletationProvider>
  );
}

import { copyToClipboard } from "@dexkit/core/utils";
import FileCopy from "@mui/icons-material/FileCopy";
import { useIntl } from "react-intl";
import CopyIconButton from "./CopyIconButton";

interface Props {
  text: string;
}

export function CopyText({ text }: Props) {
  const handleCopy = () => {
    if (text) {
      copyToClipboard(text);
    }
  };

  const { formatMessage } = useIntl();

  return (
    <CopyIconButton
      iconButtonProps={{
        onClick: handleCopy,
        size: "small",
      }}
      tooltip={formatMessage({
        id: "copy",
        defaultMessage: "Copy",
        description: "Copy text",
      })}
      activeTooltip={formatMessage({
        id: "copied",
        defaultMessage: "Copied!",
        description: "Copied text",
      })}
    >
      <FileCopy fontSize="inherit" color="inherit" />
    </CopyIconButton>
  );
}

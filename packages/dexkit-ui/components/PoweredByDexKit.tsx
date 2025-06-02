import Typography from "@mui/material/Typography";
import { FormattedMessage } from "react-intl";
import Link from "./AppLink";

interface Props {
  appName?: string;
  isPreview?: boolean;
}

export function PoweredByDexKit({ appName, isPreview }: Props) {
  return (
    <Typography variant="body1" align="center">
      {appName && (
        <Link href="/" color="primary">
          {appName}
        </Link>
      )}{" "}
      <FormattedMessage
        id="made.with.love.by"
        defaultMessage="made with ❤️ by"
        description="made with ❤️ by"
      />{" "}
      <Link
        variant="inherit"
        href={isPreview ? "#" : "https://www.dexkit.com"}
        target="_blank"
        color="inherit"
      >
        <strong>DexKit</strong>
      </Link>
    </Typography>
  );
}

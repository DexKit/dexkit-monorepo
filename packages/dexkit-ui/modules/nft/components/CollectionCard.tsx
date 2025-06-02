import { NETWORK_SLUG } from "@dexkit/core/constants/networks";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import Link from "../../../components/AppLink";
import { Collection } from "../types";

interface Props {
  variant?: "default" | "simple";
  totalSupply: number;
  title?: String;
  collection?: Collection;
  backgroundImageUrl?: string;
  hoverable?: boolean;
  disabled?: boolean;
  hideTitle?: boolean;
}

export function CollectionCard({
  collection,
  backgroundImageUrl,
  title,
  variant,
  disabled,
  hideTitle,
}: Props) {
  const renderCardContent = () => {
    return (
      <CardContent sx={{ height: "100%" }}>
        <Stack
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{ height: "100%" }}
          spacing={2}
        >
          <Box>
            {/* <Chip
              color="secondary"
              label={
                <>
                  {totalSupply}{' '}
                  <FormattedMessage id="items" defaultMessage="items" />
                </>
              }
            /> */}
          </Box>
          <Stack alignItems="flex-start" spacing={2}>
            {!hideTitle && (
              <Typography
                color="white"
                variant={variant ? "h5" : "h4"}
                sx={{
                  display: "block",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {title ? title : collection?.name}
              </Typography>
            )}
            {variant !== "simple" && (
              <Button
                LinkComponent={Link}
                href={
                  disabled
                    ? "javascript:void(0)"
                    : `/collection/${NETWORK_SLUG(
                      collection?.chainId
                    )}/${collection?.address.toLowerCase()}`
                }
                variant="contained"
                color="primary"
              >
                <FormattedMessage
                  id="explore"
                  defaultMessage="Explore"
                  description="Collection card explorer button"
                />
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    );
  };

  const renderContent = () => {
    if (variant === "simple") {
      return (
        <CardActionArea
          LinkComponent={Link}
          href={`/collection/${NETWORK_SLUG(
            collection?.chainId
          )}/${collection?.address.toLowerCase()}`}
          sx={{ height: "100%" }}
        >
          {renderCardContent()}
        </CardActionArea>
      );
    }

    return renderCardContent();
  };

  return (
    <Card
      sx={{
        border: 0,
        background: `linear-gradient(45.66deg, rgba(14, 17, 22, 0.72) 0%, rgba(155, 155, 155, 0) 92.88%), url(${backgroundImageUrl}) no-repeat center center`,
        backgroundSize: "cover",
        height: "100%",
      }}
    >
      {renderContent()}
    </Card>
  );
}

export default CollectionCard;

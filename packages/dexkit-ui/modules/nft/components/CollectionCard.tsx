import { NETWORK_SLUG, NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import {
  Avatar,
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
      <CardContent sx={{ height: "100%", p: 1.5 }}>
        <Stack
          alignItems="flex-start"
          justifyContent="flex-end"
          sx={{ height: "100%", minHeight: '180px' }}
          spacing={1}
        >
          <Box sx={{ flex: 1 }} />
          <Stack alignItems="flex-start" spacing={1}>
            {!hideTitle && (
              <Typography
                color="white"
                variant={variant ? "h5" : "h4"}
                sx={{
                  display: "block",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  fontSize: variant ? "1.5rem" : "1.75rem",
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  pl: 2
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
                size="medium"
                sx={{ 
                  fontSize: '0.9rem',
                  px: 3,
                  py: 1,
                  minWidth: 'auto',
                  color: 'white !important',
                  pl: 2,
                  '&:hover': {
                    color: 'white !important'
                  }
                }}
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

  const network = collection?.chainId ? NETWORK_FROM_SLUG(NETWORK_SLUG(collection.chainId)) : null;

  return (
    <Card
      sx={{
        border: 0,
        background: `linear-gradient(45.66deg, rgba(14, 17, 22, 0.72) 0%, rgba(155, 155, 155, 0) 92.88%), url(${backgroundImageUrl}) no-repeat center center`,
        backgroundSize: "cover",
        height: "100%",
        position: "relative",
        minHeight: "200px",
        maxHeight: "250px",
        overflow: "hidden"
      }}
    >
      {network && (
        <Avatar
          src={network.imageUrl}
          alt={network.name}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            zIndex: 1,
            border: "2px solid rgba(255, 255, 255, 0.8)",
          }}
        />
      )}
      {renderContent()}
    </Card>
  );
}

export default CollectionCard;

import Link from "@dexkit/ui/components/AppLink";
import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";

import { SlideAction } from "@dexkit/ui/modules/wizard/types/section";

export interface SlideProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  imageUrl: string;
  action?: SlideAction;
  height?: { desktop?: number; mobile?: number };
  textColor?: string;
  overlayPercentage?: number;
  overlayColor?: string;
}

export default function Slide({
  title,
  subtitle,
  action,
  imageUrl,
  height,
  textColor,
  overlayPercentage,
  overlayColor,
}: SlideProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={(theme) => ({
          position: "relative",
          height: height?.mobile !== undefined ? height?.mobile : 250,
          [theme.breakpoints.up("sm")]: {
            height: height?.desktop !== undefined ? height?.desktop : 500,
          },
          width: "100%",
        })}
      >
        <Box
          sx={{
            backgroundImage: `linear-gradient(0deg, ${overlayColor} 0%, rgba(0,0,0,0) ${overlayPercentage}%), url("${imageUrl}")`,
            aspectRation: "16/9",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
        <Stack
          sx={{
            position: "absolute",
            display: "block",
            bottom: (theme) => theme.spacing(4),
            left: (theme) => theme.spacing(4),
            right: (theme) => theme.spacing(4),
            p: 4,
          }}
          spacing={2}
        >
          <Box
            sx={{
              zIndex: 5,
            }}
          >
            <Typography
              sx={{ color: textColor ? textColor : undefined }}
              variant="h5"
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                sx={{ color: textColor ? textColor : undefined }}
                variant="h6"
                fontWeight="400"
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && (
            <Box>
              {action.type === "link" && action.caption && (
                <Button
                  variant="contained"
                  LinkComponent={Link}
                  href={action.url}
                >
                  {action.caption}
                </Button>
              )}
              {action.type === "page" && action.caption && (
                <Button
                  variant="contained"
                  LinkComponent={Link}
                  href={action.page}
                >
                  {action.caption}
                </Button>
              )}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

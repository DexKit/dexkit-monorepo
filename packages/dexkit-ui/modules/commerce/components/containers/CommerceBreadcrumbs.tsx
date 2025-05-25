import {
  Breadcrumbs,
  IconButton,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useCallback } from "react";
import useParams from "./hooks/useParams";

interface CommerceBreadcrumbsProps {
  breadcrumbs: {
    caption: React.ReactNode;
    containerId: string;
    params?: { [key: string]: string };
    active?: boolean;
  }[];
  showTitleOnDesktop?: boolean;
}

export function CommerceBreadcrumbs({
  breadcrumbs,
  showTitleOnDesktop,
}: CommerceBreadcrumbsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { setContainer } = useParams();

  const renderActiveBreadcrumb = () => {
    const breadcrumb = breadcrumbs.find((b) => b.active);

    if (breadcrumb) {
      return (
        <Typography
          sx={{
            display: "block",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          variant="h6"
        >
          {breadcrumb.caption}
        </Typography>
      );
    }
    return;
  };

  const handleGoBack = () => {};

  const handleClick = useCallback(
    (containerId: string, params?: { [key: string]: string }) => {
      return () => {
        setContainer(containerId, params);
      };
    },
    [setContainer]
  );

  // TODO: make push logic to go back on mobile...

  return (
    <Stack spacing={showTitleOnDesktop ? 2 : undefined}>
      {isMobile ? (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          alignContent="center"
        >
          <IconButton onClick={handleGoBack}>
            <ArrowBackIcon />
          </IconButton>

          {renderActiveBreadcrumb()}
        </Stack>
      ) : (
        <>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" color="inherit" />}
          >
            {breadcrumbs.map((breadcrumb, index) => (
              <Link
                key={index}
                onClick={handleClick(breadcrumb.containerId, breadcrumb.params)}
                color={breadcrumb?.active ? "primary" : "text.primary"}
                sx={{ cursor: "pointer" }}
                underline="none"
              >
                {breadcrumb.caption}
              </Link>
            ))}
          </Breadcrumbs>
          {showTitleOnDesktop && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              alignContent="center"
            >
              <IconButton onClick={handleGoBack}>
                <ArrowBackIcon />
              </IconButton>

              {renderActiveBreadcrumb()}
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
}

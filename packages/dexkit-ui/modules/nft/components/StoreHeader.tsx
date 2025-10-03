import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";

import { useTheme } from "@mui/material";
import Image from "next/image";

interface Props {
  name?: string;
  profileImageURL?: string;
  backgroundImageURL?: string;
  description?: string;
  title?: string;
  createdBy?: string;
}

export function StoreHeader(props: Props) {
  const { profileImageURL, backgroundImageURL, description, title, name } =
    props;
  const theme = useTheme();
  return (
    <Grid container spacing={2}>
      <Grid size={12} sx={{ backgroundImage: `url(${backgroundImageURL})` }}>
        <Box
          sx={{
            display: "flex",
            algnItems: "center",
            alignContent: "center",
            justifyContent: { xs: "left", sm: "left" },
          }}
        >
          {profileImageURL ? (
            <Box
              sx={(theme) => ({
                position: "relative",
                height: theme.spacing(14),
                width: theme.spacing(14),
                borderRadius: "50%",
                borderWidth: 20,
                borderColor: "white",
              })}
            >
              <Image src={profileImageURL} alt={description || " "} fill />
            </Box>
          ) : (
            <Avatar
              sx={(theme) => ({
                height: theme.spacing(14),
                width: theme.spacing(14),
              })}
            />
          )}
        </Box>
      </Grid>
      <Grid size="auto">
        <Typography
          sx={{
            display: "block",
            textOverflow: "ellipsis",
            overflow: "hidden",
            textAlign: { xs: "center", sm: "left" },
          }}
          variant="h5"
          component="h1"
        >
          {name}
        </Typography>
      </Grid>
      {title && (
        <Grid size={12}>
          <Typography
            sx={{
              display: "block",
              textOverflow: "ellipsis",
              overflow: "hidden",
              textAlign: { xs: "center", sm: "left" },
            }}
            variant="body1"
            component="p"
          >
            {title}
          </Typography>
        </Grid>
      )}
      {description && (
        <Grid size={12}>
          <Typography
            sx={{
              display: "block",
              textOverflow: "ellipsis",
              overflow: "hidden",
              textAlign: { xs: "center", sm: "left" },
            }}
            variant="caption"
            component="p"
          >
            {description}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

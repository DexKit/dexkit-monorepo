import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";

export function BaseAssetCardSkeleton() {
  const assetDetails = (
    <>
      {" "}
      <Box
        sx={{
          position: "relative",
          overflow: " hidden",
          paddingTop: "80%",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            position: "absolute",
            display: "block",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <CardContent>
        <Typography variant="caption">
          <Skeleton />
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          <Skeleton />
        </Typography>
      </CardContent>
    </>
  );

  return (
    <Card sx={{ position: "relative", heigh: "100%", borderRadius: "12px" }}>
      <CardActionArea>{assetDetails}</CardActionArea>
    </Card>
  );
}

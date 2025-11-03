import { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Link from "./AppLink";
import NavbarMenuAlt from "./NavbarMenuAlt";

interface Props {
  appConfig: AppConfig;
  isPreview?: boolean;
}

export default function NavbarAlt({ appConfig, isPreview }: Props) {
  return (
    <>
      {(appConfig.menuSettings?.layout?.type === "navbar" &&
        appConfig.menuSettings?.layout.variant === "alt" && (
          <Paper square variant="elevation" sx={{ py: 2 }}>
            <Container>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                {appConfig.menuTree?.map((menu, index) =>
                  menu.children ? (
                    <NavbarMenuAlt menu={menu} key={index} />
                  ) : (
                    <Button
                      color="inherit"
                      href={isPreview ? "#" : menu.href || "/"}
                      sx={{ fontWeight: 600, textDecoration: "none" }}
                      key={index}
                      LinkComponent={Link}
                      startIcon={
                        menu.data?.iconName ? (
                          <Icon>{menu.data?.iconName}</Icon>
                        ) : undefined
                      }
                    >
                      {menu.name}
                    </Button>
                  )
                )}
              </Stack>
            </Container>
          </Paper>
        )) ||
        null}
    </>
  );
}

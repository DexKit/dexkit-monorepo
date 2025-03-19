import { parseTheme } from "@dexkit/ui/utils/theme";
import {
  Button,
  Card,
  CardContent,
  Container,
  Experimental_CssVarsProvider,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

export default function CustomThemePage() {
  const appTheme = useMemo(() => {
    const parsedTHeme = parseTheme({
      shape: { borderRadius: 0 },
      palette: { type: "simple", colors: { primary: "#000" } },
    });

    return parsedTHeme;
  }, []);

  return (
    <Container>
      <Experimental_CssVarsProvider theme={appTheme} defaultMode="light">
        <Button>Hello</Button>
        <Button variant="contained">Hello</Button>
        <Button variant="contained" color="secondary">
          Hello
        </Button>
        <Button variant="contained" color="success">
          Hello
        </Button>
        <Button variant="contained" color="warning">
          Hello
        </Button>
        <Button variant="contained" color="error">
          Hello
        </Button>

        <div>
          <Card>
            <CardContent>
              <Typography>Hello</Typography>
            </CardContent>
          </Card>
        </div>
      </Experimental_CssVarsProvider>
    </Container>
  );
}

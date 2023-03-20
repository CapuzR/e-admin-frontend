import * as React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  useTheme,
} from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { AppRouter } from "./AppRouter.jsx";

function BRAssetManagement() {
  const themeQuery = useTheme();
  const mobileBreakpoint = useMediaQuery(themeQuery.breakpoints.up("md"));
  const theme = createTheme({
    palette: {
      primary: {
        main: "#666",
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
            <AppRouter isMobile={mobileBreakpoint ? false : true} />
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default BRAssetManagement;
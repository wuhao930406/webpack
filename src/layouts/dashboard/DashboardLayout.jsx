import { useState } from "react";
import { Outlet } from "@umijs/max";
// @mui
import { styled } from "@mui/material/styles";
import { Scrollbars } from "react-custom-scrollbars";
import Header from "./header";
import Nav from "./nav";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 64;

const StyledRoot = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "hidden",
  height: "100vh",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: 0,
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>
        <Scrollbars
          thumbMinSize={10}
          autoHide
          style={{
            width: "100%",
            height: "100%",
          }}
          hideTracksWhenNotNeeded
        >
          <Outlet />
        </Scrollbars>
      </Main>
    </StyledRoot>
  );
}

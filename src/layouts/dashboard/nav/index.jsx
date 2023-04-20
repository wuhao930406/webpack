import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation,useModel } from "@umijs/max";

// @mui
import {
  Box,
  Drawer,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// mock
import account from "@/_mock/account";
// hooks
import useResponsive from "@/hooks/useResponsive";
// components
import Logo from "@/components/logo";
import { Scrollbars } from "react-custom-scrollbars";
import NavSection from "@/components/nav-section";
import navConfig from "./config";


Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive("up", "lg");


  const {
    initialState: { nav },
    setInitialState,
  } = useModel("@@initialState");


  const setnav = (fn) => {
    const res = fn(nav);
    setInitialState(s=>({
      ...s,
      nav:res
    }))
  }

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const ifs = nav === 88;

  const renderContent = (
    <Box
      sx={{
        height: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Logo />
        {!ifs && (
          <Typography
            component="b"
            sx={{ fontSize: 16, paddingLeft: "10px", fontWeight: "bold" }}
            noWrap
          >
            精密测量虚拟仿真实训平台
          </Typography>
        )}
      </Box>

      <Box sx={{ px: 1, pb: 3, mt: 7 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{ pt: ifs ? 0 : 5, borderRadius: 2, position: "relative" }}
        >
          <Box
            component="img"
            src={account.photoURL}
            sx={{
              width: "70%",
              maxWidth: 100,
              position: "absolute",
              top: -50,
              borderRadius: 60,
              cursor: "pointer",
            }}
          />
          {!ifs && (
            <Box sx={{ textAlign: "center" }}>
              <Typography gutterBottom variant="h6">
                {account.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {account.role}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      <Box component={"div"} sx={{ flex: 1, overflow: "hidden" }}>
        <Scrollbars
          thumbMinSize={10}
          autoHide
          style={{
            width: "100%",
            height: "100%",
          }}
          hideTracksWhenNotNeeded
        >
          <NavSection collspan={ifs} data={navConfig} />
        </Scrollbars>
      </Box>
      <Box
        component={"div"}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        width="100%"
      >
        <Button
          fullWidth
          size="large"
          sx={{ margin: 1, backgroundColor: "rgba(0,0,0,0.04)", color: "#666" }}
          onClick={() => {
            setnav((s) => {
              if (s === 280) {
                return 88;
              } else {
                return 280;
              }
            });
          }}
        >
          <ChevronLeftIcon
            style={{
              transform: ifs ? "rotate(180deg)" : "rotate(0deg)",
              
            }}
          />
          <span>{ifs ? "" : "收起"}</span>
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: nav },
        
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: nav,
              
              bgcolor: "background.default",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: nav, transition: "all 0.4s" },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

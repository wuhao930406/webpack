import { useLocation, useModel ,history} from "@umijs/max";
import PropTypes from "prop-types";
import { useEffect } from "react";

// @mui
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Avatar, Box, Button, Drawer, Stack, Typography } from "@mui/material";
// mock
// hooks
import useResponsive from "@/hooks/useResponsive";
// components
import Logo from "@/components/logo";
import NavSection from "@/components/nav-section";
import { Scrollbars } from "react-custom-scrollbars";
import navConfig from "./config";

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive("up", "lg");

  const {
    initialState: { nav, currentUser },
    setInitialState,
  } = useModel("@@initialState");

  const setnav = (fn) => {
    const res = fn(nav);
    setInitialState((s) => ({
      ...s,
      nav: res,
    }));
  };

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

      <Box sx={{ px: 1, pb: 1.5, mt: 7 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{ pt: ifs ? 0 : 5, borderRadius: 2, position: "relative" }}
        >
          <Avatar
            src={currentUser?.picUrl ?? DEFAULT_HEAD_IMG}
            sx={{
              width: ifs ? "2.5vw" : "12vw",
              height: ifs ? "2.5vw" : "12vw",
              maxWidth: 100,
              maxHeight: 100,
              position: "absolute",
              top: -46,
              borderRadius: 600,
              cursor: "pointer",
              boxShadow: "0 0 6px #999",
            }}
            onClick={()=>{
              history.push("/work/usercenter")
            }}
          />
          {!ifs && (
            <Box sx={{ textAlign: "center" }}>
              <Typography gutterBottom variant="h6" mt={1.2}>
                {currentUser?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                角色:{currentUser?.typeName}
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

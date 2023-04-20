import React, { useState } from "react";
import { Link, Box, Typography, Container } from "@mui/material";
import { Outlet } from "@umijs/max";
import Logo from "@/components/logo";
import "./index.less";

function LoginLayout() {
  return (
    <div className="wrap">
      <Container
        component="main"
        maxWidth="md"
        style={{
          display: "flex",
          alignItems: "center",
          boxShadow: "0 0 36px #999",
          padding: 0,
          borderRadius: 12,
        }}
      >
        <Box
          className="left"
          sx={{
            width: 550,
            overflow: "hidden",
          }}
          borderRadius={"12px 0px 0px 12px"}
        >
          <video
            style={{ width: "100%" }}
            muted
            loop
            autoPlay
            src="https://ng-website.oss-cn-hangzhou.aliyuncs.com/video.mp4"
          />
        </Box>

        <Box
          className="right"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: 600,
            padding: 4,
          }}
          borderRadius={"0px 12px 12px 0px"}
        >
          <Logo></Logo>
          <Typography component="h1" variant="h5" mt={1} mb={1}>
            精密测量虚拟仿真实训平台
          </Typography>

          <Outlet></Outlet>
        </Box>
      </Container>
      <Box sx={{ position: "absolute", bottom: 12 }}>
        <Typography variant="body2" color="textSecondary" align="center">
          {"© "}
          <Link color="inherit" href="/">
            My App
          </Link>{" "}
          {new Date().getFullYear()}
        </Typography>
      </Box>
    </div>
  );
}

export default LoginLayout;

import React, { useState } from "react";
import { Button, TextField, Link, Grid, Typography, Box } from "@mui/material";
import "./index.less";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // 非空校验
    if (!username) {
      setEmailError(true);
    }

    if (!password) {
      setPasswordError(true);
    }

    // 提交表单逻辑
    // ...
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography component="p" style={{ textAlign: "center" }}>
        教师注册
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="手机号"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
          setEmailError(false);
        }}
        error={emailError}
        helperText={emailError && "请输入您的手机号"}
        variant="standard"
      />
       <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="验证码"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setPasswordError(false);
        }}
        error={passwordError}
        helperText={passwordError && "请输入您的验证码"}
        variant="standard"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="密码"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setPasswordError(false);
        }}
        error={passwordError}
        helperText={passwordError && "请输入您的密码"}
        variant="standard"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="选择院校"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setPasswordError(false);
        }}
        error={passwordError}
        helperText={passwordError && "请输入您的密码"}
        variant="standard"
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        注册
      </Button>
      <Grid container>
        <Grid item xs></Grid>
        <Grid item>
          <Link href="#/user/login" variant="body2">
            {"已有账号，立即登录"}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Signup;

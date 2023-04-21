import { doFetch } from "@/utils/doFetch";
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import { history, useModel } from "@umijs/max";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import ECB from "crypto-js/mode-ecb";
import Pkcs7 from "crypto-js/pad-pkcs7";
import dayjs from "dayjs";
import { useState } from "react";
import "./index.less";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { initialState, setInitialState } = useModel("@@initialState");
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo();
    if (userInfo) {
      await setInitialState((s) => {
        return { ...s, currentUser: userInfo };
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // 非空校验
    if (!username) {
      setEmailError(true);
    }

    if (!password) {
      setPasswordError(true);
    }

    let timestamp = dayjs().valueOf().toString() + "acb";
    let newtimestamp = AES.encrypt(timestamp, Utf8.parse("NANGAODEAESKEY--"), {
      mode: ECB,
      padding: Pkcs7,
    }).toString();
    let passwordsrc = AES.encrypt(password, Utf8.parse(timestamp), {
      mode: ECB,
      padding: Pkcs7,
    }).toString();
    const postdata = {
      userAccount: username,
      password: passwordsrc,
      encryptKey: newtimestamp,
    };
    let res = await doFetch({ url: "/system/login", params: { ...postdata } });
    let token = res?.data?.data?.token ?? null;
    if (token) {
      localStorage.setItem("TOKENES", token);
      await fetchUserInfo();
      history.replace("/work");
    }

    // 提交表单逻辑
    // ...
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography component="p" style={{ textAlign: "center" }}>
        欢迎登录
      </Typography>

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="用户名/学号"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
          setEmailError(false);
        }}
        error={emailError}
        helperText={emailError && "请输入您的用户名/学号"}
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
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        登录
      </Button>
      <Grid container>
        <Grid item xs>
          {/* <Link href="#/" variant="body2">
            忘记密码？
          </Link> */}
        </Grid>
        <Grid item>
          <Link href="#/user/signup" variant="body2">
            {"没有账号？注册"}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;

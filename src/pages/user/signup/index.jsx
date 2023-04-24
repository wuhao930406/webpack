import { doFetch } from "@/utils/doFetch";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { history, useModel } from "@umijs/max";
import { useRequest } from "ahooks";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import ECB from "crypto-js/mode-ecb";
import Pkcs7 from "crypto-js/pad-pkcs7";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import "./index.less";

function Signup() {
  const [type, settype] = React.useState("2");
  const [name, setname] = React.useState();
  const [userAccount, setUserAccount] = useState("");
  const [password, setPassword] = useState("");
  const [cfpwd, setcfpwd] = useState("");
  const [schoolId, setschoolId] = useState();
  const [departmentId, setdepartmentId] = useState("");
  const [classId, setclassId] = useState("");
  const [telephone, settelephone] = useState();
  const [email, setemail] = useState();
  const scorllRef = useRef();

  const { initialState, setInitialState } = useModel("@@initialState");

  const handleChange = (event) => {
    settype(event.target.value);
  };

  const handleChanges = (event) => {
    setschoolId(event.target.value);
    setdepartmentId(null);
    setclassId(null);
    setTimeout(() => {
      setdepartmentId("");
      setclassId("");
    }, 10);
    setschoolIdError(false);
  };

  const handleChangec = (event) => {
    setdepartmentId(event.target.value);
    setclassId(null);
    setTimeout(() => {
      setclassId("");
    }, 10);
    setdepartmentIdError(false);
  };

  const handleChanged = (event) => {
    setclassId(event.target.value);
    setclassIdError(false);
  };

  const [userAccountError, setUserAccountError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [cfpwdError, setcfpwdError] = useState(false);
  const [schoolIdError, setschoolIdError] = useState(false);
  const [departmentIdError, setdepartmentIdError] = useState(false);
  const [classIdError, setclassIdError] = useState(false);
  const [telephoneError, settelephoneError] = useState(false);
  const [emailError, setemailError] = useState(false);
  const [nameError, setnameError] = React.useState();

  const { data } = useRequest(async () => {
    let res = await doFetch({
      url: "/organization/school/selection",
      params: {},
    });
    return res?.data?.dataList;
  }, {});

  const dep = useRequest(
    async () => {
      let res = await doFetch({
        url: "/organization/department/selection",
        params: { parentId: schoolId },
      });
      return res?.data?.dataList;
    },
    {
      refreshDeps: [schoolId],
    }
  );

  const cls = useRequest(
    async () => {
      let res = await doFetch({
        url: "/class/selection",
        params: { departmentId: departmentId },
      });
      return res?.data?.dataList;
    },
    {
      refreshDeps: [departmentId],
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    let ifs = true;
    // 非空校验
    if (!userAccount) {
      setUserAccountError(true);
      ifs = false;
    }

    

    if (!name) {
      setnameError(true);
      ifs = false;
    }
    


    if (!password) {
      setPasswordError(true);
      ifs = false;
    }
    


    if (!cfpwd) {
      setcfpwdError(true);
      ifs = false;
    }
    


    if (!schoolId) {
      setschoolIdError(true);
      ifs = false;
    }
    


    if (!departmentId) {
      setdepartmentIdError(true);
      ifs = false;
    }
    


    if (type === "3" && !classId) {
      setclassIdError(true);
      ifs = false;
    }
    


    if (!telephone) {
      settelephoneError(true);
      ifs = false;
    }
    


    if (cfpwdError) {
      ifs = false;
    }

    console.log(ifs,cfpwdError);
    if (!ifs) {
      return;
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
    // 提交表单逻辑
    // ...
    const postdata = {
      userAccount,
      type,
      encryptKey: newtimestamp,
      password: passwordsrc,
      schoolId,
      departmentId,
      classId,
      telephone,
      email,
      name,
    };
    doFetch({ url: "/system/register", params: { ...postdata } }).then(
      (res) => {
        if (res?.code === "0000") {
          setInitialState((s) => ({
            ...s,
            message: {
              ...s.message,
              open: true,
              content: "已提交注册申请，请等待审核",
              type: "success",
            },
          }));
          history.push("/user/login");
        }
      }
    );
  };

  useEffect(() => {
    setTimeout(() => {
      scorllRef.current.scrollToTop();
    }, 0);
  }, [scorllRef]);
  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography component="p" style={{ textAlign: "center" }}>
        注册
      </Typography>
      <Box height={260} width={260} mt={2}>
        <Scrollbars
          thumbMinSize={10}
          autoHide
          style={{
            width: "100%",
            height: "100%",
          }}
          hideTracksWhenNotNeeded
          ref={scorllRef}
        >
          <Box pr={1}>
            <FormControl>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                width={260}
              >
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={type}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="教师"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="学生"
                  />
                </RadioGroup>
              </Box>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              id="userAccount"
              label={type === "2" ? "请输入教职工号" : "请输入学号"}
              name="userAccount"
              autoComplete="userAccount"
              autoFocus
              value={userAccount}
              onChange={(event) => {
                setUserAccount(event.target.value);
                setUserAccountError(false);
              }}
              error={userAccountError}
              helperText={
                userAccountError &&
                (type === "2" ? "请输入教职工号" : "请输入学号")
              }
              variant="standard"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label={"姓名"}
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(event) => {
                setname(event.target.value);
                setnameError(false);
              }}
              error={nameError}
              helperText={nameError && "请输入真实姓名"}
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
                if (cfpwd !== event.target.value) {
                  setcfpwdError(true);
                } else {
                  setcfpwdError(false);
                }
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
              name="cfpwd"
              label="确认密码"
              type="password"
              id="cfpwd"
              autoComplete="current-password"
              value={cfpwd}
              onChange={(event) => {
                setcfpwd(event.target.value);
                if (password !== event.target.value) {
                  setcfpwdError(true);
                  return;
                }
                setcfpwdError(false);
              }}
              error={cfpwdError}
              helperText={
                !cfpwd && cfpwdError
                  ? "请确认密码"
                  : cfpwdError
                  ? "两次密码不一致"
                  : ""
              }
              variant="standard"
            />

            <FormControl
              required
              variant="standard"
              sx={{ width: "100%", mt: 2, mb: 1 }}
              error={schoolIdError}
              helperText={schoolIdError && "请选择学校"}
            >
              <InputLabel id="demo-simple-select-standard-label">
                选择学校
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={schoolId}
                onChange={handleChanges}
                label="选择学校"
              >
                {data?.map?.((it, i) => (
                  <MenuItem value={it?.value}>{it?.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {departmentId || departmentId === "" ? (
              <FormControl
                required
                variant="standard"
                sx={{ width: "100%", mt: 2, mb: 1 }}
                error={departmentIdError}
                helperText={departmentIdError && "请选择院系"}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  选择院系
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={departmentId}
                  onChange={handleChangec}
                  label="选择院系"
                >
                  {dep?.data?.map?.((it, i) => (
                    <MenuItem value={it?.value}>{it?.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Box height={68}></Box>
            )}
            {type === "2" ? null : classId || classId === "" ? (
              <FormControl
                required
                variant="standard"
                sx={{ width: "100%", mt: 2, mb: 1 }}
                error={classIdError}
                helperText={classIdError && "请选择班级"}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  选择班级
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={classId}
                  onChange={handleChanged}
                  label="选择班级"
                >
                  {cls?.data?.map?.((it, i) => (
                    <MenuItem value={it?.value}>{it?.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Box height={68}></Box>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="telephone"
              label={"请输入手机号"}
              name="telephone"
              autoComplete="telephone"
              autoFocus
              value={telephone}
              onChange={(event) => {
                settelephone(event.target.value);
                function isChinaPhoneNumber(phoneNumber) {
                  const regExp = /^1[3-9]\d{9}$/;
                  return regExp.test(phoneNumber);
                }
                if (!isChinaPhoneNumber(event.target.value)) {
                  settelephoneError(true);
                  return;
                }
                settelephoneError(false);
              }}
              error={telephoneError}
              helperText={
                telephoneError && !telephone
                  ? "请输入您的手机号"
                  : telephoneError
                  ? "手机号格式不正确"
                  : ""
              }
              variant="standard"
            />

            <TextField
              margin="normal"
              fullWidth
              id="email"
              label={"请输入邮箱"}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(event) => {
                setemail(event.target.value);
                function isChinaEmail(email) {
                  const regExp =
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                  return regExp.test(email);
                }
                if (!isChinaEmail(event.target.value)) {
                  setemailError(true);
                  return;
                }

                setemailError(false);
              }}
              error={emailError}
              helperText={emailError ? "邮箱格式不正确" : ""}
              variant="standard"
            />
          </Box>
        </Scrollbars>
      </Box>

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

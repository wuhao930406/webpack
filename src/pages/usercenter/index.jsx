import { doFetch } from "@/utils/doFetch";
import { ProDescriptions } from "@ant-design/pro-components";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import {
  Box,
  Card,
  Container,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useModel } from "@umijs/max";
import * as Antd from "antd";
import { useState } from "react";
import Fade from "react-reveal/Fade";
import Head from "./head";
import "./index.less";

const { Col, Row, Input } = Antd;

function isValidChinesePhoneNumber(phoneNumber) {
  const regEx = /^1[3-9]\d{9}$/;
  return regEx.test(phoneNumber);
}

function isChinaEmail(email) {
  const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regExp.test(email);
}

function Usercenter() {
  const {
    initialState: { fetchUserInfo, currentUser },
    setInitialState,
  } = useModel("@@initialState");

  const dofetchUserInfo = async () => {
    const userInfo = await fetchUserInfo();
    if (userInfo) {
      await setInitialState((s) => {
        return { ...s, currentUser: userInfo };
      });
    }
  };

  const [edit, setedit] = useState(false);
  const [telephone, settelephone] = useState(currentUser?.telephone);
  const [email, setemail] = useState(currentUser?.email);

  return (
    <Container maxWidth={false} className="diystyles">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ mb: 2.5 }}
        mt={0}
      >
        <Typography variant="h5">个人信息</Typography>
      </Box>
      <Row gutter={20} wrap={false}>
        <Col flex="420px">
          <Card
            style={{
              height: 488,
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              paddingTop: "18%",
            }}
          >
            <Head
              defaultImg={currentUser?.picUrl}
              dofetchUserInfo={dofetchUserInfo}
            ></Head>
            <Typography variant="span" align="center" mt={1} mb={3} color={"#999"}>
              支持的格式 *.jpeg, *.jpg, *.png, *.gif <br /> 文件不大于 2 MB
            </Typography>
            <div style={{ height: 48, position: "relative", width: 192 }}>
              <div style={{ position: "absolute", top: 0, left: 0 }}>
                <Fade top when={!edit}>
                  <>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={1}
                    >
                      <PhoneIcon style={{ fontSize: 16 }}></PhoneIcon>
                      <Typography>
                        {currentUser?.telephone || "未填写手机号"}
                      </Typography>
                    </Stack>
                    <Stack
                      justifyContent={"center"}
                      direction={"row"}
                      alignItems={"center"}
                      gap={1}
                      mt={1}
                    >
                      <EmailIcon style={{ fontSize: 16 }}></EmailIcon>
                      <Typography>
                        {currentUser?.email || "未填写邮箱"}
                      </Typography>
                    </Stack>
                  </>
                </Fade>
              </div>
              <div style={{ position: "absolute", top: 0 }}>
                <Fade top when={edit}>
                  <>
                    <Input
                      placeholder="请输入手机号"
                      allowClear
                      prefix={
                        <PhoneIcon
                          style={{
                            fontSize: 14,
                            color: !isValidChinesePhoneNumber(telephone)
                              ? "red"
                              : "#333",
                          }}
                        />
                      }
                      value={telephone}
                      onChange={(e) => {
                        settelephone(e.target.value);
                      }}
                    ></Input>
                    <Input
                      placeholder="请输入邮箱"
                      allowClear
                      prefix={
                        <EmailIcon
                          style={{
                            fontSize: 14,
                            color: !isChinaEmail(email) ? "red" : "#333",
                          }}
                        />
                      }
                      value={email}
                      onChange={(e) => {
                        setemail(e.target.value);
                      }}
                      style={{ marginTop: 12 }}
                    ></Input>
                  </>
                </Fade>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: -72,
                  right: 0,
                  left: 0,
                  margin: "auto",
                  width: "100%",
                  height: 32,
                  zIndex: !edit ? 9 : -1,
                }}
                className="center"
              >
                <Fade bottom when={!edit}>
                  <Tooltip title="编辑">
                    <IconButton
                      sx={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                      onClick={() => {
                        setedit(true);
                        settelephone(currentUser?.telephone);
                        setemail(currentUser?.email);
                      }}
                    >
                      <EditIcon
                        style={{
                          fontSize: 18,
                          cursor: "pointer",
                          color: "#3d87df",
                        }}
                      ></EditIcon>
                    </IconButton>
                  </Tooltip>
                </Fade>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: -88,
                  right: 0,
                  left: 0,
                  margin: "auto",
                  width: "100%",
                  height: 32,
                }}
                className="center"
              >
                <Fade bottom when={edit}>
                  <Stack direction={"row"} gap={2}>
                    <Tooltip title="取消">
                      <IconButton
                        onClick={() => {
                          setedit(false);
                        }}
                        sx={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      >
                        <CloseIcon
                          style={{
                            fontSize: 18,
                            cursor: "pointer",
                            color: "#000",
                            fontWeight: "blod",
                          }}
                        ></CloseIcon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        !isValidChinesePhoneNumber(telephone)
                          ? "手机号格式错误"
                          : !isChinaEmail(email)
                          ? "邮箱格式错误"
                          : "提交"
                      }
                    >
                      <IconButton
                        style={{ boxShadow: " 0 0 12px rgba(0,0,0,0.2)" }}
                        onClick={async () => {
                          let res = await doFetch({
                            url: "/user/updateTelephoneAndEmail",
                            params: { telephone, email },
                          });
                          if (res?.code === "0000") {
                            setedit(false);
                            await dofetchUserInfo();
                          }
                        }}
                      >
                        {isValidChinesePhoneNumber(telephone) &&
                        isChinaEmail(email) ? (
                          <CheckIcon
                            style={{
                              fontSize: 18,
                              cursor: "pointer",
                              color: "#3d87df",
                              fontWeight: "blod",
                            }}
                          ></CheckIcon>
                        ) : (
                          <PriorityHighIcon
                            style={{
                              fontSize: 18,
                              cursor: "pointer",
                              color: "red",
                              fontWeight: "blod",
                            }}
                          ></PriorityHighIcon>
                        )}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Fade>
              </div>
            </div>
          </Card>
        </Col>
        <Col flex={1}>
          <Card style={{ height: 488, flexDirection: "column", padding: 24 }}>
            <ProDescriptions
              column={1}
              columns={[
                { title: "用户类型", dataIndex: "typeName", key: "typeName" },
                {
                  title: "用户账号",
                  dataIndex: "userAccount",
                  key: "userAccount",
                },
                // { title: "邮箱", dataIndex: "email", key: "email" },
                { title: "学校", dataIndex: "schoolName", key: "schoolName" },
                {
                  title: "院系",
                  dataIndex: "departmentName",
                  key: "departmentName",
                },
                { title: "班级", dataIndex: "className", key: "className" },
              ]}
              dataSource={currentUser}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Usercenter;

import { doFetch } from "@/utils/doFetch";
import { ProDescriptions } from "@ant-design/pro-components";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PhoneIcon from "@mui/icons-material/Phone";
import { Box, Card, Container, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useModel } from "@umijs/max";
import * as Antd from "antd";
import { useState } from "react";
import Fade from "react-reveal/Fade";
import Head from "./head";
import "./index.less"

const { Col, Row, Input } = Antd;

function isValidChinesePhoneNumber(phoneNumber) {
  const regEx = /^1[3-9]\d{9}$/;
  return regEx.test(phoneNumber);
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
            style={{ height: 436, flexDirection: "column" }}
            className="center"
          >
            <Head
              defaultImg={currentUser?.picUrl}
              dofetchUserInfo={dofetchUserInfo}
            ></Head>
            <Typography variant="span" align="center" mt={1} mb={3}>
              支持的格式 *.jpeg, *.jpg, *.png, *.gif <br /> 文件不大于 2 MB
            </Typography>
            <div style={{ height: 48, position: "relative", width: 192 }}>
              <div style={{ position: "absolute", bottom: 6 }}>
                <Fade left when={!edit}>
                  <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <PhoneIcon style={{ fontSize: 16 }}></PhoneIcon>
                    <Typography>
                      {currentUser?.telephone || "请填写手机号"}
                    </Typography>
                  </Stack>
                </Fade>
              </div>
              <div style={{ position: "absolute", bottom: 0 }}>
                <Fade left when={edit}>
                  <Input
                    placeholder="请输入手机号"
                    allowClear
                    prefix={
                      <PhoneIcon
                        style={{
                          fontSize: 14,
                        }}
                      />
                    }
                    value={telephone}
                    onChange={(e) => {
                      settelephone(e.target.value);
                    }}
                    style={{ width: 160 }}
                  ></Input>
                </Fade>
              </div>
              <div style={{ position: "absolute", bottom: 3, right: 0 }}>
                {edit ? (
                  <IconButton size="small">
                    {isValidChinesePhoneNumber(telephone) ? (
                      <CheckIcon
                        style={{
                          fontSize: 18,
                          cursor: "pointer",
                          color: "#3d87df",
                          fontWeight: "blod",
                        }}
                        onClick={async () => {
                          let res = await doFetch({
                            url: "/user/updateTelephone",
                            params: { telephone },
                          });
                          if (res?.code === "0000") {
                            setedit(false);
                            await dofetchUserInfo();
                          }
                        }}
                      ></CheckIcon>
                    ) : (
                      <CloseIcon
                        style={{
                          fontSize: 18,
                          cursor: "pointer",
                          color: "#ff4800",
                          fontWeight: "blod",
                        }}
                        onClick={() => {
                          setedit(false);
                        }}
                      ></CloseIcon>
                    )}
                  </IconButton>
                ) : (
                  <IconButton size="small">
                    <EditIcon
                      style={{
                        fontSize: 18,
                        cursor: "pointer",
                        color: "#3d87df",
                      }}
                      onClick={() => {
                        setedit(true);
                      }}
                    ></EditIcon>
                  </IconButton>
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col flex={1}>
          <Card
            style={{ height: 436, flexDirection: "column",padding:24 }}
          >
            <ProDescriptions
              column={1}  
              columns={[
                { title: "用户类型", dataIndex: "typeName", key: "typeName" },
                {
                  title: "用户账号",
                  dataIndex: "userAccount",
                  key: "userAccount",
                },
                { title: "邮箱", dataIndex: "email", key: "email" },
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

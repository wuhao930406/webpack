import AutoTable from "@/components/AutoTable";
import ImportExcel from "@/components/ImportExcel";
import PremButton from "@/components/PremButton";
import { Box, Container, Stack, Typography } from "@mui/material";
import * as Antd from "antd";
import { useMemo, useRef } from "react";
import "./index.less";

const { message } = Antd;
const { Paragraph } = Antd.Typography;

function Class() {
  const actionRef = useRef();

  const columns = useMemo(
    () => [
      {
        title: "操作时间",
        dataIndex: "operateTime",
        key: "operateTimeRange",
        valueType: "dateTimeRange",
      },
      { title: "操作人", dataIndex: "operateUserName", key: "operateUserName" },
      {
        title: "操作类型",
        dataIndex: "operateTypeName",
        key: "operateType",
        valueType: "select",
        options: [
          { label: "登录", value: "1" },
          { label: "退出", value: "2" },
          { label: "新增", value: "3" },
          { label: "修改", value: "4" },
          { label: "删除", value: "5" },
          { label: "查看", value: "6" },
          { label: "导入", value: "7" },
          { label: "导出", value: "8" },
        ],
      },
      { title: "操作内容", dataIndex: "operateContent", key: "operateContent" },
      { title: "MAC地址", dataIndex: "mac", key: "mac" },
      { title: "ip地址", dataIndex: "ip", key: "ip" },
    ],
    []
  );

  return (
    <Container maxWidth={false}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ mb: 2.5 }}
        mt={0}
      >
        <Typography variant="h5">模型管理</Typography>
        <Stack spacing={2} direction="row">
          <ImportExcel></ImportExcel>
          <PremButton
            btn={{
              variant: "contained",
              onClick: (e) => {
                e.stopPropagation();
                setdialogprops({
                  open: true,
                  defaultFormValue: {},
                  title: "新增模型",
                });
              },
            }}
          >
            新增模型
          </PremButton>
        </Stack>
      </Box>

      <Box boxShadow={"0 0 18px #f0f0f0"} borderRadius={2}>
        <AutoTable
          actionRef={actionRef}
          scroll={{ x: 1366 }}
          columns={[...columns]}
          path="/log/page"
          rerendered={false}
        ></AutoTable>
      </Box>
    </Container>
  );
}

export default Class;

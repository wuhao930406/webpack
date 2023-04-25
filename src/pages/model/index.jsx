import AutoTable from "@/components/AutoTable";
import DraggableDialog from "@/components/DraggableDialog";
import ImportExcel from "@/components/ImportExcel";
import InitForm from "@/components/InitForm";
import PremButton from "@/components/PremButton";
import { doFetch } from "@/utils/doFetch";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useRequest } from "ahooks";
import * as Antd from "antd";
import { useMemo, useRef, useState } from "react";
import "./index.less";

const { message } = Antd;
const { Paragraph } = Antd.Typography;

function Class() {
  const actionRef = useRef(),
    actionRefs = useRef();
  const [dialogprops, setdialogprops] = useState({
    open: false,
  });
  const [active, setactive] = useState("1");

  const handleClose = () => {
    setdialogprops((s) => ({
      ...s,
      open: false,
    }));
  };

  const { runAsync, loading } = useRequest(doFetch, {
    manual: true,
    onSuccess: (res, parames) => {
      if (res?.code == "0000") {
        handleClose();
        message.success("操作成功");
        if (active === "1") {
          actionRef?.current?.reload();
        } else {
          actionRefs?.current?.reload();
        }
      }
    },
  });

  const edit = (text, row, _, action) => {
    return (
      <PremButton
        btn={{
          size: "small",
          variant: "text",
          onClick: () => {
            setdialogprops({
              open: true,
              defaultFormValue: { ...row },
              title: "编辑",
            });
          },
        }}
      >
        编辑
      </PremButton>
    );
  };

  const remove = (text, row, _, action) => {
    return (
      <PremButton
        pop={{
          title: "是否删除该模型?",
          okText: "确认",
          cancelText: "取消",
          onConfirm: async () => {
            await runAsync({
              url: "/model/delete",
              params: { id: row.id },
            });
          },
        }}
        btn={{
          size: "small",
          color: "error",
        }}
      >
        删除
      </PremButton>
    );
  };

  const columns = useMemo(
    () => [
      { title: "模型名称", dataIndex: "modelName", key: "modelName" },
      {
        title: "模型预览的地址",
        dataIndex: "url",
        key: "url",
        search: false,
        render: (text, row) => {
          return (
            <Paragraph
              copyable={{
                text: row?.url,
              }}
            >
              <a href={row?.url} target="_blank">
                {row?.url}
              </a>
            </Paragraph>
          );
        },
      },
    ],
    []
  );

  return (
    <Container maxWidth={false}>
      <DraggableDialog
        handleClose={handleClose}
        loading={loading}
        dialogprops={dialogprops}
        maxWidth={dialogprops?.maxWidth ?? "sm"}
      >
        <InitForm
          fields={columns}
          defaultFormValue={dialogprops?.defaultFormValue}
          onFinish={(val, extra) => {
            let postdata = { ...val };
            switch (dialogprops?.title) {
              case "编辑":
                postdata = {
                  ...val,
                  id: dialogprops?.defaultFormValue?.id,
                };
                break;
              default:
                break;
            }
            runAsync({
              url: "/model/saveOrUpdate",
              params: postdata,
            });
          }}
        ></InitForm>
      </DraggableDialog>

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
          columns={[
            ...columns,
            {
              title: "操作",
              valueType: "option",
              width: 200,
              render: (text, row, _, action) => [
                edit(text, row, _, action),
                remove(text, row, _, action),
              ],
            },
          ]}
          path="/model/page"
          rerendered={false}
        ></AutoTable>
      </Box>
    </Container>
  );
}

export default Class;

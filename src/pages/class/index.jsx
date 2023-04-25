import AutoTable from "@/components/AutoTable";
import DraggableDialog from "@/components/DraggableDialog";
import ImportExcel from "@/components/ImportExcel";
import InitForm from "@/components/InitForm";
import PremButton from "@/components/PremButton";
import { doFetch } from "@/utils/doFetch";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useRequest } from "ahooks";
import { message } from "antd";
import { useMemo, useRef, useState } from "react";
import "./index.less";

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
          title: "是否删除该班级?",
          okText: "确认",
          cancelText: "取消",
          onConfirm: async () => {
            await runAsync({
              url: "/class/delete",
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
      {
        title: "班级名称",
        dataIndex: "className",
        key: "className",
        colProps: {
          span: 24,
        },
      },
      {
        title: "学校名称",
        dataIndex: "schoolName",
        key: "schoolId",
        valueType: "select",
        options: { path: "/organization/school/selection", params: {} },
      },
      {
        title: "院系名称",
        dataIndex: "departmentName",
        key: "departmentId",
        valueType: "select",
        options: {
          path: "/organization/department/selection",
          linkParams: { schoolId: "parentId" },
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
              url: "/class/saveOrUpdate",
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
        <Typography variant="h5">班级管理</Typography>
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
                  title: "新增班级",
                });
              },
            }}
          >
            新增班级
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
          path="/class/page"
          rerendered={false}
        ></AutoTable>
      </Box>
    </Container>
  );
}

export default Class;

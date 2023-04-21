import AutoTable from "@/components/AutoTable";
import DraggableDialog from "@/components/DraggableDialog";
import ImportExcel from "@/components/ImportExcel";
import InitForm from "@/components/InitForm";
import PremButton from "@/components/PremButton";
import { doFetch } from "@/utils/doFetch";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useModel } from "@umijs/max";
import { useRequest } from "ahooks";
import { useRef, useState } from "react";
import "./index.less";

const columns = [
    {
      title: "学校名称",
      dataIndex: "organizationName",
      key: "organizationName",
      colProps: {
        span: 24,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "省份",
      dataIndex: "provinceName",
      key: "provinceId",
      valueType: "select",
      options: { path: "/province/selection", params: {} },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "城市",
      dataIndex: "cityName",
      key: "cityId",
      valueType: "select",
      options: { path: "/city/selection", linkParams: { provinceId: "" } },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
  ],
  columnes = [
    {
      title: "院系名称",
      dataIndex: "organizationName",
      key: "organizationName",
      colProps: {
        span: 24,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
  ];

function Organization() {
  const actionRef = useRef();
  const [dialogprops, setdialogprops] = useState({
    open: false,
  });
  const [expandedRowKeys, onExpandedRowsChange] = useState([]);

  const handleClose = () => {
    setdialogprops({
      open: false,
    });
  };

  const {
    initialState: { message },
    setInitialState,
  } = useModel("@@initialState");
  const formRef = useRef();

  const { runAsync, loading } = useRequest(doFetch, {
    manual: true,
    onSuccess: (res, parames) => {
      let paramsall = parames[0] ?? {};
      let params = paramsall?.params;
      let url = paramsall?.url;
      if (res?.code == "0000") {
        handleClose();
        setInitialState((s) => ({
          ...s,
          message: {
            ...s.message,
            open: true,
            content: "操作成功！",
            type: "success",
          },
        }));
        if (url.indexOf("delete") !== -1) {
          return;
        }
        if (dialogprops?.title?.indexOf("院系") !== -1) {
          if (params?.parentId) {
            onExpandedRowsChange((s) => [...new Set([...s, params?.parentId])]);
          }
        } else {
          actionRef?.current?.reload();
        }
      }
    },
  });

  const add = (text, row, _, action) => {
    return (
      <PremButton
        btn={{
          size: "small",
          style: { color: "#000" },
          onClick: (e) => {
            e.stopPropagation();
            setdialogprops({
              open: true,
              defaultFormValue: {},
              title: "添加院系",
              parentId: row.id,
            });
          },
        }}
      >
        添加院系
      </PremButton>
    );
  };

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
          title: "是否删除该学校?",
          okText: "确认",
          cancelText: "取消",
          onConfirm: async () => {
            await runAsync({
              url: "/organization/delete",
              params: { id: row.id },
            });
            actionRef?.current?.reload();
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

  const edits = (text, row, _, action) => {
    return (
      <PremButton
        btn={{
          size: "small",
          variant: "text",
          onClick: () => {
            setdialogprops({
              open: true,
              defaultFormValue: { ...row },
              title: "编辑院系",
            });
          },
        }}
      >
        编辑
      </PremButton>
    );
  };

  const removes = (text, row, _, action) => {
    return (
      <PremButton
        pop={{
          title: "是否删除该院系?",
          okText: "确认",
          cancelText: "取消",
          onConfirm: async () => {
            await runAsync({
              url: "/organization/delete",
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

  return (
    <Container maxWidth={false}>
      <DraggableDialog
        handleClose={handleClose}
        loading={loading}
        dialogprops={dialogprops}
      >
        <InitForm
          fields={
            dialogprops?.title?.indexOf?.("院系") !== -1 ? columnes : columns
          }
          defaultFormValue={dialogprops?.defaultFormValue}
          onFinish={(val, extra) => {
            let postdata = {};

            switch (dialogprops?.title) {
              case "编辑":
                postdata = { ...val, id: dialogprops?.defaultFormValue?.id };
                break;
              case "创建学校":
                postdata = val;
                break;
              case "添加院系":
                postdata = { ...val, parentId: dialogprops?.parentId };
                break;
              case "编辑院系":
                postdata = {
                  ...val,
                  parentId: dialogprops?.defaultFormValue?.parentId,
                  id: dialogprops?.defaultFormValue?.id,
                };
                break;
              default:
                break;
            }
            runAsync({
              url: "/organization/saveOrUpdate",
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
        <Typography variant="h5">组织管理</Typography>
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
                  title: "创建学校",
                });
              },
            }}
          >
            创建学校
          </PremButton>
        </Stack>
      </Box>

      <Box boxShadow={"0 0 18px #f0f0f0"} borderRadius={2}>
        <AutoTable
          actionRef={actionRef}
          columns={[
            ...columns,
            {
              title: "操作",
              valueType: "option",
              width: 200,
              render: (text, row, _, action) => [
                add(text, row, _, action),
                edit(text, row, _, action),
                remove(text, row, _, action),
              ],
            },
          ]}
          path="/organization/page"
          expandable={{
            columnWidth: "20px",
            expandedRowKeys,
            onExpandedRowsChange,
            expandedRowRender: (record) => (
              <div className="white">
                <AutoTable
                  pagination={false}
                  path="/organization/childrenList"
                  columns={[
                    ...columnes,
                    {
                      title: "操作",
                      valueType: "option",
                      width: 180,
                      render: (text, row, _, action) => [
                        edits(text, row, _, action),
                        removes(text, row, _, action),
                      ],
                    },
                  ]}
                  extraparams={{ parentId: record?.id }}

                ></AutoTable>
              </div>
            ),
          }}
        ></AutoTable>
      </Box>
    </Container>
  );
}

export default Organization;

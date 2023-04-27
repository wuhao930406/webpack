import DraggableDialog from "@/components/DraggableDialog";
import ImportExcel from "@/components/ImportExcel";
import InitForm from "@/components/InitForm";
import PremButton from "@/components/PremButton";
import ShopProductCard from "@/components/ProductCard";
import { doFetch } from "@/utils/doFetch";
import PRODUCTS from "@/_mock/products";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { useRequest } from "ahooks";
import { message } from "antd";
import { useMemo, useRef, useState } from "react";
import "./index.less";

function Lessons() {
  const actionRef = useRef();
  const [dialogprops, setdialogprops] = useState({
    open: false,
  });

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
        actionRef?.current?.reload();
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
          title: "是否删除该课程?",
          okText: "确认",
          cancelText: "取消",
          onConfirm: async () => {
            await runAsync({
              url: "/sysCourse/delete",
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
        title: "课程封面",
        dataIndex: "pic",
        key: "pic",
        valueType: "uploadImage",
        fieldProps: {
          limit: 1,
        },
      },
      {
        title: "课程名称",
        dataIndex: "courseName",
        key: "courseName",
        formItemProps: {
          rules: [{ required: true, message: "此项为必填项" }],
        },
        colProps: {
          span: 24,
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
        maxWidth={dialogprops?.maxWidth ?? "xs"}
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
              url: "/sysCourse/saveOrUpdate",
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
        <Typography variant="h5">课程管理</Typography>
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
                  title: "新增课程",
                });
              },
            }}
          >
            新增课程
          </PremButton>
        </Stack>
      </Box>

      <Box mt={2.5}>
        <Grid container spacing={3}>
          {PRODUCTS.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={3}>
              <ShopProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Lessons;

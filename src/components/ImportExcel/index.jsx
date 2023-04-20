import { Button, Stack } from "@mui/material";
import DraggableDialog from "../DraggableDialog";
import InitForm from "../InitForm";

function ImportExcel() {
  const config = {
    import: {
      title: "导入",
      component: (
        <InitForm
          style={{ marginTop: 12 }}
          fields={[
            {
              title: "",
              dataIndex: "file",
              key: "file",
              valueType: "uploadDragger",
              colProps: {
                span: 24,
              },
            },
          ]}
        ></InitForm>
      ),
      btn: {
        variant: "outlined",
      },
    },
  };
  return (
    <>
      <Stack direction={"row"} gap={1}>
        <DraggableDialog config={config}></DraggableDialog>
        <Button variant="text">下载模板文件</Button>
      </Stack>
    </>
  );
}

export default ImportExcel;

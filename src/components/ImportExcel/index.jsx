import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import DraggableDialog from "../DraggableDialog";
import InitForm from "../InitForm"

function ImportExcel() {
  const [dialogprops, setdialogprops] = useState();

  return (
    <>
      <Stack direction={"row"} gap={1}>
        <Button
          variant="outlined"
          onClick={() => {
            setdialogprops({
              open: true,
              title: "导入",
            });
          }}
        >
          导入
        </Button>
        <DraggableDialog
          dialogprops={dialogprops}
          handleClose={()=>{
            setdialogprops(s=>({
              ...s,
              open:false
            }))
          }}
          formdom={
            <InitForm
              style={{ marginTop: 12, marginBottom: -18 }}
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
          }
        >
          <Stack direction={"column"}>
            <Stack
              direction={"row"}
              gap={1}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography variant={"b"} color={"#999999"}>
                *请先下载模板文件
              </Typography>
              <Button variant="text">模板文件</Button>
            </Stack>
          </Stack>
        </DraggableDialog>
      </Stack>
    </>
  );
}

export default ImportExcel;

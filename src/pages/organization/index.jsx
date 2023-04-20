import AutoTable from "@/components/AutoTable";
import DraggableDialog from "@/components/DraggableDialog";
import ImportExcel from "@/components/ImportExcel";
import InitForm from "@/components/InitForm";
import { Box, Container, Stack, Typography } from "@mui/material";
const columns = [
  {
    title: "学校名称",
    dataIndex: "organizationName",
    key: "organizationName",
    colProps: {
      span: 24,
    },
  },
  {
    title: "省份",
    dataIndex: "provinceName",
    key: "provinceId",
    valueType: "select",
    options: { path: "/province/selection", params: {} },
  },
  {
    title: "城市",
    dataIndex: "cityName",
    key: "cityId",
    valueType: "select",
    options: { path: "/city/selection", linkParams: { provinceId: "" } },
  },
];

function Organization() {
  const dialogconfig = {
    add: {
      title: "新增组织",
      component: <InitForm fields={columns}></InitForm>,
      btn: {},
    },
  };

  return (
    <Container maxWidth="xxl">
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
          <DraggableDialog config={dialogconfig}></DraggableDialog>
        </Stack>
      </Box>

      <Box boxShadow={"0 0 18px #f0f0f0"} borderRadius={2}>
        <AutoTable columns={columns} path="/organization/page"></AutoTable>
      </Box>
    </Container>
  );
}

export default Organization;

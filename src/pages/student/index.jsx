import AutoTable from "@/components/AutoTable";
import DraggableDialog from "@/components/DraggableDialog";
import ImportExcel from "@/components/ImportExcel";
import InitForm from "@/components/InitForm";
import PremButton from "@/components/PremButton";
import SplitDesc from "@/components/SplitDesc";
import { doFetch } from "@/utils/doFetch";
import { ProDescriptions } from "@ant-design/pro-components";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useRequest } from "ahooks";
import { Image, message, Switch, Tabs } from "antd";
import { useMemo, useRef, useState } from "react";
import "./index.less";

function Student() {
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

  const add = (text, row, _, action) => {
    return (
      <PremButton
        pop={{
          title: "是否删重置密码?",
          okText: "确认",
          cancelText: "取消",
          onConfirm: async () => {
            e.stopPropagation();
            runAsync({
              url: "/user/resetUserPassword",
              params: { id: row?.id },
            });
          },
        }}
        btn={{
          size: "small",
          style: { color: "#000" },
        }}
      >
        重置密码
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
          title: "是否删除该学生?",
          okText: "确认",
          cancelText: "取消",
          onConfirm: async () => {
            await runAsync({
              url: "/user/delete",
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

  const audit = (text, row, _, action) => {
    return (
      <PremButton
        btn={{
          disabled: row.status !== 1,
          size: "small",
          variant: "text",
          onClick: () => {
            setdialogprops({
              open: true,
              defaultFormValue: { ...row },
              title: "审批",
            });
          },
        }}
      >
        审批
      </PremButton>
    );
  };

  const columns = useMemo(
    () => [
      {
        title: "头像",
        dataIndex: "pic",
        key: "pic",
        valueType: "uploadImage",
        colProps: {
          span: 24,
        },
        fieldProps: {
          limit: 1,
        },
        width: 80,
        search: false,
        render: (text, row) => {
          return (
            <Image
              src={row?.picUrl || DEFAULT_HEAD_IMG}
              fallback={DEFAULT_HEAD_IMG}
              style={{
                width: 36,
                height: 36,
                objectFit: "cover",
                borderRadius: 200,
                overflow: "hidden",
                flexShrink: 0,
              }}
            />
          );
        },
      },
      {
        title: "账号",
        dataIndex: "userAccount",
        key: "userAccount",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
      },
      {
        title: "手机号",
        dataIndex: "telephone",
        key: "telephone",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
      },
      { title: "邮箱", dataIndex: "email", key: "email" },
      {
        title: "学校名称",
        dataIndex: "schoolName",
        key: "schoolId",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
        valueType: "select",
        options: { path: "/organization/school/selection", params: {} },
      },
      {
        title: "院系名称",
        dataIndex: "departmentName",
        key: "departmentId",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
        valueType: "select",
        options: {
          path: "/organization/department/selection",
          linkParams: { schoolId: "parentId" },
        },
      },
      {
        title: "班级名称",
        dataIndex: "className",
        key: "classId",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
        valueType: "select",
        options: {
          path: "/class/selection",
          linkParams: {
            departmentId: "",
          },
        },
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTimeRange",
        valueType: "dateRange",
        hideInForm: true,
      },
      {
        title: "启用状态",
        dataIndex: "statusName",
        key: "status",
        valueType: "select",
        options: [
          { label: "启用", value: "1" },
          { label: "禁用", value: "2" },
        ],
        hideInForm: true,
        render: (text, row) => {
          return (
            <Switch
              checkedChildren={["启用"]}
              unCheckedChildren={["禁用"]}
              defaultChecked={row.status === 1}
              onChange={(e) => {
                doFetch({
                  url: "/user/changeStatus",
                  params: { id: row.id, status: e ? 1 : 2 },
                });
              }}
            />
          );
        },
      },
    ],
    []
  );

  const detailcolumns = [
    {
      title: "申请信息",
      dataIndex: "sort",
      key: "sort",
      valueType: "split",
    },
    [
      {
        title: "账号",
        dataIndex: "userAccount",
        key: "userAccount",
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "手机号",
        dataIndex: "telephone",
        key: "telephone",
      },
      { title: "邮箱", dataIndex: "email", key: "email" },
      {
        title: "学校名称",
        dataIndex: "schoolName",
        key: "schoolId",
      },
      {
        title: "院系名称",
        dataIndex: "departmentName",
        key: "departmentId",
      },
      {
        title: "申请时间",
        dataIndex: "applyTime",
        key: "applyTimeRange",
      },
      {
        title: "申请状态",
        dataIndex: "statusName",
        key: "status",
        valueType: "select",
        options: [
          {
            label: "待审核",
            value: "1",
          },
          {
            label: "已审核",
            value: "2",
          },
        ],
      },
    ],
    {
      title: "审核信息",
      dataIndex: "sort",
      key: "sort",
      valueType: "split",
    },
    [
      {
        title: "审批结果",
        dataIndex: "examineResultName",
        key: "examineResultName",
      },
      {
        title: "审核时间",
        dataIndex: "examineTime",
        key: "examineTime",
      },
      {
        title: "审核人",
        dataIndex: "examineUserName",
        key: "examineUserName",
      },
      {
        title: "审核意见",
        dataIndex: "examineAdvice",
        key: "examineAdvice",
        span: 3,
      },
    ],
  ];

  const columes = useMemo(() => {
    return [
      // {
      //   title: "头像",
      //   dataIndex: "pic",
      //   key: "pic",
      //   valueType: "uploadImage",
      //   colProps: {
      //     span: 24,
      //   },
      //   fieldProps: {
      //     limit: 1,
      //   },
      //   width: 80,
      //   search: false,
      //   hideInDescriptions: true,
      //   render: (text, row) => {
      //     return (
      //       <Image
      //         src={row?.picUrl || DEFAULT_HEAD_IMG}
      //         style={{
      //           width: 36,
      //           height: 36,
      //           objectFit: "cover",
      //           borderRadius: 200,
      //           overflow: "hidden",
      //           flexShrink: 0,
      //         }}
      //       />
      //     );
      //   },
      // },
      {
        title: "账号",
        dataIndex: "userAccount",
        key: "userAccount",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
        render: (text, row) => {
          return (
            <a
              onClick={() => {
                setdialogprops({
                  open: true,
                  defaultFormValue: { ...row },
                  title: "详情",
                  maxWidth: "md",
                  footer: false,
                });
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
      },
      {
        title: "手机号",
        dataIndex: "telephone",
        key: "telephone",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
      },
      { title: "邮箱", dataIndex: "email", key: "email" },
      {
        title: "学校名称",
        dataIndex: "schoolName",
        key: "schoolId",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
        valueType: "select",
        options: { path: "/organization/school/selection", params: {} },
      },
      {
        title: "院系名称",
        dataIndex: "departmentName",
        key: "departmentId",
        formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
        valueType: "select",
        options: {
          path: "/organization/department/selection",
          linkParams: { schoolId: "parentId" },
        },
      },
      // {
      //   title: "班级名称",
      //   dataIndex: "className",
      //   key: "classId",
      //   formItemProps: { rules: [{ required: true, message: "此项为必填项" }] },
      //   valueType: "select",
      //   options: {
      //     path: "/class/selection",
      //     linkParams: {
      //       departmentId: "",
      //     },
      //   },
      // },
      {
        title: "申请时间",
        dataIndex: "applyTime",
        key: "applyTimeRange",
        valueType: "dateRange",
        hideInDescriptions: true,
      },
      {
        title: "申请状态",
        dataIndex: "statusName",
        key: "status",
        valueType: "select",
        options: [
          {
            label: "待审核",
            value: "1",
          },
          {
            label: "已审核",
            value: "2",
          },
        ],
        hideInDescriptions: true,
      },
      {
        title: "审核结果",
        dataIndex: "examineResultName",
        key: "examineResult",
        valueType: "select",
        options: [
          {
            label: "通过",
            value: "1",
          },
          {
            label: "不通过",
            value: "2",
          },
        ],
        hideInDescriptions: true,
      },
    ];
  }, []);

  const items = [
    {
      key: "1",
      label: `正式用户`,
      children: (
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
                  add(text, row, _, action),
                  edit(text, row, _, action),
                  remove(text, row, _, action),
                ],
              },
            ]}
            extraparams={{ type: "3" }}
            path="/user/page"
            rerendered={false}
          ></AutoTable>
        </Box>
      ),
    },
    {
      key: "2",
      label: `学生认证申请`,
      children: (
        <Box boxShadow={"0 0 18px #f0f0f0"} borderRadius={2}>
          <AutoTable
            actionRef={actionRefs}
            scroll={{ x: 1366 }}
            columns={[
              ...columes,
              {
                title: "操作",
                valueType: "option",
                width: 88,
                render: (text, row, _, action) => [audit(text, row, _, action)],
              },
            ]}
            path="/studentApply/page"
            rerendered={false}
          ></AutoTable>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth={false}>
      <DraggableDialog
        handleClose={handleClose}
        loading={loading}
        dialogprops={dialogprops}
        maxWidth={dialogprops?.maxWidth ?? "sm"}
        formdom={
          dialogprops?.title === "审批" && (
            <InitForm
              fields={[
                {
                  title: "审核信息",
                  dataIndex: "sort",
                  key: "sort",
                  valueType: "split",
                },
                {
                  title: "审批结果",
                  dataIndex: "examineResult",
                  key: "examineResult",
                  valueType: "radio",
                  options: [
                    { label: "认证通过", value: "1" },
                    { label: "驳回", value: "2" },
                  ],
                  colProps: { span: 24 },
                },
                {
                  title: "审核意见",
                  dataIndex: "examineAdvice",
                  key: "examineAdvice",
                  colProps: { span: 24 },
                  valueType: "textarea",
                },
              ]}
              defaultFormValue={{ examineResult: "1" }}
              onFinish={(val, extra) => {
                let postdata = {
                  ...val,
                  id: dialogprops?.defaultFormValue?.id,
                };
                runAsync({
                  url: "/studentApply/review",
                  params: postdata,
                });
              }}
            ></InitForm>
          )
        }
      >
        {dialogprops?.title === "审批" ? (
          <ProDescriptions
            columns={columes}
            column={2}
            style={{ marginBottom: 12 }}
            dataSource={dialogprops?.defaultFormValue}
          ></ProDescriptions>
        ) : dialogprops?.title === "详情" ? (
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
          >
            {/* <Image
              src={dialogprops?.defaultFormValue?.picUrl || DEFAULT_HEAD_IMG}
              fallback={DEFAULT_HEAD_IMG}
              style={{
                width: 88,
                height: 88,
                objectFit: "cover",
                borderRadius: 200,
                overflow: "hidden",
                flexShrink: 0,
              }}
            />
            <Box height={12}></Box> */}
            <SplitDesc
              columns={detailcolumns}
              dataSource={dialogprops?.defaultFormValue}
            ></SplitDesc>
          </Stack>
        ) : (
          <InitForm
            fields={columns}
            defaultFormValue={dialogprops?.defaultFormValue}
            onFinish={(val, extra) => {
              let postdata = { ...val, type: "3" };
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
                url: "/user/saveOrUpdate",
                params: postdata,
              });
            }}
          ></InitForm>
        )}
      </DraggableDialog>

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ mb: 1 }}
        mt={0}
      >
        <Typography variant="h5">学生管理</Typography>
        {active === "1" ? (
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
                    title: "新增学生",
                  });
                },
              }}
            >
              新增学生
            </PremButton>
          </Stack>
        ) : (
          <Box height={36} />
        )}
      </Box>

      <Tabs
        activeKey={active}
        onChange={setactive}
        items={items}
        tabPosition="top"
        animated={true}
      />
    </Container>
  );
}

export default Student;

import { doFetch } from "@/utils/doFetch";
import { ProForm, ProFormDependency } from "@ant-design/pro-components";
import { Button } from "@mui/material";
import { createElement, memo, useRef } from "react";
import FormItems from "./FormItems";
import "./index.less";

function upperCase(str) {
  const newStr = str.slice(0, 1).toUpperCase() + str.slice(1);
  return newStr;
}

let FormRender = memo(({ fields = [], colProps, proformRef }) => {
  return (
    <>
      {fields
        .filter((it) => it.hideInForm !== true)
        .map((item, index) => {
          let key = item?.valueType ? upperCase(item?.valueType) : "Input";
          let { hideInForm } = item;
          item.formItemProps = item.formItemProps ?? { rules: [] };
          if (item.valueType == "split") {
            return (
              <div
                className="title"
                style={{ borderWidth: index == 0 ? 0 : 1 }}
              >
                {item.title}
              </div>
            );
          }
          if (hideInForm && Object.keys(hideInForm)) {
            return (
              <ProFormDependency name={Object.keys(hideInForm)}>
                {(params) => {
                  let ifs = true;
                  let res = Object.keys(hideInForm).map((its) => {
                    if (Array.isArray(hideInForm[its])) {
                      return !hideInForm[its].includes(params[its]);
                    } else {
                      let vals = hideInForm[its].reverse; //取反 即不存在当前数组中的
                      return vals.indexOf(params[its]) != -1;
                    }
                  });
                  ifs = res.includes(false);
                  if (ifs) {
                    return;
                  } else {
                    return (
                      <>
                        {createElement(FormItems[key], {
                          item: item,
                          colProps: colProps,
                          key: item.dataIndex,
                          formRef: proformRef,
                        })}
                      </>
                    );
                  }
                }}
              </ProFormDependency>
            );
          } else {
            return (
              <>
                {createElement(FormItems[key], {
                  item: {
                    ...item,
                    fieldProps: {
                      ...item.fieldProps,
                      size: "large",
                    },
                  },
                  colProps: colProps,
                  key: item.dataIndex,
                  formRef: proformRef,
                })}
              </>
            );
          }
        })}
    </>
  );
});

function InitForm({
  formRef,
  onFinish = (vals,extra) => {
    console.log(vals,extra);
  },
  formKey,
  params = {},
  style = {},
  detailpath = "",
  defaultFormValue = {},
  submitter,
  fields,
  colProps = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 },
  onValuesChange = (changedValues, allValues) => {
    console.log(changedValues, allValues);
  },
}) {
  let proformRef = useRef();
  proformRef = formRef ?? proformRef;

  return (
    <ProForm
      style={{ ...style, overflow: "hidden" }}
      formRef={proformRef}
      onFinish={onFinish}
      formKey={formKey ?? parseInt(Math.random() * 1000000)}
      params={params}
      submitter={
        submitter || submitter === false
          ? submitter
          : {
              render: (props, doms) => {
                return [
                  <Button
                    type="reset"
                    key="rest"
                    onClick={() => props.form?.resetFields()}
                  >
                    重置
                  </Button>,
                  <Button
                    type="submit"
                    key="submit"
                    variant="contained"
                    onClick={() => props.form?.submit?.()}
                  >
                    提交
                  </Button>,
                ];
              },
            }
      }
      grid={true}
      rowProps={{
        gutter: 12,
      }}
      request={async (params) => {
        if (detailpath) {
          let res = await doFetch({ url: detailpath, params });
          return {
            ...defaultFormValue,
            ...(res?.data?.data ?? {}),
          };
        } else {
          return {
            ...defaultFormValue,
          };
        }
      }}
      autoFocusFirstInput
      onValuesChange={(changedValues, allValues) => {
        onValuesChange?.(changedValues, allValues);
      }}
    >
      <FormRender
        fields={fields.filter((it) => it.valueType != "option")}
        colProps={colProps}
        proformRef={proformRef}
      />
    </ProForm>
  );
}

export default InitForm;

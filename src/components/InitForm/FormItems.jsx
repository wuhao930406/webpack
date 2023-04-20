import React, { useState, useRef, memo, createElement, useEffect } from "react";
import {
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormMoney,
  ProFormTextArea,
  ProFormDigit,
  ProFormDigitRange,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDateRangePicker,
  ProFormDateTimeRangePicker,
  ProFormTimePicker,
  ProFormTreeSelect,
  ProFormCheckbox,
  ProFormRadio,
  ProFormCascader,
  ProFormSwitch,
  ProFormRate,
  ProFormSlider,
  ProFormUploadDragger,
  ProFormUploadButton,
  ProFormList,
} from "@ant-design/pro-components";
import ImgCrop from "antd-img-crop";
import { doFetch } from "@/utils/doFetch";
import dayjs from "dayjs";
import * as Antd from "antd";
import {
  PlusOutlined,
  DownOutlined,
  CloseOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import EditTable from "./EditTable";
import EditorItem from "./EditorItem";
const prefix = "/api";

const { Image, Form, Upload, Col, Dropdown, Menu, Tabs } = Antd;

function upperCase(str) {
  const newStr = str.slice(0, 1).toUpperCase() + str.slice(1);
  return newStr;
}
// tree遍历
function treeForeach(tree, func) {
  tree.forEach((data) => {
    func(data);
    data.children && treeForeach(data.children, func); // 遍历子树
  });
}

// colProps 默认删格
function Input({ item, colProps }) {
  let keys = item.key ?? item.dataIndex ?? "";
  keys = keys ?? "";
  const defaultrule =
    keys.indexOf("phone") != -1
      ? {
          pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/,
          message: item.title + "格式不正确",
        }
      : keys.indexOf("mail") != -1
      ? {
          pattern:
            /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/,
          message: "邮箱格式不正确",
        }
      : {};

  return (
    <>
      <ProFormText
        fieldProps={item?.fieldProps}
        formItemProps={{
          ...item.formItemProps,
          rules: [defaultrule, ...(item?.formItemProps?.rules ?? [])],
        }} //手机号邮箱自带验证
        name={keys}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请输入${item.title}`}
      />
    </>
  );
}
//pwd
function Password({ item, colProps }) {
  return (
    <>
      <ProFormText.Password
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请输入${item.title}`}
      />
    </>
  );
}
//money
function Money({ item, colProps }) {
  return (
    <>
      <ProFormMoney
        locale="zh-CN"
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请输入${item.title}`}
        min={item.min}
        max={item.max}
      />
    </>
  );
}

//textarea
function Textarea({ item }) {
  return (
    <>
      <ProFormTextArea
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? { span: 24 }}
        label={item.title}
        placeholder={`请输入${item.title}`}
      />
    </>
  );
}

//digit
function Digit({ item, colProps }) {
  return (
    <>
      <ProFormDigit
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请输入${item.title}`}
        min={item.min}
        max={item.max}
        fieldProps={{
          precision: item.precision ?? 0,
          ...(item?.fieldProps ?? {}),
        }}
      />
    </>
  );
}

//digitrange
function DigitRange({ item, colProps }) {
  return (
    <>
      <ProFormDigitRange
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={["请输入最小值", "请输入最大值"]}
        min={item.min}
        max={item.max}
        fieldProps={{
          precision: item.precision ?? 0,
          ...(item?.fieldProps ?? {}),
        }}
      />
    </>
  );
}

//Date
function Date({ item, colProps }) {
  return (
    <>
      <ProFormDatePicker
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        width="100%"
      />
    </>
  );
}

function DateWeek({ item, colProps }) {
  const weekFormat = "YYYY-MM-DD";
  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf("week").format(weekFormat)} ~ ${dayjs(value)
      .endOf("week")
      .format(weekFormat)}`;
  return (
    <>
      <ProFormDatePicker
        fieldProps={{
          ...item?.fieldProps,
          picker: "week",
          format: customWeekStartEndFormat,
        }}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        width="100%"
      />
    </>
  );
}
//DateMonth
function DateMonth({ item, colProps }) {
  return (
    <>
      <ProFormDatePicker
        fieldProps={{ ...item?.fieldProps, picker: "month", format: "YYYY-MM" }}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        width="100%"
      />
    </>
  );
}
//DateQuarter
function DateQuarter({ item, colProps }) {
  const quarterFormat = "YYYY-MM-DD";
  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf("quarter").format(quarterFormat)} ~ ${dayjs(value)
      .endOf("quarter")
      .format(quarterFormat)}`;
  return (
    <>
      <ProFormDatePicker
        fieldProps={{
          ...item?.fieldProps,
          picker: "quarter",
          format: customWeekStartEndFormat,
        }}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        width="100%"
      />
    </>
  );
}
//DateYear
function DateYear({ item, colProps }) {
  return (
    <>
      <ProFormDatePicker
        fieldProps={{ ...item?.fieldProps, picker: "year", format: "YYYY" }}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        width="100%"
      />
    </>
  );
}

//dateTime
function DateTime({ item, colProps }) {
  return (
    <>
      <ProFormDateTimePicker
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        width="100%"
      />
    </>
  );
}
//DateRange
function DateRange({ item, colProps }) {
  return (
    <>
      <ProFormDateRangePicker
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={["请选择开始日期", "请选择结束日期"]}
        width="100%"
      />
    </>
  );
}
//dateTimeRange
function DateTimeRange({ item, colProps }) {
  return (
    <>
      <ProFormDateTimeRangePicker
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={["请选择开始时间", "请选择结束时间"]}
        width="100%"
      />
    </>
  );
}
//Time
function Time({ item, colProps }) {
  return (
    <>
      <ProFormTimePicker
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        width="100%"
      />
    </>
  );
}
//TimeRange
function TimeRange({ item, colProps }) {
  return (
    <>
      <ProFormTimePicker.RangePicker
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={["请选择开始时间", "请选择结束时间"]}
        width="100%"
      />
    </>
  );
}

function LinkSelect({ item, colProps, formRef, name, curindex }) {
  let curoption = item.options ?? null,
    curlinkparams = curoption?.linkParams ?? {}; //获取linkParams下声明的key
  return (
    <>
      <ProFormDependency name={Object.keys(curlinkparams)}>
        {(params) => {
          const curkey = item.key ?? item.dataIndex;
          return (
            <ProFormSelect
              convertValue={(value) => {
                return item?.fieldProps?.mode == "multiple"
                  ? !value
                    ? []
                    : null
                  : null;
              }}
              fieldProps={item?.fieldProps}
              formItemProps={item.formItemProps}
              name={curkey}
              colProps={item.colProps ?? colProps}
              label={item.title}
              placeholder={`请选择${item.title}`}
              params={params}
              mode={item?.mode}
              request={async (parse) => {
                let result = {};
                for (let key in curlinkparams) {
                  let reversekey = !curlinkparams[key]
                    ? key
                    : curlinkparams[key];
                  result[reversekey] = parse[key];
                }
                let res = await doFetch({
                  url: curoption?.path,
                  params: result,
                });
                if (name) {
                  let curvals = formRef?.current?.getFieldValue(name);
                  curvals = curvals.map((it, i) => {
                    if (i == curindex) {
                      it[curkey] = null;
                    }
                    return it;
                  });
                  formRef?.current?.setFieldsValue({ [name]: curvals });
                } else {
                  let curval = formRef?.current?.getFieldValue(curkey),
                    ifclean;
                  if (Array.isArray(curval)) {
                    ifclean = res?.data?.dataList
                      ?.map((it) => it.value)
                      .filter?.((it) => {
                        return curval?.includes(it);
                      });
                  } else {
                    ifclean = res?.data?.dataList.filter(
                      (it) => it.value == curval
                    )?.[0]?.value;
                  }
                  formRef?.current?.setFieldsValue({ [curkey]: ifclean });
                }
                return res?.data?.dataList ?? [];
              }}
              showSearch
            />
          );
        }}
      </ProFormDependency>
    </>
  );
}

function NolinkSelect({ item, colProps }) {
  let options = {
      options: [],
    },
    curoption = item.options ?? null;

  if (Array.isArray(curoption)) {
    options = {
      options: [...curoption],
    };
  } else if (curoption) {
    options = {
      request: async () => {
        let list = await doFetch({
          url: curoption?.path,
          params: curoption?.params,
        });
        return list.data.dataList;
      },
    };
  }

  return (
    <>
      <ProFormSelect
        fieldProps={{...item.fieldProps,dropdownMatchSelectWidth:200}}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        showSearch
        mode={item?.mode}
        {...options}
      />
    </>
  );
}

//Select 高阶组建
function Select(props) {
  let ifs = props?.item?.options?.linkParams;
  if (ifs) {
    return <LinkSelect {...props} />;
  } else {
    return <NolinkSelect {...props} />;
  }
}

function LinkTreeSelect({ item, colProps, formRef, name, curindex }) {
  let prevparse = useRef();
  let curoption = item.options ?? null,
    curlinkparams = curoption?.linkParams ?? {}; //获取linkParams下声明的key
  return (
    <>
      <ProFormDependency name={Object.keys(curlinkparams)}>
        {(params) => {
          const curkey = item.key ?? item.dataIndex;
          return (
            <ProFormTreeSelect
              fieldProps={{
                ...item?.fieldProps,
                fieldNames: {
                  label: "title",
                  value: "key",
                  children: "children",
                },
                showSearch: false,
                multiple: item?.mode === "multiple",
              }}
              formItemProps={item.formItemProps}
              name={curkey}
              colProps={item.colProps ?? colProps}
              label={item.title}
              placeholder={`请选择${item.title}`}
              params={params}
              request={async (parse) => {
                delete parse.keyWords;
                let result = {};
                for (let key in curlinkparams) {
                  let reversekey = !curlinkparams[key]
                    ? key
                    : curlinkparams[key];
                  result[reversekey] = parse[key];
                }
                let res = await doFetch({
                  url: curoption?.path,
                  params: result,
                });

                if (prevparse.current !== JSON.stringify(parse)) {
                  if (name) {
                    let curvals = formRef?.current?.getFieldValue(name);
                    curvals = curvals.map((it, i) => {
                      if (i == curindex) {
                        it[curkey] = null;
                      }
                      return it;
                    });
                    formRef?.current?.setFieldsValue({ [name]: curvals });
                  } else {
                    let curval = formRef?.current?.getFieldValue(curkey),
                      ifclean;
                    //树结构所有value提取到数组
                    let allvalue = [];
                    treeForeach(res?.data?.dataList, (node) => {
                      allvalue.push(node.key);
                    });

                    //过滤存在的value
                    if (Array.isArray(curval)) {
                      ifclean = allvalue?.filter?.((it) => {
                        return curval?.includes(it);
                      });
                    } else {
                      ifclean = allvalue?.filter?.((it) => it == curval)?.[0];
                    }

                    formRef?.current?.setFieldsValue({ [curkey]: ifclean });
                  }
                }
                prevparse.current = JSON.stringify(parse);
                return res?.data?.dataList ?? [];
              }}
            />
          );
        }}
      </ProFormDependency>
    </>
  );
}

function NolinkTreeSelect({ item, colProps }) {
  let options = {
      options: [],
    },
    curoption = item.options ?? null;

  if (Array.isArray(curoption)) {
    options = {
      options: [...curoption],
    };
  } else if (curoption) {
    options = {
      request: async () => {
        let list = await doFetch({
          url: curoption?.path,
          params: curoption?.params,
        });
        return list.data.dataList;
      },
    };
  }

  return (
    <>
      <ProFormTreeSelect
        fieldProps={{
          ...item?.fieldProps,
          fieldNames: { label: "title", value: "key", children: "children" },
          showSearch: true,
          multiple: item?.mode === "multiple",
        }}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        multiple
        {...options}
      />
    </>
  );
}

//TreeSelect 高阶组建
function TreeSelect(props) {
  let ifs = props?.item?.options?.linkParams;
  if (ifs) {
    return <LinkTreeSelect {...props} />;
  } else {
    return <NolinkTreeSelect {...props} />;
  }
}

function CheckboxItem({ item, colProps }) {
  return (
    <>
      <ProFormCheckbox
        fieldProps={item.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
      />
    </>
  );
}

function LinkCheckbox({ item, colProps, formRef, name, curindex }) {
  let curoption = item.options ?? null,
    curlinkparams = curoption?.linkParams ?? {}; //获取linkParams下声明的key
  return (
    <>
      <ProFormDependency name={Object.keys(curlinkparams)}>
        {(params) => {
          const curkey = item.key ?? item.dataIndex;
          return (
            <ProFormCheckbox.Group
              fieldProps={item?.fieldProps}
              formItemProps={item.formItemProps}
              name={curkey}
              colProps={item.colProps ?? colProps}
              label={item.title}
              placeholder={`请选择${item.title}`}
              params={params}
              request={async (parse) => {
                let result = {};
                for (let key in curlinkparams) {
                  let reversekey = !curlinkparams[key]
                    ? key
                    : curlinkparams[key];
                  result[reversekey] = parse[key];
                }
                let res = await doFetch({
                  url: curoption?.path,
                  params: result,
                });
                if (name) {
                  let curvals = formRef?.current?.getFieldValue(name);
                  curvals = curvals.map((it, i) => {
                    if (i == curindex) {
                      it[curkey] = null;
                    }
                    return it;
                  });
                  formRef?.current?.setFieldsValue({ [name]: curvals });
                } else {
                  let curval = formRef?.current?.getFieldValue(curkey),
                    ifclean;
                  if (Array.isArray(curval)) {
                    ifclean = res?.data?.dataList
                      ?.map((it) => it.value)
                      .filter?.((it) => {
                        return curval?.includes(it);
                      });
                  } else {
                    ifclean = res?.data?.dataList.filter(
                      (it) => it.value == curval
                    )?.[0]?.value;
                  }
                  formRef?.current?.setFieldsValue({ [curkey]: ifclean });
                }
                return res?.data?.dataList ?? [];
              }}
            />
          );
        }}
      </ProFormDependency>
    </>
  );
}

function NolinkCheckbox({ item, colProps }) {
  let options = {
      options: [],
    },
    curoption = item.options ?? null;

  if (Array.isArray(curoption)) {
    options = {
      options: [...curoption],
    };
  } else if (curoption) {
    options = {
      request: async () => {
        let list = await doFetch({
          url: curoption?.path,
          params: curoption?.params,
        });
        return list.data.dataList;
      },
    };
  }

  return (
    <>
      <ProFormCheckbox.Group
        fieldProps={item.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        {...options}
      />
    </>
  );
}

//Checkbox 高阶组建
function Checkbox(props) {
  let ifs = props?.item?.options?.linkParams;
  if (ifs) {
    return <LinkCheckbox {...props} />;
  } else {
    return <NolinkCheckbox {...props} />;
  }
}

function RadioItem({ item, colProps }) {
  return (
    <>
      <ProFormRadio
        fieldProps={item.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
      />
    </>
  );
}

function LinkRadio({ item, colProps, formRef, name, curindex }) {
  let curoption = item.options ?? null,
    curlinkparams = curoption?.linkParams ?? {}; //获取linkParams下声明的key
  return (
    <>
      <ProFormDependency name={Object.keys(curlinkparams)}>
        {(params) => {
          const curkey = item.key ?? item.dataIndex;
          return (
            <ProFormRadio.Group
              fieldProps={item?.fieldProps}
              formItemProps={item.formItemProps}
              name={curkey}
              colProps={item.colProps ?? colProps}
              label={item.title}
              placeholder={`请选择${item.title}`}
              params={params}
              request={async (parse) => {
                let result = {};
                for (let key in curlinkparams) {
                  let reversekey = !curlinkparams[key]
                    ? key
                    : curlinkparams[key];
                  result[reversekey] = parse[key];
                }
                let res = await doFetch({
                  url: curoption?.path,
                  params: result,
                });
                if (name) {
                  let curvals = formRef?.current?.getFieldValue(name);
                  curvals = curvals.map((it, i) => {
                    if (i == curindex) {
                      it[curkey] = null;
                    }
                    return it;
                  });
                  formRef?.current?.setFieldsValue({ [name]: curvals });
                } else {
                  let curval = formRef?.current?.getFieldValue(curkey),
                    ifclean;
                  if (Array.isArray(curval)) {
                    ifclean = res?.data?.dataList
                      ?.map((it) => it.value)
                      .filter?.((it) => {
                        return curval?.includes(it);
                      });
                  } else {
                    ifclean = res?.data?.dataList.filter(
                      (it) => it.value == curval
                    )?.[0]?.value;
                  }
                  formRef?.current?.setFieldsValue({ [curkey]: ifclean });
                }
                return res?.data?.dataList ?? [];
              }}
            />
          );
        }}
      </ProFormDependency>
    </>
  );
}

function NolinkRadio({ item, colProps }) {
  let options = {
      options: [],
    },
    curoption = item.options ?? null;

  if (Array.isArray(curoption)) {
    options = {
      options: [...curoption],
    };
  } else if (curoption) {
    options = {
      request: async () => {
        let list = await doFetch({
          url: curoption?.path,
          params: curoption?.params,
        });
        return list.data.dataList;
      },
    };
  }

  return (
    <>
      <ProFormRadio.Group
        fieldProps={item.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        {...options}
      />
    </>
  );
}

//Radio 高阶组建
function Radio(props) {
  let ifs = props?.item?.options?.linkParams;
  if (ifs) {
    return <LinkRadio {...props} />;
  } else {
    return <NolinkRadio {...props} />;
  }
}

function LinkCascader({ item, colProps, formRef, name, curindex }) {
  let prevparse = useRef();
  let curoption = item.options ?? null,
    curlinkparams = curoption?.linkParams ?? {}; //获取linkParams下声明的key
  return (
    <>
      <ProFormDependency name={Object.keys(curlinkparams)}>
        {(params) => {
          const curkey = item.key ?? item.dataIndex;
          return (
            <ProFormCascader
              fieldProps={{
                ...item?.fieldProps,
                fieldNames: {
                  label: "title",
                  value: "key",
                  children: "children",
                },
                showSearch: true,
                multiple: item?.mode === "multiple",
              }}
              formItemProps={item.formItemProps}
              name={curkey}
              colProps={item.colProps ?? colProps}
              label={item.title}
              placeholder={`请选择${item.title}`}
              params={params}
              request={async (parse) => {
                delete parse.keyWords;
                let result = {};
                for (let key in curlinkparams) {
                  let reversekey = !curlinkparams[key]
                    ? key
                    : curlinkparams[key];
                  result[reversekey] = parse[key];
                }
                let res = await doFetch({
                  url: curoption?.path,
                  params: result,
                });
                if (prevparse.current !== JSON.stringify(parse)) {
                  if (name) {
                    let curvals = formRef?.current?.getFieldValue(name);
                    curvals = curvals.map((it, i) => {
                      if (i == curindex) {
                        it[curkey] = null;
                      }
                      return it;
                    });
                    formRef?.current?.setFieldsValue({ [name]: curvals });
                  } else {
                    let curval = formRef?.current?.getFieldValue(curkey),
                      ifclean;
                    if (Array.isArray(curval)) {
                      ifclean = res?.data?.dataList
                        ?.map((it) => it.value)
                        .filter?.((it) => {
                          return curval?.includes(it);
                        });
                    } else {
                      ifclean = res?.data?.dataList.filter(
                        (it) => it.value == curval
                      )?.[0]?.value;
                    }
                    formRef?.current?.setFieldsValue({ [curkey]: ifclean });
                  }
                }
                prevparse.current = JSON.stringify(parse);
                return res?.data?.dataList ?? [];
              }}
            />
          );
        }}
      </ProFormDependency>
    </>
  );
}

function NolinkCascader({ item, colProps }) {
  let options = {
      options: [],
    },
    curoption = item.options ?? null;

  if (Array.isArray(curoption)) {
    options = {
      options: [...curoption],
    };
  } else if (curoption) {
    options = {
      request: async () => {
        let list = await doFetch({
          url: curoption?.path,
          params: curoption?.params,
        });
        return list.data.dataList;
      },
    };
  }

  return (
    <>
      <ProFormCascader
        fieldProps={{
          ...item?.fieldProps,
          fieldNames: { label: "title", value: "key", children: "children" },
          showSearch: true,
          multiple: item?.mode === "multiple",
        }}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请选择${item.title}`}
        {...options}
      />
    </>
  );
}

//Cascader 高阶组建
function Cascader(props) {
  let ifs = props?.item?.options?.linkParams;
  if (ifs) {
    return <LinkCascader {...props} />;
  } else {
    return <NolinkCascader {...props} />;
  }
}

//switch
function Switch({ item, colProps }) {
  return (
    <>
      <ProFormSwitch
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        placeholder={`请输入${item.title}`}
      />
    </>
  );
}

//Rate
function Rate({ item, colProps }) {
  return (
    <>
      <ProFormRate
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
      />
    </>
  );
}

//Slider
function Slider({ item, colProps }) {
  return (
    <>
      <ProFormSlider
        {...item?.fieldProps}
        fieldProps={item?.fieldProps}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
      />
    </>
  );
}

//uploadbtn
function UploadBtn({ item, colProps }) {
  return (
    <>
      <ProFormUploadButton
        fieldProps={{
          ...item?.fieldProps,
          action: prefix + "/file/upload",
          onPreview: (file) => {
            let url = "";
            if (file.response) {
              url = file.response.data.dataList[0].url;
            } else if (file.url) {
              url = file.url;
            } else {
              url = file.thumbUrl;
            }
            window.open(url);
          },
        }}
        transform={(value) => {
          const key = item.key ?? item.dataIndex;
          const transvalue = value?.map((it) => {
            if (it.response) {
              return it?.response?.data?.dataList[0];
            } else {
              return it;
            }
          });
          return {
            [key]: transvalue,
          };
        }}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
        title={`上传${item.title}`}
      />
    </>
  );
}

function UploadImg({ value, onChange, fieldProps }) {
  const [image, setImage] = useState({});
  let token = "18e1081d54f57af2fdeac1964cc981e7";

  function beforeUpload(file) {
    const isJpgOrPng =
      file.type === "image/jpg" ||
      file.type === "image/jpeg" ||
      file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传.jpg/.jpeg/.png图片!");
      return;
    }
    return true;
  }

  // maxCount 最大数量
  const defaultconfig = {
    name: "file",
    action: prefix + "/file/upload",
    accept: ".jpg,.png,.jpeg",
    listType: "picture-card",
    beforeUpload: beforeUpload,
    defaultFileList: value,
    headers: { token },
    onChange(info) {
      let {
        file: { status },
        fileList,
      } = info;
      if (status == "error") {
        message.error(`${info.file.name} 上传失败`);
      } else if (status === "done") {
        const transfile = fileList.map((it) => {
          return it?.response ? it?.response.data.dataList[0] : it;
        });
        onChange(transfile);
      }
    },
    onRemove(file) {
      let uid = file?.response?.data?.dataList[0]?.uid ?? file?.uid;
      let newvalue = value.filter((it) => it.uid != uid);
      onChange(newvalue);
    },
    onPreview(file) {
      let url = "";
      if (file.response) {
        url = file.response.data.dataList[0].url;
      } else if (file.url) {
        url = file.url;
      } else {
        url = file.thumbUrl;
      }
      setImage({
        url,
        visible: true,
      });
    },
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  return (
    <>
      <Image
        src={image.url}
        width={0}
        height={0}
        preview={{
          visible: image?.visible,
          onVisibleChange: () => {
            if (image?.visible) {
              setImage((s) => ({
                ...s,
                visible: false,
              }));
            }
          },
        }}
      />
      {fieldProps?.crop ? (
        <ImgCrop
          rotate
          grid
          quality={1}
          shape={fieldProps?.crop?.shape ?? "rect"} //裁切区域形状，'rect' 或 'round'
          aspect={fieldProps?.crop?.aspect ?? 1 / 1} //裁切区域宽高比，width / height
        >
          <Upload {...defaultconfig}>
            {!value
              ? uploadButton
              : value?.length < fieldProps.limit
              ? uploadButton
              : null}
          </Upload>
        </ImgCrop>
      ) : (
        <Upload {...defaultconfig}>
          {!value
            ? uploadButton
            : value?.length < fieldProps.limit
            ? uploadButton
            : null}
        </Upload>
      )}
    </>
  );
}

//upload Image
function UploadImage({ item, colProps }) {
  let col = item.colProps ?? colProps;
  return (
    <Col {...col}>
      <Form.Item
        name={item.key ?? item.dataIndex}
        label={item.title}
        {...item.formItemProps}
      >
        <UploadImg fieldProps={{ ...item?.fieldProps }} />
      </Form.Item>
    </Col>
  );
}

// uploadDragger
function UploadDragger({ item, colProps }) {
  return (
    <>
      <ProFormUploadDragger
        fieldProps={{
          ...item?.fieldProps,
          action: prefix + "/file/upload",
          onPreview: (file) => {
            let url = "";
            if (file.response) {
              url = file.response.data.dataList[0].url;
            } else if (file.url) {
              url = file.url;
            } else {
              url = file.thumbUrl;
            }
            window.open(url);
          },
        }}
        transform={(value) => {
          const key = item.key ?? item.dataIndex;
          const transvalue = value?.map((it) => {
            if (it.response) {
              return it?.response?.data?.dataList[0];
            } else {
              return it;
            }
          });
          return {
            [key]: transvalue,
          };
        }}
        formItemProps={item.formItemProps}
        name={item.key ?? item.dataIndex}
        colProps={item.colProps ?? colProps}
        label={item.title}
      />
    </>
  );
}

// editor
function Editor({ item, colProps, formRef }) {
  let col = item.colProps ?? colProps;
  let curkey = item.key ?? item.dataIndex;
  return (
    <Col {...col}>
      <ProForm.Item
        // convertValue={(value) => {
        //   return BraftEditor.createEditorState(value);
        // }}
        transform={(value) => {
          return {
            [curkey]: value.toHTML(),
          };
        }}
        name={curkey}
        label={item.title}
        {...item.formItemProps}
      >
        <EditorItem
          item={item}
          params={item.params}
          formRef={formRef}
          curkey={curkey}
        />
      </ProForm.Item>
    </Col>
  );
}

function FormList({ item, colProps, formRef }) {
  let col = item.colProps ?? colProps;
  let fields = item.columns;

  return (
    <Col {...col}>
      <ProFormList
        name={item.key ?? item.dataIndex}
        label={item.title}
        min={item.min ?? 1}
        max={item.max ?? 100}
        itemContainerRender={(doms) => {
          return <ProForm.Group>{doms}</ProForm.Group>;
        }}
        alwaysShowItemLabel={false}
      >
        {(f, index, action) => {
          return (
            <FormRender
              fields={fields}
              action={action}
              curindex={index}
              formRef={formRef}
              name={item.key ?? item.dataIndex}
            />
          );
        }}
      </ProFormList>
    </Col>
  );
}

function TableSelect({ item, value, onChange, params = {} }) {
  const rowKey = item?.rowKey ?? "id";
  const [chooses, setchooses] = useState([]); //mark 标记
  const [activetab, setactivetab] = useState(1);
  const actionRef = useRef();

  const menu = (selectedRows) => (
    <Menu
      style={{ width: 160 }}
      items={
        selectedRows.length > 0
          ? selectedRows.map((it) => ({
              key: it[rowKey],
              label: (
                <div
                  className="spread"
                  onClick={(e) => {
                    e.stopPropagation();
                    let key = it[rowKey];
                    setchooses((s) => {
                      let news = [...s];
                      if (s.includes(key)) {
                        news = news.filter((it) => {
                          return it != key;
                        });
                      } else {
                        news.push(key);
                      }
                      return news;
                    });
                  }}
                >
                  <span
                    style={{
                      color: chooses.includes(it[rowKey])
                        ? "#1890ff"
                        : "#333333",
                      transition: "all 0.4s",
                      userSelect: "none",
                    }}
                  >
                    {it[item.rowName]}
                  </span>
                  <CloseOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      let newvalue = value.filter(
                        (its) => its[rowKey] != it[rowKey]
                      );
                      onChange(newvalue);
                      setchooses((s) => {
                        let news = [...s];
                        news = news.filter((its) => {
                          return its != it[rowKey];
                        });
                        return news;
                      });
                    }}
                  />
                </div>
              ),
            }))
          : [
              {
                key: -1,
                label: "请先选择",
              },
            ]
      }
    />
  );
  useEffect(() => {
    onChange([]);
    actionRef?.current?.reload?.();
  }, [params]);

  const Todo = (
    <EditTable
      actionRef={actionRef}
      defaultValue={value} //调用接口合并初始值
      path={item.path}
      extraparams={params ?? {}}
      rowKey={rowKey}
      columns={item.columns}
      resizeable={false}
      alwaysShowAlert={false}
      tableAlertRender={false}
      tableAlertOptionRender={false}
      rowClassName={(record) => {
        if (chooses.includes(record[rowKey])) {
          return "lightblue";
        } else {
          return "";
        }
      }}
      rowSelection={{
        ...item.rowSelection,
        columnWidth: 44,
        preserveSelectedRowKeys: true,
        selectedRowKeys: value && value?.map((it) => it[rowKey]),
        onChange: (selectedKeys, selectedRows) => {
          const rowkeylist = value ? value?.map((it) => it[rowKey]) : [];
          const newValue = selectedRows?.map((its) => {
            if (rowkeylist.includes(its[rowKey])) {
              return value.filter((it) => it[rowKey] == its[rowKey])[0];
            } else {
              return its;
            }
          });
          onChange(newValue);
        },
      }}
      editable={{
        onValuesChange: (record) => {
          const newValue = value?.map((its) => {
            if (its[rowKey] == record[rowKey]) {
              return record;
            } else {
              return its;
            }
          });
          onChange(newValue);
        },
      }}
    />
  );

  const Done = (
    <EditTable
      value={value}
      rowKey={rowKey}
      columns={item.columns}
      resizeable={false}
      alwaysShowAlert={false}
      tableAlertRender={false}
      tableAlertOptionRender={false}
      rowClassName={(record) => {
        if (chooses.includes(record[rowKey])) {
          return "lightblue";
        } else {
          return "";
        }
      }}
      rowSelection={{
        ...item.rowSelection,
        columnWidth: 44,
        preserveSelectedRowKeys: true,
        selectedRowKeys: value && value?.map((it) => it[rowKey]),
        onChange: (selectedKeys, selectedRows) => {
          const rowkeylist = value ? value?.map((it) => it[rowKey]) : [];
          const newValue = selectedRows?.map((its) => {
            if (rowkeylist.includes(its[rowKey])) {
              return value.filter((it) => it[rowKey] == its[rowKey])[0];
            } else {
              return its;
            }
          });
          onChange(newValue);
        },
      }}
      editable={{
        onValuesChange: (record) => {
          const newValue = value?.map((its) => {
            if (its[rowKey] == record[rowKey]) {
              return record;
            } else {
              return its;
            }
          });
          onChange(newValue);
        },
      }}
    />
  );

  return (
    <div className="selecttable">
      <Tabs
        tabBarExtraContent={
          <div className="center">
            <Dropdown overlay={menu(value ?? [])}>
              <a>
                已选择{value?.length ?? 0}项 <DownOutlined />
              </a>
            </Dropdown>
            <div
              className="center"
              style={{
                color: "red",
                cursor: "pointer",
                margin: "0 6px 0 16px",
              }}
              onClick={() => {
                onChange([]);
                setchooses([]);
              }}
            >
              <RedoOutlined rotate={-90} />
              清空
            </div>
          </div>
        }
        onChange={setactivetab}
        items={[
          { label: "数据选择", key: 1, children: activetab == 1 && Todo },
          {
            label: `选择结果${value?.length ?? 0}项`,
            key: 2,
            children: activetab == 2 && Done,
          },
        ]}
      />
    </div>
  );
}

function LinkSelectList({ item, colProps }) {
  let col = item.colProps ?? colProps;
  let curlinkparams = item?.linkParams ?? {}; //获取linkParams下声明的key
  return (
    <Col {...col}>
      <ProFormDependency name={Object.keys(curlinkparams)}>
        {(params) => {
          const curkey = item.key ?? item.dataIndex;
          let result = {};
          for (let key in curlinkparams) {
            let reversekey = !curlinkparams[key] ? key : curlinkparams[key];
            result[reversekey] = params[key];
          }
          return (
            <Form.Item name={curkey} label={item.title} {...item.formItemProps}>
              <TableSelect item={item} params={result} />
            </Form.Item>
          );
        }}
      </ProFormDependency>
    </Col>
  );
}

function NolinkSelectList({ item, colProps }) {
  let col = item.colProps ?? colProps;
  let curkey = item.key ?? item.dataIndex; //获取key
  return (
    <Col {...col}>
      <Form.Item name={curkey} label={item.title} {...item.formItemProps}>
        <TableSelect item={item} params={item.params} />
      </Form.Item>
    </Col>
  );
}

function FormSelectList(props) {
  let ifs = props?.item?.linkParams;
  if (ifs) {
    return <LinkSelectList {...props} />;
  } else {
    return <NolinkSelectList {...props} />;
  }
}

const FormItems = {
  Input,
  Password,
  Money,
  Textarea,
  Digit,
  DigitRange,
  Date,
  Time,
  DateTime,
  DateWeek,
  DateMonth,
  DateQuarter,
  DateYear,
  DateRange,
  TimeRange,
  DateTimeRange,
  Select,
  TreeSelect,
  Checkbox,
  Radio,
  Switch,
  Cascader,
  Rate,
  Slider,
  UploadBtn,
  UploadImage,
  UploadDragger,
  Editor,
  FormList,
  FormSelectList,
  CheckboxItem,
  RadioItem,
};

let FormRender = memo(({ fields = [], name, curindex, formRef }) => {
  return (
    <>
      {fields
        .filter((it) => it.hideInForm !== true)
        .map((item) => {
          let key = item?.valueType ? upperCase(item?.valueType) : "Input";
          let { hideInForm } = item;
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
                    return (
                      <Col {...item.colProps}>
                        {curindex == 0 ? (
                          <p>
                            <label htmlFor="">{item.title}</label>
                            <p style={{ padding: "6px 0 0 0", margin: 0 }}>
                              <b style={{ color: "red" }}>!</b>{" "}
                              需满足条件才可以填写{item.title}
                            </p>
                          </p>
                        ) : (
                          <p style={{ padding: "4px 0 0 0", margin: 0 }}>
                            <b style={{ color: "red" }}>!</b>{" "}
                            需满足条件才可以填写{item.title}
                          </p>
                        )}
                      </Col>
                    );
                  } else {
                    return (
                      <>
                        {createElement(FormItems[key], {
                          item: item,
                          colProps: item.colProps,
                          key: item.dataIndex,
                          name: name,
                          formRef,
                          curindex,
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
                  item: item,
                  colProps: item.colProps,
                  key: item.dataIndex,
                  name: name,
                  formRef,
                  curindex,
                })}
              </>
            );
          }
        })}
    </>
  );
});

export default {
  Input,
  Password,
  Money,
  Textarea,
  Digit,
  DigitRange,
  Date,
  Time,
  DateTime,
  DateWeek,
  DateMonth,
  DateQuarter,
  DateYear,
  DateRange,
  TimeRange,
  DateTimeRange,
  Select,
  TreeSelect,
  Checkbox,
  Radio,
  Switch,
  Cascader,
  Rate,
  Slider,
  UploadBtn,
  UploadImage,
  UploadDragger,
  Editor,
  FormList,
  FormSelectList,
  CheckboxItem,
  RadioItem,
};

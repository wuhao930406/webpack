/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { doFetch } from "@/utils/doFetch";
import { ProTable } from "@ant-design/pro-components";
import { Tooltip } from "@mui/material";
import { useAsyncEffect } from "ahooks";
import { memo, useRef, useState } from "react";
import Resizecell from "./Resizecell";

let handlEmptyChild = (tree = []) => {
  const newtree = tree.map((item) => {
    if (!item.children || item.children.length == 0) {
      item.value = item.key;
      return item;
    } else {
      item.value = item.key;
      return {
        ...item,
        children: handlEmptyChild(item.children),
      };
    }
  });
  return newtree;
};

const AutoTable = (props) => {
  const {
    actionRef, //表格动作
    formRef, //表单Ref
    rowKey, // key
    columns = [], //columns
    style, //style
    path, //接口地址
    extraparams, //额外参数
    pageSize, //修改默认pageSize
    pagination, //分页设置
    x, //横向滚动
    resizeable = false,
    rerendered = true,
  } = props;

  const actionRefs = actionRef ?? useRef(),
    formRefs = formRef ?? useRef(),
    ifspagination = pagination == "false" || pagination === false,
    [size, setsize] = useState("large"),
    [valueColumns, setvalueColumns] = useState({});
  const [columnes, setcolumnes] = useState(
    columns?.filter?.((it) => it.valueType != "split") ?? []
  );

  //调用接口
  const request = async (params, sort, filter) => {
    if (!path) return;
    let newparams = {
      ...params,
      ...extraparams, //父组件传参
      pageIndex: params.current,
      pageSize: params.pageSize || pageSize,
    };
    delete newparams.current;
    if (ifspagination) {
      delete newparams.pageIndex;
      delete newparams.pageSize;
    }
    const result = await doFetch({ url: path, params: newparams });
    //分页结果
    let data = result?.data?.page?.records,
      success = true,
      total = result?.data?.page?.total;
    //不带分页获取结果
    if (ifspagination) {
      data = result?.data?.dataList;
      total = result?.data?.dataList?.length;
    }
    return {
      data,
      success,
      total,
    };
  };

  function changeColumns(params) {
    setcolumnes((s) => {
      return s
        .filter((it) => it.valueType != "split")
        .map((item, index) => {
          let it = { ...item },
            curkey = it?.key ?? it?.dataIndex;
          if (it.valueType == "option") {
            curkey = "option";
          }
          let options = {};
          if (
            ["select", "treeSelect", "radio", "checkbox", "cascader"].includes(
              it?.valueType
            )
          ) {
            if (Array.isArray(it.options)) {
              options = {
                fieldProps: {
                  ...it?.fieldProps,
                  options: [...it.options],
                  dropdownMatchSelectWidth: 200,
                },
              };
            } else if (it.options) {
              options = {
                fieldProps: {
                  ...it?.fieldProps,
                  dropdownMatchSelectWidth: 200,
                  showSearch: true,
                },
                params: params,
                request: async (parames) => {
                  if (Object.keys(it?.options).includes("linkParams")) {
                    let list = await doFetch({
                      url: it?.options?.path,
                      params: { ...params, isAll: 1 },
                    });
                    const res = list.data.dataList;
                    return it.valueType == "treeSelect"
                      ? handlEmptyChild(res)
                      : res;
                  } else {
                    let list = await doFetch({
                      url: it?.options?.path,
                      params: it?.options?.params,
                    });
                    const res = list.data.dataList;
                    return it.valueType == "treeSelect"
                      ? handlEmptyChild(res)
                      : res;
                  }
                },
              };
            }
          }

          if (it.valueType == "option") {
            options = {
              key: "option",
              dataIndex: "option",
              fixed: "right",
            };
          }
          if (!it.render) {
            options = {
              ...options,
              render: (text, row) => {
                return (
                  <Tooltip title={row[it.dataIndex]} placement="bottom-start">
                    <span className="table-cell">
                      {row[it.dataIndex] ?? "-"}
                    </span>
                  </Tooltip>
                );
              },
            };
          }
          options = {
            ...options,
          };

          delete it.formItemProps;
          return {
            ...it,
            ...options,
            onHeaderCell: (column) => ({
              width: column.width,
              onResize: handleResize(index),
              onResizeStop: handleResizeStop(index),
            }),
          };
        });
    });
  }

  //调用重新渲染表格
  useAsyncEffect(async () => {
    changeColumns({});
    rerendered && actionRefs?.current?.reload();
  }, [path, columns, extraparams]);

  //缩放表格
  const handleResize =
    (index) =>
    (e, { size }) => {
      e.stopImmediatePropagation();
      setcolumnes((s) => {
        const nextColumns = [...s];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return nextColumns;
      });
    };

  //更新表格缩放
  const handleResizeStop =
    (index) =>
    (e, { size }) => {
      e.stopImmediatePropagation();
      setvalueColumns((s) => {
        let submitdata = { ...s } ?? {},
          curkey = columnes[index]?.key ?? columnes[index]?.dataIndex;
        if (!curkey) return;
        submitdata[curkey] = submitdata[curkey] ?? {};
        submitdata[curkey].width = parseInt(size.width);
        delete submitdata["undefined"];
        return submitdata;
      });
    };

  const components = resizeable
    ? {
        components: {
          header: {
            cell: Resizecell,
          },
        },
        columnsState: {
          value: valueColumns,
          onChange: (val, state) => {
            setvalueColumns((s) => {
              let submitdata = {
                ...s,
                ...val,
              };
              return submitdata;
            });
          },
        },
      }
    : {};

  return (
    <ProTable
      {...props}
      {...components}
      size={size}
      form={{
        onValuesChange: (changedValues, values) => {
          let curchangekey = Object.keys(changedValues)[0];
          let newparams = {},
            resetkeys = [];
          columns.map((it, i) => {
            const { linkParams } = it?.options??{};
            if (linkParams && Object.keys(linkParams).includes(curchangekey)) {
              for (let dataindex in linkParams) {
                let linkkey = "";
                if (!linkParams[dataindex]) {
                  linkkey = dataindex;
                } else {
                  linkkey = linkParams[dataindex];
                }

                newparams[linkkey] =
                  formRefs?.current?.getFieldValue?.(dataindex);
                resetkeys.push(it?.key);
              }
            }
          });
          const resetkey = resetkeys?.filter((it) => it !== curchangekey)?.[0];
          if (resetkey) {
            formRefs?.current?.setFieldsValue({ [resetkey]: "" });
          }
          if (Object?.keys?.(newparams)?.length > 0) {
            changeColumns(newparams);
          }
        },
      }}
      onSubmit={(params) => {
        // formRef?.current?
      }}
      onSizeChange={(size) => {
        localStorage.setItem("size", size); //设置全局表格规格缓存
        setsize(size);
      }}
      columns={columnes ?? []}
      style={style || {}}
      actionRef={actionRefs}
      formRef={formRefs}
      rowKey={rowKey ?? "id"} //表格每行数据的key
      dateFormatter="string"
      request={request}
      pagination={{
        size: !ifspagination ? "default" : "small",
        showTotal: (total, range) => <span>共{total}条</span>,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 15, 30, 50, 100, 200],
        defaultPageSize: pageSize || 15,
      }}
      search={{
        filterType: "light", //轻量模式
        placement: "bottomLeft",
      }}
    />
  );
};

export default memo(AutoTable);

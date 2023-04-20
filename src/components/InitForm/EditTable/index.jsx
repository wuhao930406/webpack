/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState, memo, useMemo } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import { Tooltip } from '@mui/material';
import { doFetch } from '@/utils/doFetch';

const EditTable = (props) => {
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
    refreshDep, //依赖刷新 （已废弃）
  } = props;

  const actionRefs = actionRef ?? useRef(),
    formRefs = formRef ?? useRef(),
    ifspagination = pagination == 'false' || pagination === false,
    [size, setsize] = useState('small');

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
    let data = result?.data?.page?.list,
      success = true,
      total = result?.data?.page?.total;
    //不带分页获取结果
    if (ifspagination || !data) {
      data = result?.data?.dataList;
      total = result?.data?.dataList?.length;
    }
    //存在默认选中向上返回选中值
    return {
      data,
      success,
      total,
    };
  };

  let columncs = useMemo(() => {
    return columns.map((item, index) => {
      let it = { ...item };
      let itemwidth = it.width ? it.width : 'auto';
      let options = {};
      if (it.valueType == 'select' || it.valueType == 'checkbox') {
        if (Array.isArray(it.options)) {
          options = {
            fieldProps: {
              options: [...it.options],
            },
          };
        } else if (it.options) {
          options = {
            request: async (params) => {
              let list = await doFetch({ url: it?.options?.path, params: it?.options?.params });
              return list.data.dataList;
            },
          };
        }
      }
      if (it.valueType == 'option') {
        options = {
          key: 'option',
          dataIndex: 'option',
          fixed: 'right',
        };
      }
      if (!it.render) {
        options = {
          ...options,
          render: (text, row) => {
            return (
              <Tooltip title={row[it.dataIndex]} placement="bottom-start">
                <span className="table-cell">{row[it.dataIndex] ?? '-'}</span>
              </Tooltip>
            );
          },
        };
      }

      options = {
        ...options,
        width: itemwidth,
      };

      delete it.formItemProps;
      return {
        ...it,
        ...options,
      };
    });
  }, [columns]);

  return (
    <EditableProTable
      {...props}
      recordCreatorProps={false}
      size={size}
      onSubmit={(params) => {
        console.log(params, 'onSubmit');
      }}
      onSizeChange={(size) => {
        localStorage.setItem('size', size); //设置全局表格规格缓存
        setsize(size);
      }}
      columns={columncs ?? []}
      style={style || {}}
      actionRef={actionRefs}
      formRef={formRefs}
      rowKey={rowKey ?? 'id'} //表格每行数据的key
      dateFormatter="string"
      request={request}
      scroll={
        x
          ? {
              x: x,
            }
          : {}
      }
      pagination={
        ifspagination
          ? false
          : {
              showTotal: (total, range) => <span>共{total}条</span>,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 15, 30, 50, 100, 200],
              defaultPageSize: pageSize || 15,
            }
      }
      editable={{
        type: 'multiple',
        editableKeys: props?.rowSelection?.selectedRowKeys ?? [],
        ...props?.editable,
      }}
      search={{
        filterType: 'light', //轻量模式
      }}
    />
  );
};

export default memo(EditTable);

/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
import IconFont from '@/components/IconFont';
import { doFetch, getFetch, postFetch } from '@/utils/doFetch';
import {
  ProForm,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useAsyncEffect } from 'ahooks';
import { Button, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import EditorItem from './EditorItem';
import Tagadder from './Tagadder';

function generateRandomString(length, character) {
  let randomString = '';
  let characters = character ?? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().startOf('day');
};

const disabledDates = (current, enddate) => {
  // Can not select days before today and today
  return (
    (current && current < dayjs().startOf('day')) ||
    (current && current > dayjs(enddate).endOf('day'))
  );
};

const Add = ({ refresh }) => {
  return (
    <ProForm
      layout={'vertical'}
      style={{ marginTop: 24 }}
      grid={true}
      colProps={{
        span: 24,
      }}
      onFinish={async (values) => {
        let res = await postFetch({
          url: '/webtool/v1/org',
          params: { ...values, org_join_key: generateRandomString(18) },
        });
        if (res?.code === 0) {
          message.success('创建并绑定成功！');
          refresh?.();
        }
      }}
      submitter={{
        render: (props, doms) => {
          return [
            <Button type="default" key="rest" onClick={() => props.form?.resetFields()}>
              重置
            </Button>,
            <Button
              style={{ flex: 1 }}
              type="primary"
              key="submit"
              onClick={() => {
                props.form?.submit?.();
              }}
              icon={<IconFont type="icon-tijiao" />}
              loading={props.submitButtonProps?.loading}
            >
              提交
            </Button>,
          ];
        },
      }}
    >
      <ProFormText
        name="org_name"
        tooltip="最长为 24 位"
        label="组织名称"
        placeholder="请输入名称"
        fieldProps={{
          showCount: true,
          maxLength: 24,
        }}
        rules={[
          {
            required: true,
            message: '请输入名称!',
          },
        ]}
      />
    </ProForm>
  );
};

const Join = ({ refresh }) => {
  return (
    <ProForm
      layout={'vertical'}
      style={{ marginTop: 24 }}
      grid={true}
      colProps={{
        span: 24,
      }}
      onFinish={async (values) => {
        let res = await postFetch({
          url: '/webtool/userbind',
          params: { ...values },
        });
        if (res?.code === 0) {
          message.success('绑定成功！');
          refresh?.();
        }
      }}
      submitter={{
        render: (props, doms) => {
          return [
            <Button type="default" key="rest" onClick={() => props.form?.resetFields()}>
              重置
            </Button>,
            <Button
              style={{ flex: 1 }}
              type="primary"
              key="submit"
              onClick={() => {
                props.form?.submit?.();
              }}
              icon={<IconFont type="icon-tijiao" />}
              loading={props.submitButtonProps?.loading}
            >
              提交
            </Button>,
          ];
        },
      }}
    >
      <ProFormText
        name="org_join_key"
        label="邀请码"
        placeholder="请输入邀请码"
        rules={[
          {
            required: true,
            message: '请输入邀请码!',
          },
        ]}
      />
    </ProForm>
  );
};

const Pwd = ({ refresh, currentUser }) => {
  const formRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      formRef?.current?.setFieldsValue({ oldpwd: null });
    });
  }, [formRef]);

  return (
    <ProForm
      autoComplete={'off'}
      formRef={formRef}
      layout={'vertical'}
      style={{ marginTop: 24 }}
      initialValues={{
        oldpwd: null,
      }}
      grid={true}
      colProps={{
        span: 24,
      }}
      onFinish={async (values) => {
        delete values?.old;
        let res = await doFetch({
          url: '/webtool/v1/user/' + currentUser?.id,
          params: { ...values },
          method: 'PUT',
        });
        if (res?.code === 0) {
          doFetch({ url: '/webtool/logout', params: {} }).then((res) => {
            localStorage.removeItem('TOKENES');
            history.push('/user/login');
            message.success('密码修改成功，请重新登录');
          });
        }
      }}
      submitter={{
        render: (props, doms) => {
          return [
            <Button type="default" key="rest" onClick={() => props.form?.resetFields()}>
              重置
            </Button>,
            <Button
              style={{ flex: 1 }}
              type="primary"
              key="submit"
              onClick={() => {
                props.form?.submit?.();
              }}
              icon={<IconFont type="icon-tijiao" />}
              loading={props.submitButtonProps?.loading}
            >
              提交
            </Button>,
          ];
        },
      }}
    >
      <div style={{ position: 'absolute', top: -1000000 }}>
        <ProFormText.Password name="old" label="旧密码" placeholder="旧密码" />
      </div>

      <ProFormText.Password
        fieldProps={{
          autoComplete: 'off',
        }}
        name="oldpwd"
        label="旧密码"
        placeholder="旧密码"
        rules={[
          {
            required: true,
            message: '请输入旧密码!',
          },
        ]}
      />

      <ProFormText.Password
        name="password"
        label="新密码"
        placeholder="新密码"
        rules={[
          {
            required: true,
            message: '请输入新密码!',
          },
        ]}
      />
      <ProFormText.Password
        name="cfpwd"
        label="确认新密码"
        placeholder="新密码"
        rules={[
          {
            required: true,
            message: '请输入新密码!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致!'));
            },
          }),
        ]}
      />
    </ProForm>
  );
};

const AddPro = ({ refresh, defaultid }) => {
  const formRef = useRef();
  return (
    <ProForm
      formRef={formRef}
      layout={'vertical'}
      style={{ marginTop: 24 }}
      grid={true}
      colProps={{
        span: 24,
      }}
      onFinish={async (values) => {
        let steps = values?.steps ?? [];
        steps = steps?.map?.((it, i) => {
          return {
            ...it,
          };
        });

        let res = await postFetch({
          url: '/webtool/v1/project',
          params: { ...values, steps },
        });
        if (res?.code === 0) {
          refresh?.();
        }
      }}
      submitter={{
        render: (props, doms) => {
          return [
            <Button type="default" key="rest" onClick={() => props.form?.resetFields()}>
              重置
            </Button>,
            <Button
              style={{ flex: 1 }}
              type="primary"
              key="submit"
              onClick={() => {
                props.form?.submit?.();
              }}
              icon={<IconFont type="icon-tijiao" />}
              loading={props.submitButtonProps?.loading}
            >
              提交
            </Button>,
          ];
        },
      }}
      onValuesChange={(a, b) => {
        const curvalue = Object.values(a)[0];
        if (Object?.keys(a).includes('user_list')) {
          formRef?.current?.setFieldsValue({
            user_list: [...new Set([...(curvalue ?? []), defaultid])],
          });
        }
      }}
      initialValues={{
        user_list: [defaultid],
      }}
    >
      <ProFormText
        name="project_name"
        tooltip="最长为 24 位"
        label="小组名称"
        placeholder="请输入小组名称"
        fieldProps={{
          showCount: true,
          maxLength: 24,
        }}
        rules={[
          {
            required: true,
            message: '请输入小组名称!',
          },
        ]}
      />
      <ProFormSelect
        name="user_list"
        label="选择参与人员"
        mode="multiple"
        request={async () => {
          let res = await getFetch({ url: '/webtool/v1/user', params: {} });
          return res?.data?.map((it, i) => {
            return {
              label: it?.user_name,
              value: it?.id,
            };
          });
        }}
        placeholder="请选择"
        rules={[{ required: true, message: '请选择参与人员!' }]}
      />
      <ProFormList
        name="steps"
        label="流程"
        alwaysShowItemLabel
        creatorButtonProps={{
          creatorButtonText: '新增流程',
        }}
      >
        {(f, index, action) => {
          return (
            <ProFormGroup key="group">
              <ProFormText name="name" label={`第 ${index + 1} 步`} />
            </ProFormGroup>
          );
        }}
      </ProFormList>
      <ProForm.Item
        transform={(value) => {
          return {
            output_path: value ? value?.toHTML?.() : null,
          };
        }}
        name={'output_path'}
        label={'小组公告'}
      >
        <EditorItem />
      </ProForm.Item>
      <ProFormDatePicker
        name="deadline"
        label="截止日期"
        rules={[{ required: true, message: '请选择截止日期!' }]}
        fieldProps={{
          style: { width: '100%' },
          disabledDate,
        }}
      />
    </ProForm>
  );
};

const EditRemark = ({ refresh, initialValues, id }) => {
  const formRef = useRef();
  return (
    <ProForm
      formRef={formRef}
      layout={'vertical'}
      style={{ marginTop: 24 }}
      grid={true}
      colProps={{
        span: 24,
      }}
      onFinish={async (values) => {
        let res = await doFetch({
          url: '/webtool/v1/project/' + id,
          params: { ...values },
          method: 'PUT',
        });
        if (res?.code === 0) {
          refresh?.();
        }
      }}
      submitter={{
        render: (props, doms) => {
          return [
            <Button type="default" key="rest" onClick={() => props.form?.resetFields()}>
              重置
            </Button>,
            <Button
              style={{ flex: 1 }}
              type="primary"
              key="submit"
              onClick={() => {
                props.form?.submit?.();
              }}
              icon={<IconFont type="icon-tijiao" />}
              loading={props.submitButtonProps?.loading}
            >
              提交
            </Button>,
          ];
        },
      }}
      onValuesChange={(a, b) => {
        const curvalue = Object.values(a)[0];
        if (Object?.keys(a).includes('user_list')) {
          formRef?.current?.setFieldsValue({
            user_list: [...new Set([...(curvalue ?? []), defaultid])],
          });
        }
      }}
      initialValues={initialValues}
    >
      <ProForm.Item
        transform={(value) => {
          return {
            output_path: value ? value?.toHTML?.() : null,
          };
        }}
        name={'output_path'}
      >
        <EditorItem />
      </ProForm.Item>
    </ProForm>
  );
};

const CopyPro = ({ refresh, defaultid, initialValues = {} }) => {
  const formRef = useRef();
  useAsyncEffect(async () => {
    let res = await getFetch({
      url: '/webtool/v1/tag',
      params: { project_id: initialValues?.id },
    });
    res = res?.data?.map((it, i) => {
      return it?.id;
    });
    formRef?.current?.setFieldsValue({ tags: res });
  }, [initialValues]);

  return (
    <ProForm
      formRef={formRef}
      layout={'vertical'}
      style={{ marginTop: 24 }}
      grid={true}
      colProps={{
        span: 24,
      }}
      initialValues={initialValues}
      onFinish={async (values) => {
        let project_name = values?.project_name;
        if (values.project_name === initialValues.project_name) {
          project_name = '复制: ' + project_name;
        }
        let res = await postFetch({
          url: '/webtool/v1/project',
          params: {
            ...values,
            steps: values?.steps?.map((it) => ({
              name: it?.name,
            })),
            project_name,
          },
        });
        if (res?.code === 0) {
          refresh?.();
        }
      }}
      submitter={{
        render: (props, doms) => {
          return [
            <Button type="default" key="rest" onClick={() => props.form?.resetFields()}>
              重置
            </Button>,
            <Button
              style={{ flex: 1 }}
              type="primary"
              key="submit"
              onClick={() => {
                props.form?.submit?.();
              }}
              icon={<IconFont type="icon-tijiao" />}
              loading={props.submitButtonProps?.loading}
            >
              提交
            </Button>,
          ];
        },
      }}
      onValuesChange={(a, b) => {
        const curvalue = Object.values(a)[0];
        if (Object?.keys(a).includes('user_list')) {
          formRef?.current?.setFieldsValue({
            user_list: [...new Set([...(curvalue ?? []), defaultid])],
          });
        }
      }}
    >
      <ProFormText
        name="project_name"
        tooltip="最长为 24 位"
        label="小组名称"
        placeholder="请输入小组名称"
        fieldProps={{
          showCount: true,
          maxLength: 24,
        }}
        rules={[
          {
            required: true,
            message: '请输入小组名称!',
          },
        ]}
      />
      <ProFormSelect
        name="user_list"
        label="选择参与人员"
        mode="multiple"
        request={async () => {
          let res = await getFetch({ url: '/webtool/v1/user', params: {} });
          return res?.data?.map((it, i) => {
            return {
              label: it?.user_name,
              value: it?.id,
            };
          });
        }}
        placeholder="请选择"
        rules={[{ required: true, message: '请选择参与人员!' }]}
      />
      <ProFormList
        name="steps"
        label="流程"
        alwaysShowItemLabel
        creatorButtonProps={{
          creatorButtonText: '新增流程',
        }}
      >
        {(f, index, action) => {
          return (
            <ProFormGroup key="group">
              <ProFormText name="name" label={`第 ${index + 1} 步`} />
            </ProFormGroup>
          );
        }}
      </ProFormList>
      <ProFormDatePicker
        name="deadline"
        label="截止日期"
        rules={[{ required: true, message: '请选择截止日期!' }]}
        fieldProps={{
          style: { width: '100%' },
          disabledDate,
        }}
      />
      <ProFormSelect
        name="tags"
        label="选择标签"
        mode="multiple"
        colProps={{
          span: 24,
        }}
        mode="tags"
        request={async () => {
          let res = await getFetch({
            url: '/webtool/v1/tag',
            params: { project_id: initialValues?.id },
          });
          return res?.data?.map((it, i) => {
            return {
              label: it?.tag_name,
              value: it?.id,
            };
          });
        }}
        placeholder="请选择"
        rules={[{ required: true, message: '请选择选择标签!' }]}
      />
    </ProForm>
  );
};

const AddUsers = ({ refresh, project_id, initialValues = {} }) => {
  const formRef = useRef();
  return (
    <ProForm
      formRef={formRef}
      layout={'vertical'}
      style={{ marginTop: 24 }}
      grid={true}
      colProps={{
        span: 24,
      }}
      onFinish={async (values) => {
        let res = await doFetch({
          url: '/webtool/v1/project/' + project_id,
          params: { ...values },
          method: 'PUT',
        });
        if (res?.code === 0) {
          refresh?.();
        }
      }}
      submitter={{
        render: (props, doms) => {
          return [
            <Button type="default" key="rest" onClick={() => props.form?.resetFields()}>
              重置
            </Button>,
            <Button
              style={{ flex: 1 }}
              type="primary"
              key="submit"
              onClick={() => {
                props.form?.submit?.();
              }}
              icon={<IconFont type="icon-tijiao" />}
              loading={props.submitButtonProps?.loading}
            >
              提交
            </Button>,
          ];
        },
      }}
      initialValues={initialValues}
    >
      <ProFormSelect
        name="user_list"
        label="选择参与人员"
        mode="multiple"
        request={async () => {
          let res = await getFetch({ url: '/webtool/v1/user', params: {} });
          return res?.data?.map((it, i) => {
            return {
              label: it?.user_name,
              value: it?.id,
            };
          });
        }}
        placeholder="请选择"
        rules={[{ required: true, message: '请选择参与人员!' }]}
      />
    </ProForm>
  );
};

const AddMission = ({
  refresh,
  step_id,
  sort,
  project_id,
  defaultValue,
  userList,
  enddate,
  title,
  org_id,
}) => {
  return (
    <ProForm
      initialValues={{
        ...defaultValue,
        other: defaultValue?.other?.map((it, i) => {
          return {
            ...it,
            uid: i,
            name: it?.fileName,
            status: 'done',
            url: it?.url,
          };
        }),
      }}
      layout={'vertical'}
      style={{ marginTop: 24 }}
      grid={true}
      colProps={{
        span: 24,
      }}
      onFinish={async (values) => {
        let res = {};
        if (title === '新建任务') {
          res = await doFetch({
            url: '/webtool/v1/item',
            params: {
              ...values,
              project_id,
              step_id,
              sort,
            },
          });
        } else if (title === '编辑任务') {
          res = await doFetch({
            url: '/webtool/v1/item/' + defaultValue.id,
            params: { ...values, project_id },
            method: 'PUT',
          });
        } else if (title === '任务池-新建任务') {
          res = await doFetch({
            url: '/webtool/v1/item',
            params: {
              ...values,
              project_id,
              step_id: org_id + 9999999,
              sort,
            },
          });
        } else if (title === '任务池-编辑任务') {
          res = await doFetch({
            url: '/webtool/v1/item/' + defaultValue.id,
            params: { ...values },
            method: 'PUT',
          });
        }

        if (res?.code === 0) {
          refresh?.();
        }
      }}
      submitter={{
        render: (props, doms) => {
          return [
            <Button type="default" key="rest" onClick={() => props.form?.resetFields()}>
              重置
            </Button>,
            <Button
              style={{ flex: 1 }}
              type="primary"
              key="submit"
              onClick={() => {
                props.form?.submit?.();
              }}
              icon={<IconFont type="icon-tijiao" />}
              loading={props.submitButtonProps?.loading}
            >
              提交
            </Button>,
          ];
        },
      }}
    >
      <ProFormText
        name="mission_name"
        tooltip="最长为 24 位"
        label="任务名称"
        placeholder="请输入任务名称"
        fieldProps={{
          showCount: true,
          maxLength: 24,
        }}
        rules={[
          {
            required: true,
            message: '请输入任务名称!',
          },
        ]}
        colProps={{
          span: 12,
        }}
      />

      <ProFormDatePicker
        name="deadline"
        label="截止日期"
        fieldProps={{
          style: { width: '100%' },
          disabledDate: (current) => disabledDates(current, enddate),
        }}
        colProps={{
          span: 12,
        }}
      />

      <ProFormSelect
        name="userid"
        label="选择负责人"
        rules={[
          {
            required: true,
            message: '请选择负责人!',
          },
        ]}
        fieldProps={{
          style: { width: '100%' },
        }}
        colProps={{
          span: 6,
        }}
        options={userList?.map((it) => {
          return {
            label: it?.user_name,
            value: it?.id,
          };
        })}
      ></ProFormSelect>

      <ProFormSelect
        name="tags"
        label="选择标签"
        mode="multiple"
        colProps={{
          span: 18,
        }}
        mode="tags"
        request={async () => {
          let res = await getFetch({ url: '/webtool/v1/tag', params: { project_id, org_id } });
          return res?.data?.map((it, i) => {
            return {
              label: it?.tag_name,
              value: it?.id,
            };
          });
        }}
        placeholder="请选择"
        rules={[{ required: true, message: '请选择选择标签!' }]}
      />

      <ProForm.Item
        transform={(value) => {
          return {
            remark: value ? value?.toHTML?.() : null,
          };
        }}
        name={'remark'}
        label={'备注'}
      >
        <EditorItem />
      </ProForm.Item>
      <ProFormUploadButton
        label="上传附件"
        name="other"
        action={`${REACT_APP_URL}/webtool/uploadfile`}
        fieldProps={{
          headers: { Authorization: localStorage.getItem('TOKENES') },
        }}
        transform={(value) => {
          const transvalue = value?.map((it) => {
            if (it.response) {
              return it?.response;
            } else {
              return it;
            }
          });
          return {
            other: JSON.stringify(transvalue),
          };
        }}
      />
    </ProForm>
  );
};

const AddReply = ({ formRef }) => {
  return (
    <ProForm
      layout={'vertical'}
      style={{ marginTop: 24 }}
      grid={true}
      colProps={{
        span: 24,
      }}
      formRef={formRef}
      submitter={false}
    >
      <ProForm.Item
        transform={(value) => {
          return {
            reply: value ? value?.toHTML?.() : null,
          };
        }}
        name={'reply'}
      >
        <EditorItem />
      </ProForm.Item>
    </ProForm>
  );
};

const AddTags = ({ refresh, step_id, sort, project_id, defaultValue, userList, enddate }) => {
  return (
    <ProForm
      initialValues={defaultValue}
      layout={'vertical'}
      style={{ marginTop: 24 }}
      grid={true}
      colProps={{
        span: 24,
      }}
      submitter={{
        render: false,
      }}
      onValuesChange={(changedvalue, allvalue) => {
        const params = {
          tags: changedvalue.tags?.map((it, i) => ({
            ...it,
            project_id,
            tag_name: it?.text,
          })),
        };
        doFetch({ url: '/webtool/v1/mutitag', params: { ...params } });
      }}
      request={async () => {
        let alldata = await getFetch({ url: '/webtool/v1/tag', params: { project_id } });
        return {
          tags: alldata?.data
            ? alldata?.data?.map((it) => ({
                ...it,
                text: it.tag_name,
              }))
            : [],
        };
      }}
    >
      <ProForm.Item
        name={'tags'}
        label={'添加标签'}
        colProps={{
          span: 24,
        }}
        style={{ paddingLeft: 6 }}
      >
        <Tagadder max={50} />
      </ProForm.Item>
    </ProForm>
  );
};

const AddSteps = ({ refresh, columns, id, step_id, title, initialValues }) => {
  const formRef = useRef();
  return (
    <ProForm
      formRef={formRef}
      initialValues={{
        other: initialValues,
      }}
      layout={'vertical'}
      style={{ marginTop: 24 }}
      grid={true}
      colProps={{
        span: 24,
      }}
      onFinish={async (values) => {
        const sort = columns ? columns.length : 0;
        let res = {};
        if (title === '编辑起止时间') {
          res = await doFetch({
            url: '/webtool/v1/step/' + step_id,
            params: {
              ...values,
              project_id: id,
              other: values?.other?.toString() ?? null,
            },
            method: 'PUT',
          });
        } else {
          res = await doFetch({
            url: '/webtool/v1/step',
            params: {
              ...values,
              sort,
              project_id: id,
              other: values?.other?.toString(),
            },
          });
        }

        if (res?.code === 0) {
          refresh?.();
        }
      }}
      submitter={{
        render: (props, doms) => {
          return [
            <Button type="default" key="rest" onClick={() => props.form?.resetFields()}>
              重置
            </Button>,
            <Button
              style={{ flex: 1 }}
              type="primary"
              key="submit"
              onClick={() => {
                props.form?.submit?.();
              }}
              icon={<IconFont type="icon-tijiao" />}
              loading={props.submitButtonProps?.loading}
            >
              提交
            </Button>,
          ];
        },
      }}
    >
      {title === '编辑起止时间' ? null : (
        <ProFormText
          name="name"
          tooltip="最长为 24 位"
          label="流程名称"
          placeholder="请输入流程名称"
          fieldProps={{
            showCount: true,
            maxLength: 24,
          }}
          rules={[
            {
              required: true,
              message: '请输入流程名称!',
            },
          ]}
        />
      )}

      <ProFormDateRangePicker
        name="other"
        tooltip="预计该阶段起止时间范围"
        label="时间范围"
        placeholder={['请选择开始时间', '请选择结束时间']}
        fieldProps={{
          style: {
            width: '100%',
          },
        }}
      />
    </ProForm>
  );
};

export {
  Add,
  Join,
  Pwd,
  AddPro,
  AddMission,
  AddTags,
  AddSteps,
  AddUsers,
  AddReply,
  CopyPro,
  EditRemark,
};

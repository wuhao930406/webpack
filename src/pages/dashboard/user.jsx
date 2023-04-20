import { getFetch } from '@/utils/doFetch';
import { useRequest } from 'ahooks';
import { Avatar, Table } from 'antd';

function User() {
  const { data } = useRequest(async () => {
    let res = await getFetch({ url: '/webtool/allusers', params: {} });
    return res?.data;
  });

  const columns = [
    {
      title: '头像',
      dataIndex: 'head_url',
      key: 'head_url',
      render: (text, row) => {
        return <Avatar src={text} alt="" />;
      },
    },
    {
      title: '用户名',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data??[]} pagination={{
        showTotal:(val)=>`共${val}条`
      }}/>
    </>
  );
}

export default User;

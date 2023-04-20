import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';
import { Outlet,useLocation ,history} from '@umijs/max'
import './index.less';




const { Header, Content, Footer, Sider } = Layout;
const labels = ["用户","组织"];
const paths = ["/dashboard/user","/dashboard/org"]
const items = [
  UserOutlined,
  VideoCameraOutlined,
  // UploadOutlined,
  // BarChartOutlined,
  // CloudOutlined,
  // AppstoreOutlined,
  // TeamOutlined,
  // ShopOutlined,
].map((icon, index) => ({
  key: paths[index],
  icon: React.createElement(icon),
  label: labels[index],
}));



const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { pathname } = useLocation();


  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
      >
        <div className="centerl" style={{ padding: "12px 24px 16px 24px" }}>
          <img
            src="./logo.png"
            alt=""
            style={{
              width: 40,
              filter: 'brightness(0) saturate(100%) invert(100%) sepia(100%) hue-rotate(180deg)',
            }}
            onClick={()=>{
              history.push("/")
            }}
          />
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={items} onClick={(e)=>{
          history.push(e.key)
        }}/>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
            flex: 1,
            overflow: 'auto',
            padding: 12,
            background: colorBgContainer,
          }}
        >
           <Outlet></Outlet>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Dashboard;

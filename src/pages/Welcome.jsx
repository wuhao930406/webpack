/* eslint-disable react/jsx-key */
import DragModal from '@/components/DragModal';
import { Add, Join, Pwd } from '@/components/DragModal/formdoms';
import Header from '@/components/Header';
import Highlighter from '@/components/Highlighter';
import IconFont from '@/components/IconFont';
import Weather from '@/components/Weather';
import { doFetch, getFetch } from '@/utils/doFetch';
import { DesktopOutlined, MessageOutlined, SearchOutlined, SettingFilled } from '@ant-design/icons';
import { history, Outlet, useLocation, useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import {
  Avatar,
  Badge,
  Col,
  ConfigProvider,
  Drawer,
  Dropdown,
  Grid,
  Input,
  List,
  message,
  Modal,
  notification,
  Popconfirm,
  Row,
  Segmented,
  Skeleton,
  Tooltip,
  Typography,
} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import io from 'socket.io-client';
import styles from './index.less';

const { Paragraph } = Typography;
const { useBreakpoint } = Grid;
let col = { xs: 24, sm: 24, md: { span: 12 } },
  cols = { xs: 24, sm: 24, md: { span: 12 } };

dayjs.locale('zh-cn');
const gaodekey = { key: 'ef1aace83eafd3eab2d42e013b456bae' };
const socket = io(REACT_APP_URL, { query: { id: localStorage.getItem('ID') } });

function difftime(start, end) {
  const diffInMs = start.diff(end);
  if (diffInMs < 60 * 60 * 1000) {
    // 时间差小于 1 小时，转为分钟
    const diffInMinutes = Math.round(diffInMs / (60 * 1000));
    return diffInMinutes + '分钟前';
  } else {
    // 时间差大于等于 1 小时，继续判断是否超过 24 小时
    const diffInHours = Math.round(diffInMs / (60 * 60 * 1000));
    if (diffInHours >= 24) {
      // 时间差超过 24 小时，转为天
      const diffInDays = Math.round(diffInHours / 24);
      return diffInDays + '天前';
    } else {
      // 时间差在 1 小时到 24 小时之间，直接输出小时数
      return diffInHours + '小时前';
    }
  }
}

function Welcome(props) {
  const {
    initialState: { currentUser, fetchUserInfo },
    setInitialState,
  } = useModel('@@initialState');
  const { pathname } = useLocation();
  const screens = useBreakpoint();
  let scrollRef = useRef();
  const [modal, setmodal] = useState({
    open: false,
  });
  const [ips, setips] = useState({});
  const [dot, setdot] = useState(false);
  const [drawer, setdrawer] = useState({
    open: false,
  });
  const [dom, setdom] = useState(null);
  const [search, setsearch] = useState();

  const items = useMemo(() => {
    return currentUser?.org_id
      ? [
          {
            key: '3',
            label: <a style={{ color: '#1890ff' }}>修改密码</a>,
          },
          {
            key: '4',
            danger: true,
            label: '退出登录',
          },
        ]
      : [
          {
            key: '1',
            label: <a>创建组织</a>,
          },
          {
            key: '2',
            label: <a>加入组织</a>,
          },
          {
            key: '3',
            label: <a style={{ color: '#1890ff' }}>修改密码</a>,
          },
          {
            key: '4',
            danger: true,
            label: '退出登录',
          },
        ];
  }, [currentUser?.org_id]);

  const { run, loading } = useRequest(
    () => {
      return fetchUserInfo();
    },
    {
      manual: true,
      onSuccess: (res) => {
        setInitialState((s) => ({
          ...s,
          currentUser: res,
        }));
      },
    },
  );

  const [isread, setisread] = useState(0);
  const [count, setcount] = useState({
    noread: 0,
    readed: 0,
  });

  const messagelist = useRequest(
    async () => {
      let res = await getFetch({
        url: '/webtool/v1/notice',
        params: { isread },
      });
      return res?.data ?? [];
    },
    {
      debounceWait: 300,
      refreshDeps: [drawer?.open, isread],
      onSuccess: (res) => {
        if (!res) return;
        if (isread === 0) {
          setdot(res?.length > 0);
          setcount((s) => ({
            ...s,
            noread: res?.length,
          }));
        } else {
          setcount((s) => ({
            ...s,
            readed: res?.length,
          }));
        }
      },
    },
  );

  const weather = useRequest(
    async () => {
      const url = new URL('https://restapi.amap.com/v3/ip');
      url.search = new URLSearchParams(gaodekey).toString();
      let ip = await fetch(url);
      ip = await ip.json();
      setips(ip); //设置ip
      const params = { ...gaodekey, city: ip.adcode, extensions: 'base' };
      const urls = new URL('https://restapi.amap.com/v3/weather/weatherInfo');
      urls.search = new URLSearchParams(params).toString();

      let wea = await fetch(urls);
      wea = await wea.json();
      return {
        ...ip,
        ...(wea?.lives?.[0] ?? {}),
      };
    },
    {
      debounceWait: 300,
    },
  );

  const tomorrow = useRequest(
    async () => {
      if (!ips?.adcode) {
        return {};
      }
      const params = { ...gaodekey, city: ips.adcode, extensions: 'all' };
      const urls = new URL('https://restapi.amap.com/v3/weather/weatherInfo');
      urls.search = new URLSearchParams(params).toString();

      let wea = await fetch(urls);
      wea = await wea.json();
      let casts = wea?.forecasts?.[0]?.casts ?? {};
      let tomorrowres =
        casts?.filter((it) => it.date === dayjs().add(1, 'day').format('YYYY-MM-DD'))?.[0] ?? {};

      return {
        ...tomorrowres,
      };
    },
    {
      debounceWait: 300,
      refreshDeps: [ips?.adcode],
    },
  );

  const tasklist = useRequest(
    async () => {
      if (!search || search === '') {
        return [];
      }
      let res = await getFetch({
        url: '/webtool/v1/item',
        params: { search },
      });
      return res?.data ?? [];
    },
    {
      debounceWait: 800,
      refreshDeps: [search],
    },
  );

  useEffect(() => {
    socket.connect();
    socket.on('message', (data) => {
      let div = document.createElement('div');
      div.innerHTML = data?.reply ?? '';
      const strings =
        div.innerText.length > 25 ? `${div.innerText.substring(0, 25)}...` : div.innerText;

      notification.info({
        message: (
          <div className="spread">
            <b>{data?.title}</b>
          </div>
        ),
        duration: 0,
        description: (
          <span>
            发送人:
            {data?.otherinfo?.user_name}
            &nbsp;&nbsp;任务：
            <b
              style={{ color: 'rgb(24, 144, 255)', cursor: 'pointer' }}
              onClick={async () => {
                if (location.hash?.indexOf(`/welcome/project/${data?.project_id}`) === -1) {
                  history.push(`/welcome/project/${data?.project_id}`);
                }
                setInitialState((s) => ({
                  ...s,
                  curitem: data,
                }));
                notification?.destroy();
                //转为已读
                let res = await doFetch({
                  url: `/webtool/v1/notice/${data?.id}`,
                  params: { isread: true },
                  method: 'PUT',
                });
                if (res?.code === 0) {
                  messagelist?.refresh();
                }
              }}
            >
              {data?.mission_name}
            </b>
            {data?.deadline && (
              <span style={{ paddingLeft: 8 }}>
                于
                <b style={{ color: '#ff4800', paddingLeft: 8 }}>
                  {dayjs(data?.deadline).format('MM-DD')}
                </b>
                前截止
              </span>
            )}
            {data?.reply && (
              <span style={{ paddingLeft: 8 }}>
                回复
                <b style={{ color: '#000000', paddingLeft: 8 }}>{strings}</b>
              </span>
            )}
          </span>
        ),
        placement: 'bottomRight',
      });
      messagelist?.refresh();
    });

    socket.on('onlineUsers', (data) => {
      setInitialState((s) => {
        const a = data,
          b = s.activeUserIdList;
        if (a.length === b.length && a.sort().toString() === b.sort().toString())
          return {
            ...s,
          };
        else
          return {
            ...s,
            activeUserIdList: data,
          };
      });
    });

    return () => {
      // 关闭 WebSocket 连接
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setdom(null);
  }, [pathname]);

  const stylefit = useMemo(() => {
    if (!screens?.md) {
      return {
        size: {
          width: 30,
          height: 30,
        },
      };
    } else {
      return {
        size: {
          width: 40,
          height: 40,
        },
      };
    }
  }, [screens?.md]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          sizeUnit: 3,
        },
      }}
      locale={zhCN}
    >
      <div className={styles.homepage}>
        <DragModal
          {...modal}
          onCancel={() => {
            setmodal((s) => ({
              ...s,
              open: false,
            }));
          }}
        >
          {modal?.title === '创建组织' && (
            <Add
              refresh={() => {
                run();
                setmodal((s) => ({
                  ...s,
                  open: false,
                }));
              }}
            />
          )}
          {modal?.title === '加入组织' && (
            <Join
              refresh={() => {
                run();
                setmodal((s) => ({
                  ...s,
                  open: false,
                }));
              }}
            />
          )}
          {modal?.title === '修改密码' && (
            <Pwd
              currentUser={currentUser}
              refresh={() => {
                run();
                setmodal((s) => ({
                  ...s,
                  open: false,
                }));
              }}
            />
          )}
        </DragModal>

        <Drawer
          {...drawer}
          maskStyle={{
            backgroundColor: 'transparent',
          }}
          onClose={() => {
            setdrawer((s) => ({
              ...s,
              open: false,
            }));
            setsearch(null);
          }}
          extra={
            <>
              <Segmented
                value={isread}
                style={{
                  display: drawer?.title === '消息中心' ? 'block' : 'none',
                }}
                onChange={(val) => {
                  setisread(val);
                }}
                options={[
                  {
                    label: (
                      <span className="center">
                        未读
                        {count?.noread !== 0 && (
                          <b
                            className="badge"
                            style={{
                              transform: isread === 0 ? 'scale(1)' : 'scale(0)',
                              padding: isread === 0 ? '0 6px' : '0px',
                              marginLeft: isread === 0 ? '6px' : '-6px',
                              transition: 'all 0.4s',
                              transitionDelay: '0.2s',
                            }}
                          >
                            {count?.noread}
                          </b>
                        )}
                      </span>
                    ),
                    value: 0,
                  },
                  {
                    label: (
                      <span className="center">
                        已读
                        {count?.readed !== 0 && (
                          <b
                            className="badge"
                            style={{
                              transform: isread === 1 ? 'scale(1)' : 'scale(0)',
                              padding: isread === 1 ? '0 6px' : '0px',
                              marginLeft: isread === 1 ? '6px' : '-10px',
                              transition: 'all 0.4s',
                              transitionDelay: '0.2s',
                            }}
                          >
                            {count?.readed}
                          </b>
                        )}
                      </span>
                    ),
                    value: 1,
                  },
                ]}
              />
              <div
                className="sort center"
                style={{
                  backgroundColor: '#ddd',
                  width: 38,
                  height: 38,
                  marginLeft: 12,
                  fontSize: 12,
                  display: drawer?.title !== '消息中心' ? 'flex' : 'none',
                }}
                onClick={() => {
                  setdrawer((s) => ({
                    ...s,
                    open: false,
                  }));
                  setsearch(null);
                }}
              >
                esc
              </div>
            </>
          }
          destroyOnClose={drawer?.title !== 'ChatGPT'}
          width={'100%'}
          contentWrapperStyle={{ maxWidth: 1280 }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            {drawer?.title === 'ChatGPT' && (
              <iframe
                src="https://chat.aidutu.cn/ " //https://chatbot.theb.ai/
                style={{
                  width: '100%',
                  border: 'none',
                  height: '100%',
                  margin: 0,
                  padding: 0,
                }}
              />
            )}

            {drawer?.title === '消息中心' && (
              <List
                loading={messagelist?.loading}
                itemLayout="horizontal"
                dataSource={messagelist?.data}
                renderItem={(item) => {
                  let div = document.createElement('div');
                  div.innerHTML = item?.reply;
                  const strings =
                    div.innerText.length > 25
                      ? `${div.innerText.substring(0, 25)}...`
                      : div.innerText;
                  return (
                    <List.Item
                      actions={[
                        <span style={{ fontSize: 12 }}>
                          {difftime(dayjs(), dayjs(item.created_at))}
                        </span>,
                      ]}
                      onClick={async () => {
                        if (location.hash?.indexOf(`/welcome/project/${item?.project_id}`) === -1) {
                          history.push(`/welcome/project/${item?.project_id}`);
                        }
                        await setInitialState((s) => ({
                          ...s,
                          curitem: item,
                        }));
                        await setdrawer((s) => ({
                          ...s,
                          open: false,
                        }));
                        //转为已读
                        let res = await doFetch({
                          url: `/webtool/v1/notice/${item?.id}`,
                          params: { isread: true },
                          method: 'PUT',
                        });
                        if (res?.code === 0) {
                          messagelist?.refresh();
                        }
                      }}
                    >
                      <Skeleton avatar title={false} loading={item.loading} active>
                        <List.Item.Meta
                          avatar={
                            <Tooltip title={item?.other_user?.user_name}>
                              <Badge dot={isread === 0}>
                                <Avatar src={item?.other_user?.head_url || null}>
                                  {item?.other_user?.head_url ||
                                    item?.other_user?.user_name.charAt(0)}
                                </Avatar>
                              </Badge>
                            </Tooltip>
                          }
                          title={
                            item.title === '你有新的任务' ? (
                              <b style={{ color: '#008E59' }}>任务:{item.mission_name}</b>
                            ) : item.title === '你有新的回复' ? (
                              <b style={{ color: '#22A2C3' }}>回复:{item.mission_name}</b>
                            ) : null
                          }
                        />
                        <div>
                          {strings ||
                            (item?.deadline && (
                              <span style={{ paddingLeft: 8 }}>
                                <a>{dayjs(item?.deadline).format('YYYY年MM月DD日')}</a>
                                前截止
                              </span>
                            ))}
                        </div>
                      </Skeleton>
                    </List.Item>
                  );
                }}
              />
            )}

            {drawer?.title !== '消息中心' && drawer?.title !== 'ChatGPT' && (
              <List
                loading={tasklist?.loading}
                itemLayout="vertical"
                dataSource={tasklist?.data}
                renderItem={(item) => {
                  return (
                    <List.Item
                      style={{ cursor: 'pointer' }}
                      extra={[
                        <span style={{ fontSize: 12 }}>
                          {difftime(dayjs(), dayjs(item.created_at))}
                        </span>,
                      ]}
                      onClick={async () => {
                        if (location.hash?.indexOf(`/welcome/project/${item?.project_id}`) === -1) {
                          history.push(`/welcome/project/${item?.project_id}`);
                        }
                        await setInitialState((s) => ({
                          ...s,
                          curitem: { ...item, item_id: item?.id },
                        }));
                        await setdrawer((s) => ({
                          ...s,
                          open: false,
                        }));
                        setsearch(null);
                      }}
                    >
                      <Skeleton avatar title={false} loading={item.loading} active>
                        <List.Item.Meta
                          style={{ marginTop: 10, cursor: 'pointer' }}
                          avatar={
                            <Tooltip title={item?.user?.user_name}>
                              <Avatar src={item?.user?.head_url || null}>
                                {item?.user?.head_url || item?.user?.user_name.charAt(0)}
                              </Avatar>
                            </Tooltip>
                          }
                          title={
                            <div className="centerl" style={{ alignItems: 'baseline' }}>
                              <Highlighter keyword={search}>{item.mission_name}</Highlighter>
                              {item.step_id > 9999999 ? (
                                <b style={{ fontSize: 12, color: 'lightseagreen' }}>_任务池</b>
                              ) : (
                                ''
                              )}
                            </div>
                          }
                          description={
                            item?.deadline && (
                              <span style={{ fontSize: 12 }}>
                                <b>{dayjs(item?.deadline).format('YYYY年MM月DD日')}</b>
                                前截止
                              </span>
                            )
                          }
                        />
                        <Highlighter>{item.remark}</Highlighter>
                      </Skeleton>
                    </List.Item>
                  );
                }}
              />
            )}
          </div>
        </Drawer>

        <Row className={styles.header} id="head">
          <Col {...col} className="centerl" style={{ flex: 1, alignItems: 'flex-end' }}>
            {pathname === '/welcome/homepage' ? (
              <>
                <Header currentUser={currentUser} run={run}></Header>
                <div className="columns" style={{ paddingLeft: 12 }}>
                  <Paragraph
                    className="no-outline"
                    style={{
                      color: '#000000',
                      fontWeight: 'bolder',
                      fontSize: 15,
                      paddingBottom: 4,
                    }}
                    editable={{
                      onChange: async (value) => {
                        if (!value) {
                          message.warning('用户名不可为空');
                          return;
                        }
                        let res = await doFetch({
                          url: '/webtool/v1/user/' + currentUser?.id,
                          params: {
                            user_name: value,
                          },
                          method: 'PUT',
                        });
                        if (res.code === 0) {
                          run();
                        }
                      },
                    }}
                  >
                    {currentUser?.user_name}
                  </Paragraph>
                  {currentUser?.org_id && (
                    <div
                      style={{
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'baseline',
                        marginRight: 20,
                      }}
                    >
                      <div style={{ flex: 1 }} className="oneline">
                        {currentUser?.org_name}
                      </div>
                      <Paragraph
                        copyable={{
                          text: currentUser?.org_join_key,
                          icon: <a>组织代码</a>,
                          tooltips: '复制组织代码',
                        }}
                        style={{ margin: 0, fontSize: 12 }}
                      ></Paragraph>
                      <Popconfirm
                        title={`是否退出?`}
                        placement="bottomRight"
                        description="退出后将无法查看当前组织的小组"
                        onConfirm={() => {
                          doFetch({
                            url: `/webtool/v1/user/${currentUser?.id}`,
                            params: { org_id: null },
                            method: 'PUT',
                          }).then((res) => {
                            if (res?.code === 0) {
                              message.success('退出成功');
                              history.push('/welcome/homepage');
                              run();
                            }
                          });
                        }}
                      >
                        <a style={{ paddingLeft: 6, color: '#ff4800', cursor: 'pointer' }}>
                          退出组织
                        </a>
                      </Popconfirm>
                    </div>
                  )}
                </div>
                {['吴昊'].includes(currentUser?.user_name) && (
                  <div
                    onClick={() => {
                      history.push('/dashboard');
                    }}
                    className="sorts"
                    style={{ width: 40, height: 40, fontSize: 16 }}
                  >
                    <DesktopOutlined />
                  </div>
                )}
              </>
            ) : (
              <div className="center">
                <div
                  className="sorts"
                  onClick={() => {
                    history.push('/welcome/homepage');
                  }}
                  style={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    marginRight: 8,
                  }}
                >
                  <img src="./logo.png" style={{ width: '100%' }} />
                </div>
                <Skeleton avatar paragraph={false} round active loading={!dom}>
                  {dom}
                </Skeleton>
              </div>
            )}
          </Col>
          <Col
            {...cols}
            className="spread"
            style={{
              gap: 12,
              width: '100%',
              maxWidth: 388,
              marginTop: !screens?.md ? 12 : 0,
              paddingTop: !screens?.md ? 8 : 0,
              borderTop: !screens?.md ? '1px solid #ddd' : 'none',
            }}
          >
            <div style={{ width: '360px' }}>
              <Weather
                weather={[
                  {
                    text: '现在',
                    value: weather?.data?.weather,
                  },
                  {
                    text: '明天',
                    value: tomorrow?.data?.dayweather,
                  },
                ]}
              />
            </div>

            <div className="center" style={{ flex: 1, gap: 12 }}>
              <div
                className="sorts"
                style={stylefit?.size}
                onClick={() => {
                  setdrawer((s) => ({
                    ...s,
                    open: true,
                    width: 1000,
                    title: (
                      <div className="spread">
                        <Input
                          placeholder="请输入关键词查找任务名称/任务内容 "
                          size="large"
                          prefix={<SearchOutlined style={{ color: '#000000', fontSize: 18 }} />}
                          defaultValue={search}
                          onChange={(e) => {
                            setsearch(e.target.value);
                          }}
                        />
                      </div>
                    ),
                  }));
                }}
              >
                <SearchOutlined style={{ color: '#000', fontSize: 18 }} />
              </div>
              <div
                className="sorts"
                style={stylefit?.size}
                onClick={() => {
                  //utools action
                  if (window.utools) {
                    Modal.confirm({
                      title: '免责声明',
                      content:
                        'chatgpt为作者为方便用户使用找到的网上的镜像，可能存在求打赏与收费的现象，该行为与本tasks平台无关，请谨慎充值。',
                      okText: '同意',
                      cancelText: '拒绝',
                      onOk: () => {
                        window.utools.ubrowser
                          .goto('https://chat.aidutu.cn/')
                          .run({ width: 980, height: 640 });
                      },
                    });
                  } else {
                    //brower action
                    setdrawer((s) => ({
                      ...s,
                      open: true,
                      width: 1000,
                      title: 'ChatGPT',
                    }));
                  }
                }}
              >
                <IconFont type="icon-a-chatgpt" style={{ color: 'rgb(0,0,0,1)', fontSize: 18 }} />
              </div>
              <Badge dot={dot}>
                <div
                  className="sorts"
                  style={stylefit?.size}
                  onClick={() => {
                    setdrawer((s) => ({
                      ...s,
                      open: true,
                      width: 600,
                      title: '消息中心',
                    }));
                  }}
                >
                  <MessageOutlined
                    style={{ color: dot ? '#ff4800' : 'rgb(24, 144, 255)', fontSize: 16 }}
                  />
                </div>
              </Badge>
              <Dropdown
                menu={{
                  items,
                  onClick: ({ item, key, keyPath, domEvent }) => {
                    switch (key) {
                      case '1':
                        setmodal((s) => ({
                          ...s,
                          open: true,
                          title: '创建组织',
                        }));
                        break;
                      case '2':
                        setmodal((s) => ({
                          ...s,
                          open: true,
                          title: '加入组织',
                        }));
                        break;
                      case '3':
                        setmodal((s) => ({
                          ...s,
                          open: true,
                          title: '修改密码',
                        }));
                        break;
                      case '4':
                        socket.disconnect();
                        doFetch({ url: '/webtool/logout', params: {} }).then((res) => {
                          localStorage.removeItem('TOKENES');
                          history.push('/user/login');
                        });
                        break;
                      default:
                        break;
                    }
                  },
                }}
                trigger="hover"
                getPopupContainer={() => document.getElementById('head')}
              >
                <div className="sorts" style={{ ...stylefit?.size, marginRight: 2 }}>
                  <SettingFilled style={{ fontSize: 18 }} />
                </div>
              </Dropdown>
            </div>
          </Col>
        </Row>
        <div style={{ flex: 1, overflow: 'visible', paddingBottom: 12 }}>
          <Scrollbars
            thumbMinSize={10}
            autoHide
            style={{
              width: '100%',
              height: '100%',
            }}
            hideTracksWhenNotNeeded
            ref={scrollRef}
          >
            <div style={{ padding: 12, paddingTop: 0 }}>
              <Outlet context={{ setdom }} />
            </div>
          </Scrollbars>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Welcome;

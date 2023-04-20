/* eslint-disable eqeqeq */
import IconFont from '@/components/IconFont';
import Limit from '@/components/Limit';
import Reply from '@/components/Reply';
import { doFetch, getFetch } from '@/utils/doFetch';
import {
  ApiOutlined,
  ArrowLeftOutlined,
  CaretRightOutlined,
  HomeFilled,
  MessageFilled,
  PlayCircleFilled,
  ShareAltOutlined,
} from '@ant-design/icons';
import { history, useModel, useSearchParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Avatar, Card, Collapse, Empty, Grid, message, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

const panelStyle = {
  marginBottom: 12,
  background: '#f0f0f0',
  borderRadius: 8,
  border: 'none',
};

const itemz = {
  0: {
    value: '0',
    statusName: '未开始',
    icon: (
      <Tooltip title="点击开始">
        <PlayCircleFilled style={{ color: '#1890ff' }} />
      </Tooltip>
    ),
  },
  1: {
    value: '1',
    statusName: '进行中',
    color: 'green',
    icon: (
      <Tooltip title="点击完成">
        <IconFont type="icon-jinhangzhong-shijian-daojishi-03" style={{ color: 'green' }} />
      </Tooltip>
    ),
  },
  2: {
    value: '2',
    statusName: '已完成',
    color: 'grey',
    icon: (
      <Tooltip title="已完成">
        <IconFont type="icon-yiwancheng" style={{ color: 'grey' }} />
      </Tooltip>
    ),
  },
  3: {
    value: '3',
    statusName: '挂起',
    color: 'grey',
    icon: (
      <Tooltip title="挂起">
        <ApiOutlined />
      </Tooltip>
    ),
  },
};

function getUserInfo(userList, id) {
  return userList?.filter((it) => it.id === id)[0];
}

function Share() {
  const screens = useBreakpoint();

  const {
    initialState: { currentUser },
    setInitialState,
  } = useModel('@@initialState');
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeKey, setactiveKey] = useState([]);
  const project_id = searchParams.get('project_id');
  const item_id = searchParams.get('item_id');

  const [drawer, setdrawer] = useState({
    mask: false,
    width: !screens?.md ? '100vw' : '70vw',
  });

  useEffect(() => {
    setdrawer((s) => ({
      ...s,
      width: !screens?.md ? '100vw' : '70vw',
      bp: !screens.md,
    }));
  }, [screens.md]);

  const project = useRequest(
    async () => {
      let res = await getFetch({
        url: '/webtool/v1/project/' + project_id,
        params: { status: -1, mine: true },
      });
      return res?.data;
    },
    {
      refreshDeps: [project_id],
      onSuccess: (res) => {
        let actives = res?.steps?.map?.((it) => it?.id) ?? [];
        setactiveKey(actives);
      },
    },
  );

  const userList = useMemo(
    () => project?.data?.user_info_list ?? [],
    [project?.data?.user_info_list],
  );

  const curitem = useRequest(
    async () => {
      let res = await getFetch({
        url: '/webtool/v1/item/' + item_id,
        params: {},
      });
      return res?.data;
    },
    {
      refreshDeps: [item_id],
    },
  );

  const item = useMemo(() => curitem?.data, [curitem?.data]);

  useEffect(() => {
    setdrawer((s) => ({
      ...s,
      ...item,
      open: true,
      title: `任务:${item?.mission_name}`,
      content: item?.remark,
      deadline: item?.deadline,
      userid: item?.userid,
      id: item?.id,
      tags: item?.tags,
      other: item?.other ? JSON.parse(item?.other) : [],
      val: 'reply',
      userInfo: getUserInfo(userList, item?.userid),
    }));
    setInitialState((s) => ({
      ...s,
      curitem: {},
    }));
  }, [item, userList]);

  const Header = ({ userList, id, noname, click, size }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Tooltip title={getUserInfo(userList, id)?.user_name}>
          {getUserInfo(userList, id)?.head_url && getUserInfo(userList, id)?.head_url !== '' ? (
            <Avatar
              onClick={(e) => {
                e.stopPropagation();
                noname && click();
              }}
              size={size ?? 'large'}
              src={getUserInfo(userList, id)?.head_url}
            ></Avatar>
          ) : (
            <Avatar
              onClick={(e) => {
                e.stopPropagation();
                noname && click();
              }}
              size={size ?? 'large'}
              style={
                !getUserInfo(userList, id)?.user_name?.charAt(0)
                  ? { backgroundColor: '#fde3cf', color: '#f56a00' }
                  : {}
              }
            >
              {getUserInfo(userList, id)?.user_name?.charAt(0) ?? '无'}
            </Avatar>
          )}
        </Tooltip>
        {!noname && <b>{getUserInfo(userList, id)?.user_name}</b>}
      </div>
    );
  };

  const ActionBar = ({ item, content }) => (
    <div style={content ? { width: 80, flexShrink: 0 } : { flex: 1 }}>
      <div
        className="spread"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div>
          <b style={{ color: itemz[item?.status]?.color, paddingRight: 8 }}>
            {itemz[item?.status]?.statusName}
          </b>
          {content ? null : item.deadline ? (
            <Tooltip title={dayjs(item.deadline).format('YYYY-MM-DD')}>
              <span style={{ fontSize: 12 }}>
                {dayjs(item.deadline).endOf('day').diff(dayjs(), 'day') > 0 ? (
                  `剩余${dayjs(item.deadline).endOf('day').diff(dayjs(), 'day')}天`
                ) : dayjs(item.deadline).endOf('day').diff(dayjs(), 'hour') < 24 &&
                  dayjs(item.deadline).endOf('day').diff(dayjs(), 'hour') > 0 ? (
                  `剩余${dayjs(item.deadline).endOf('day').diff(dayjs(), 'hour')}小时`
                ) : (
                  <span style={{ color: item?.status === '2' ? 'green' : 'red' }}>
                    {item?.status === '2' ? '已完成' : '超时'}
                    {dayjs().diff(dayjs(item.deadline).endOf('day'), 'hour') < 24
                      ? `${dayjs().diff(dayjs(item.deadline).endOf('day'), 'hour')}小时`
                      : `${dayjs().diff(dayjs(item.deadline).endOf('day'), 'day')}天`}
                  </span>
                )}
              </span>
            </Tooltip>
          ) : (
            <span style={{ fontSize: 12 }}>-</span>
          )}
        </div>
        <div className="center">
          {content ? null : (
            <div
              className="sorts"
              style={{
                width: 24,
                height: 24,
                backgroundColor: '#f0f0f0',
                marginRight: 6,
              }}
              onClick={async () => {
                const text = `${location?.origin}#/share/${item?.project_id}?project_id=${item?.project_id}&item_id=${item?.id}`;
                try {
                  await navigator.clipboard.writeText(text);
                  message.success('复制成功！');
                } catch (err) {
                  console.error('复制到剪贴板失败:', err);
                  const textarea = document.createElement('textarea');
                  textarea.value = text;
                  document.body.appendChild(textarea);
                  textarea.select();
                  document.execCommand('copy');
                  document.body.removeChild(textarea);
                  message.success('复制成功！');
                }
              }}
            >
              <Tooltip title="链接分享">
                <ShareAltOutlined style={{ color: '#2e7d32' }} />
              </Tooltip>
            </div>
          )}
          <div
            className="sorts"
            style={{
              width: 24,
              height: 24,
              backgroundColor:
                currentUser?.id !== item.userid || project?.loading
                  ? '#dddddd'
                  : !content
                  ? '#f0f0f0'
                  : 'white',
              cursor:
                currentUser?.id !== item.userid || project?.loading ? 'not-allowed' : 'pointer',
              boxShadow: content ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
            }}
            onClick={async () => {
              if (
                item.status === '2' ||
                item.status === '3' ||
                currentUser?.id !== item.userid ||
                project?.loading
              )
                return;
              let res;
              if (item.status === '0') {
                res = await doFetch({
                  url: '/webtool/v1/item/' + item.id,
                  params: { status: '1' },
                  method: 'PUT',
                });
              } else if (item.status === '1') {
                res = await doFetch({
                  url: '/webtool/v1/item/' + item.id,
                  params: { status: '2' },
                  method: 'PUT',
                });
              }
              project?.refresh();
              curitem?.refresh();
            }}
          >
            {itemz[item?.status]?.icon}
          </div>
        </div>
      </div>
    </div>
  );

  const Content = () => {
    return (
      <div style={{ marginTop: 0 }}>
        <div className="spread">
          <Header size="small" userList={userList} id={drawer?.userid}></Header>
        </div>
        <div className="center" style={{ justifyContent: 'flex-start', margin: '16px 0 0px 0' }}>
          {drawer?.tags?.map((it) => {
            const isLongTag = it?.tag_name?.length > 20;
            return (
              <Tag
                key={it?.id}
                style={{
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
                color={it?.color}
              >
                <div></div>
                <span>{isLongTag ? `${it?.tag_name?.slice(0, 20)}...` : it.tag_name}</span>
              </Tag>
            );
          })}
        </div>

        {drawer?.content ? (
          <Limit content={drawer?.content}></Limit>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={false}
            style={{ marginTop: 12, marginBottom: 24 }}
          ></Empty>
        )}
        <span>
          <b>附件：</b>
          {drawer?.other?.map?.((it, i) => (
            <a
              download={it?.url}
              style={{ marginInlineEnd: 12, display: 'inline-block' }}
              target={'_blank'}
              href={it?.url}
              key={i}
              rel="noreferrer"
            >
              {it?.fileName}
            </a>
          ))}
        </span>

        <div
          className="center"
          style={{
            justifyContent: 'space-between',
            borderTop: '1px solid #f0f0f0',
            paddingTop: 12,
            marginTop: 24,
          }}
        >
          <div style={{ flex: 1 }}>
            截止日期：{drawer?.deadline ? dayjs(drawer?.deadline).format('YYYY-MM-DD') : '未设置'}
          </div>
          <ActionBar item={drawer} content={true}></ActionBar>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          width: '30vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: 12 }}>
          <div style={{ margin: 0 }} className="spread">
            <div
              style={{ fontSize: 16, width: 160, cursor: 'pointer' }}
              onClick={() => {
                history.push('/welcome/homepage');
              }}
            >
              <HomeFilled style={{ color: '#1890ff' }} />
              <b style={{ fontSize: 16 }}>&nbsp; 首页</b>
            </div>
            <span className="oneline">
              当前项目{' '}
              <Tooltip title={project?.data?.project_name}>
                <a
                  style={{ color: '#1890ff', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => {
                    history.push('/welcome/project/' + project_id);
                  }}
                >
                  {project?.data?.project_name}
                </a>{' '}
              </Tooltip>
            </span>
          </div>
          <div className="spread" style={{ margin: 0, marginTop: 12 }}>
            <span style={{ fontSize: 14 }}>我的任务</span>
            <span style={{ fontSize: 14 }}>
              共
              {project?.data?.steps?.reduce((prev, cur) => {
                return prev + cur?.items?.length;
              }, 0)}
              个
            </span>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Scrollbars
            thumbMinSize={10}
            autoHide
            style={{
              width: '100%',
              height: '100%',
            }}
            hideTracksWhenNotNeeded
          >
            <div style={{ padding: '0 8px' }}>
              <Collapse
                bordered={false}
                activeKey={activeKey}
                onChange={setactiveKey}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              >
                {project?.data?.steps?.map?.((items, index) => {
                  if (items?.items?.length === 0 || !items?.items) {
                    return null; ///修改
                  }
                  return (
                    <Panel
                      header={items?.name}
                      key={items?.id}
                      style={panelStyle}
                      extra={
                        <span
                          style={{
                            fontSize: 12,
                            color: '#666',
                            display: items?.items?.length === 0 ? 'none' : 'inline-block',
                            paddingRight: 4,
                            paddingTop: 2,
                          }}
                        >
                          共 <b style={{ fontSize: 16, color: '#000' }}>{items?.items?.length}</b>{' '}
                          个
                        </span>
                      }
                    >
                      {items?.items?.map((item, i) => {
                        return (
                          <div
                            key={item?.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setSearchParams({ project_id, item_id: item?.id });
                            }}
                          >
                            <Card
                              key={item?.id + 'downs'}
                              style={{
                                marginBottom: 6,
                                backgroundColor:
                                  item_id == item?.id ? 'rgba(190, 214, 235, 0.5)' : '#f9f9f9',
                              }}
                              size="small"
                            >
                              <div className="centerl">
                                <span className="oneline">{item.mission_name}</span>
                              </div>
                              <div
                                className="center"
                                style={{ justifyContent: 'flex-start', margin: '4px 0 8px 0' }}
                              >
                                {item?.tags?.map((it) => {
                                  const isLongTag = it?.tag_name?.length > 10;
                                  return (
                                    <Tag
                                      key={it?.id}
                                      style={{
                                        userSelect: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                      color={it?.color}
                                    >
                                      <div></div>
                                      <span style={{ fontSize: 10 }}>
                                        {isLongTag ? `${it?.tag_name?.slice(0, 10)}` : it.tag_name}
                                      </span>
                                    </Tag>
                                  );
                                })}
                              </div>
                              <ActionBar item={item} />
                            </Card>
                          </div>
                        );
                      })}
                    </Panel>
                  );
                })}

                {project?.data?.steps?.some((it) => it?.items?.length > 0) ? null : (
                  <div className="center" style={{ marginTop: 0, height: 120 }}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 12 }}></Empty>
                  </div>
                )}
              </Collapse>
            </div>
          </Scrollbars>
        </div>
      </div>

      <Reply
        full={true}
        drawer={{
          ...drawer,
          closeIcon: <ArrowLeftOutlined />,
          onClose: () => {
            history.go(-1);
          },
        }}
        userList={userList}
        extra={(setdoreply) => [
          <div
            key="reply"
            className="sorts"
            style={{ height: 33, width: 33 }}
            onClick={() => {
              setdoreply(getUserInfo(userList, drawer?.userid));
            }}
          >
            <MessageFilled style={{ color: 'rgb(24, 144, 255)' }}></MessageFilled>
          </div>,
        ]}
      >
        <Content></Content>
      </Reply>
    </div>
  );
}

export default Share;

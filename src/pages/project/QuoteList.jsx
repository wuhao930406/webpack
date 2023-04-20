/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-duplicate-props */
import IconFont from '@/components/IconFont';
import Limit from '@/components/Limit';
import Reply from '@/components/Reply';
import { doFetch, getFetch } from '@/utils/doFetch';
import {
  ApiOutlined,
  CloseOutlined,
  EditFilled,
  EllipsisOutlined,
  MessageFilled,
  PlayCircleFilled,
  ShareAltOutlined,
} from '@ant-design/icons';
import { history, useModel, useOutletContext } from '@umijs/max';
import { Avatar, Empty, message, Modal, Popconfirm, Select, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { memo, useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styles from './index.less';

const items = {
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

const QuoteList = ({ listId, datas, edit, userList, refresh, type }) => {
  const { setdom } = useOutletContext();
  const {
    initialState: { currentUser, curitem, activeUserIdList },
    setInitialState,
  } = useModel('@@initialState');
  const [loading, setloading] = useState(false);
  const [drawer, setdrawer] = useState({
    open: false,
    onClose: () => {
      setInitialState((s) => ({
        ...s,
        curitem: null,
      }));
      setdrawer((s) => ({
        ...s,
        open: false,
      }));
    },
  });

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
              style={{
                filter:
                  activeUserIdList.indexOf(id.toString()) !== -1 || currentUser?.id == id
                    ? 'grayscale(0%)'
                    : 'grayscale(100%)',
              }}
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
                  : {
                      filter:
                        activeUserIdList.indexOf(id.toString()) !== -1 || currentUser?.id == id
                          ? 'grayscale(0%)'
                          : 'grayscale(100%)',
                    }
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

  //点击消息内容自动打开详情
  useEffect(() => {
    const { project_id, item_id } = curitem ?? {};
    if (item_id) {
      const selecteditem = datas?.filter?.((it) => it?.id == item_id)?.[0] || null;
      if (!selecteditem) return;
      console.log('====================================');
      console.log(curitem);
      console.log('====================================');

      history.push(`/share/${project_id}?project_id=${project_id}&item_id=${item_id}`);
    }
  }, [curitem]);

  const ActionBar = ({ item, content }) => (
    <div style={content ? { width: 80, flexShrink: 0 } : { flex: 1 }}>
      <div
        className="spread"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div>
          <b style={{ color: items[item?.status]?.color, paddingRight: 8 }}>
            {items[item?.status]?.statusName}
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
              className="sort"
              style={{
                width: 24,
                height: 24,
                backgroundColor: 'white',
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
            className="sort"
            style={{
              width: 24,
              height: 24,
              backgroundColor: currentUser?.id !== item.userid || loading ? '#dddddd' : 'white',
              cursor: currentUser?.id !== item.userid || loading ? 'not-allowed' : 'pointer',
              boxShadow: content ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
            }}
            onClick={async () => {
              if (
                item.status === '2' ||
                item.status === '3' ||
                currentUser?.id !== item.userid ||
                loading
              )
                return;
              setloading(true);
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
              await refresh();
              if (content) {
                const detail = await getFetch({ url: '/webtool/v1/item/' + item.id });
                console.log(detail?.data);
                setdrawer((s) => ({
                  ...s,
                  ...detail?.data,
                }));
              }
              setTimeout(() => {
                setloading(false);
              }, 1000);
            }}
          >
            {items[item?.status]?.icon}
          </div>
        </div>
      </div>
    </div>
  );

  const Content = () => (
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

  return (
    <div>
      <Reply
        drawer={drawer}
        userList={userList}
        setdrawer={setdrawer}
        extra={(setdoreply) => [
          <div
            key="edit"
            className="sorts"
            style={{ height: 33, width: 33 }}
            onClick={async () => {
              await setdrawer((s) => ({
                ...s,
                open: false,
              }));
              edit?.({
                mission_name: drawer?.title,
                remark: drawer?.content,
                deadline: drawer?.deadline,
                userid: drawer?.userid,
                id: drawer?.id,
                tags: drawer?.tags?.map((it) => it?.id),
                other: drawer?.other ? drawer?.other : [],
              });
            }}
          >
            <EditFilled style={{ color: '#ff6800' }}></EditFilled>
          </div>,
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

      <Droppable droppableId={listId}>
        {(dropProvided, dropSnapshot) => (
          <div
            className={styles?.QuoteList}
            {...dropProvided.droppableProps}
            ref={dropProvided.innerRef}
          >
            {datas
              ?.sort((a, b) => a.sort - b.sort)
              .map((item, index) => (
                <Draggable key={item.id} draggableId={`item-${item.id}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={styles?.item}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => {
                        setdrawer((s) => ({
                          ...s,
                          ...item,
                          open: true,
                          title: item?.mission_name,
                          content: item?.remark,
                          deadline: item?.deadline,
                          userid: item?.userid,
                          id: item?.id,
                          tags: item?.tags,
                          other: item?.other ? JSON.parse(item?.other) : [],
                          val: 'reply',
                          userInfo: getUserInfo(userList, item?.userid),
                        }));
                      }}
                    >
                      <div
                        className={
                          snapshot?.isDragging || item?.id == curitem?.item_id
                            ? styles.bgs
                            : styles.bg
                        }
                      >
                        <div className="spread">
                          <b
                            style={{
                              fontSize: 15,
                              width: '100%',
                              wordBreak: 'break-all',
                              color: '#333',
                            }}
                          >
                            {item.mission_name}
                          </b>
                          {currentUser?.id === item.userid && (
                            <Popconfirm
                              title="是否删除该任务？"
                              placement="bottomRight"
                              onConfirm={(e) => {
                                e.stopPropagation();
                                setloading(true);
                                doFetch({
                                  url: `/webtool/v1/item/${item.id}`,
                                  params: {},
                                  method: 'DELETE',
                                }).then((res) => {
                                  refresh();
                                  setTimeout(() => {
                                    setloading(false);
                                  }, 1000);
                                });
                              }}
                              onCancel={(e) => {
                                e.stopPropagation();
                              }}
                              okButtonProps={{
                                loading: loading,
                              }}
                            >
                              <CloseOutlined
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                style={{ fontSize: 12 }}
                              />
                            </Popconfirm>
                          )}
                        </div>
                        <div
                          className="center"
                          style={{ justifyContent: 'flex-start', margin: '4px 0 8px 0' }}
                        >
                          {item?.tags
                            ?.filter((it, i) => i < 3)
                            .map((it) => {
                              const isLongTag = it?.tag_name?.length > 4;
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
                                    {isLongTag ? `${it?.tag_name?.slice(0, 4)}` : it.tag_name}
                                  </span>
                                </Tag>
                              );
                            })}
                          {item?.tags?.length > 3 && <EllipsisOutlined />}
                        </div>
                        <div className="spread" style={{ gap: 6 }}>
                          <Header
                            size={'small'}
                            userList={userList}
                            id={item?.userid}
                            noname={true}
                            click={() => {
                              Modal.confirm({
                                title: '修改执行人',
                                maskClosable: true,
                                content: (
                                  <div>
                                    <Select
                                      style={{ width: '100%' }}
                                      placeholder={'修改执行人'}
                                      options={userList?.map((it) => {
                                        return {
                                          label: it?.user_name,
                                          value: it?.id,
                                        };
                                      })}
                                      onChange={(value) => {
                                        doFetch({
                                          url: '/webtool/v1/item/' + item.id,
                                          params: { userid: value },
                                          method: 'PUT',
                                        }).then((res) => {
                                          Modal.destroyAll();
                                          refresh();
                                        });
                                      }}
                                    ></Select>
                                  </div>
                                ),
                                footer: false,
                              });
                            }}
                          ></Header>
                          <ActionBar item={item} />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            {datas?.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
            )}
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default memo(QuoteList, (prev, next) => {
  if (JSON.stringify(prev.datas) === JSON.stringify(next.datas)) {
    return true;
  }
  return false;
});

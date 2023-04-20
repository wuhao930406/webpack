/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-key */
/* eslint-disable eqeqeq */
import DragModal from '@/components/DragModal';
import { AddPro, CopyPro, Join } from '@/components/DragModal/formdoms';
import IconFont from '@/components/IconFont';
import { doFetch, getFetch } from '@/utils/doFetch';
import {
  ArrowUpOutlined,
  ClockCircleFilled,
  CopyOutlined,
  DeleteOutlined,
  PlayCircleFilled,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import {
  Avatar,
  Card,
  Col,
  Grid,
  Input,
  message,
  Popconfirm,
  Progress,
  Row,
  Segmented,
  Skeleton,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import './index.less';
const { useBreakpoint } = Grid;

let col = { xs: 24, sm: 24, md: 12, lg: 8, xl: 6, xxl: 4 };
let cold = { xs: 24, sm: 24, md: 12 },
  cols = { xs: 24, sm: 24, md: 12 };

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
  },
  itemc = {
    0: {
      value: '0',
      statusName: '已延期',
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
  };

function getRandomColor() {
  let r = Math.floor(Math.random() * (255 - 150 + 1) + 150);
  let g = Math.floor(Math.random() * (255 - 150 + 1) + 150);
  let b = Math.floor(Math.random() * (255 - 150 + 1) + 150);
  return `rgb(${r}, ${g}, ${b})`;
}

function ProCard({
  project_name,
  project_user_id,
  id,
  run,
  user_info_list,
  created_at,
  deadline,
  stastic,
  total,
  copyItem,
}) {
  const {
    initialState: { currentUser, activeUserIdList },
    setInitialState,
  } = useModel('@@initialState');

  return (
    <Col {...col} style={{ marginBottom: 12 }}>
      <Card
        title={
          <div className="centerl" style={{ flex: 1, overflow: 'hidden', marginRight: 12 }}>
            <span className="oneline">{project_name}</span>
            <div style={{ fontSize: 12 }}>
              {dayjs(deadline).endOf('day').diff(dayjs(), 'hour') > 0 ? (
                dayjs(deadline).endOf('day').diff(dayjs(), 'hour') > 24 ? (
                  <b style={{ paddingLeft: 8, color: 'rgba(115,155,6,1)' }}>
                    距截止{dayjs(deadline).endOf('day').diff(dayjs(), 'day')}天
                  </b>
                ) : (
                  <b style={{ paddingLeft: 8, color: 'rgb(178, 116, 0)' }}>
                    距截止{dayjs(deadline).endOf('day').diff(dayjs(), 'hour')}小时
                  </b>
                )
              ) : dayjs().diff(dayjs(deadline).endOf('day'), 'hour') > 24 ? (
                <b
                  style={{
                    paddingLeft: 8,
                    color:
                      stastic[stastic.length - 1].num?.length !== total || total === 0
                        ? '#d84c00'
                        : 'green',
                  }}
                >
                  {stastic[stastic.length - 1].num?.length !== total || total === 0
                    ? '超过截止'
                    : '已完成'}
                  {dayjs().diff(dayjs(deadline).endOf('day'), 'day')}天
                </b>
              ) : (
                <b
                  style={{
                    paddingLeft: 8,
                    color:
                      stastic[stastic.length - 1].num?.length !== total || total === 0
                        ? '#d84c00'
                        : 'green',
                  }}
                >
                  {stastic[stastic.length - 1].num?.length !== total || total === 0
                    ? '超过截止'
                    : '已完成'}
                  {dayjs().diff(dayjs(deadline).endOf('day'), 'hour')}小时
                </b>
              )}
            </div>
          </div>
        }
        style={{ backgroundColor: 'rgba(255,255,255,0.25)', height: '100%' }}
        hoverable
        className="hovercard"
        extra={[
          <div
            className="sort"
            style={{ border: '1px solid rgba(0,0,0,0.05)' }}
            onClick={(e) => {
              e.stopPropagation();
              copyItem?.();
            }}
          >
            <CopyOutlined style={{ color: '#1890ff' }} />
          </div>,
          currentUser?.id == project_user_id && (
            <span
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Popconfirm
                title="是否删除该小组？"
                placement="bottomRight"
                onConfirm={(e) => {
                  e.stopPropagation();
                  doFetch({ url: '/webtool/v1/project/' + id, params: {}, method: 'DELETE' }).then(
                    (res) => {
                      if (res.code === 0) {
                        message.success('删除成功');
                        run?.();
                      }
                    },
                  );
                }}
                onCancel={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  className="sort"
                  style={{ border: '1px solid rgba(0,0,0,0.05)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <DeleteOutlined style={{ color: '#ff4800' }} />
                </div>
              </Popconfirm>
            </span>
          ),
        ]}
        onClick={() => {
          history.push(`/welcome/project/${id}`);
        }}
      >
        <div style={{ marginTop: 0, marginBottom: 10 }}>
          <div className="center">
            <span>小组进度: </span>
            <Tooltip placement="bottomRight" title="已完成任务数/全部任务数">
              <Progress
                percent={
                  total
                    ? parseInt(((stastic[stastic.length - 1].num.length ?? 0) / total) * 100)
                    : 0
                }
                size="small"
                status="active"
                style={{ margin: 0, flex: 1, marginLeft: 8,marginRight:8 }}
                strokeColor="rgba(64, 144, 255, 0.8)"
              />
            </Tooltip>
          </div>
          <div
            className="center whitebg"
            style={{
              justifyContent: 'space-between',
              color: '#666666',
              marginTop: 6,
              fontSize: 12,
              gap: 8,
            }}
          >
            {stastic?.map((item, index) => {
              return (
                <span key={index} style={{ color: items[item.status].color }}>
                  <b>{item.statusName}</b>
                  <b>{item?.num?.length ?? 0}</b>
                </span>
              );
            })}
          </div>
          <div className="spread" style={{ margin: '12px 0 -8px 0' }}>
            <Avatar.Group maxCount={5}>
              {[
                ...user_info_list.filter((it) => it?.id === project_user_id),
                ...[
                  ...user_info_list.filter(
                    (it) =>
                      it?.id !== project_user_id && activeUserIdList.includes(it.id.toString()),
                  ),
                  ...user_info_list.filter(
                    (it) =>
                      it?.id !== project_user_id && !activeUserIdList.includes(it.id.toString()),
                  ),
                ],
              ]?.map((it, i) => {
                if (it?.head_url && it?.head_url !== '') {
                  return (
                    <Tooltip key={it?.id} title={(i === 0 ? '组长:' : '成员:') + it?.user_name}>
                      <Avatar
                        src={it?.head_url}
                        className={i === 0 ? 'borderani' : ''}
                        style={{
                          filter:
                            activeUserIdList.indexOf(it.id.toString()) !== -1 ||
                            currentUser?.id == it.id
                              ? 'grayscale(0%)'
                              : 'grayscale(100%)',
                        }}
                      />
                    </Tooltip>
                  );
                } else {
                  return (
                    <Tooltip key={it?.id} title={(i === 0 ? '组长:' : '成员:') + it?.user_name}>
                      <Avatar
                        className={i === 0 ? 'borderani' : ''}
                        style={{
                          filter:
                            activeUserIdList.indexOf(it.id.toString()) !== -1 ||
                            currentUser?.id == it.id
                              ? 'grayscale(0%)'
                              : 'grayscale(100%)',
                        }}
                      >
                        {it?.user_name?.charAt(0)}
                      </Avatar>
                    </Tooltip>
                  );
                }
              })}
            </Avatar.Group>
            <Tooltip title={dayjs(created_at).format('YYYY-MM-DD HH:mm')}>
              <div className="center" style={{ color: '#999999' }}>
                <ClockCircleFilled style={{ marginRight: 4 }} />
                {dayjs().diff(dayjs(created_at), 'hour') > 24
                  ? `${dayjs().diff(dayjs(created_at), 'day')}天前`
                  : dayjs().diff(dayjs(created_at), 'hour') < 1
                  ? `${dayjs().diff(dayjs(created_at), 'minute')}分钟前`
                  : `${dayjs().diff(dayjs(created_at), 'hour')}小时前`}
              </div>
            </Tooltip>
          </div>
        </div>
      </Card>
    </Col>
  );
}

function AddCard({ onClick }) {
  const screens = useBreakpoint();

  return (
    <Col {...col} style={{ marginBottom: 12 }}>
      <Card
        onClick={onClick}
        style={{
          backgroundColor: 'rgba(255,255,255,0.25)',
          color: 'rgb(24, 144, 255)',
          height: !screens?.md ? '48px' : '158px',
          paddingTop: 6,
        }}
        hoverable
        className="center"
      >
        <PlusOutlined />
        <span style={{ paddingLeft: 12 }}>新建小组</span>
      </Card>
    </Col>
  );
}

function Homepage(props) {
  const {
    initialState: { currentUser, activeUserIdList },
    setInitialState,
  } = useModel('@@initialState');
  const screens = useBreakpoint();

  const [modal, setmodal] = useState({
    open: false,
  });
  const { data, loading, run } = useRequest(
    async () => {
      let res = await getFetch({ url: '/webtool/v1/project' });
      return res?.data;
    },
    {
      debounceWait: 300,
      refreshDeps: [currentUser?.org_id],
    },
  );
  const [sort, setsort] = useState({
    time: true,
    type: '-1',
  });

  return (
    <div className="homepage">
      <Row
        className="bglight"
        style={{
          margin: '0px 0 12px 0',
          padding: 12,
          borderRadius: 12,
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}
      >
        <Col {...cold} className="centerl" style={{ gap: 12 }}>
          <Tooltip title={sort.time ? '紧急程度升序' : '紧急程度降序'} placement="topRight">
            <div
              className="sort"
              onClick={() => {
                setsort((s) => ({
                  ...s,
                  time: !s.time,
                }));
              }}
            >
              <ArrowUpOutlined rotate={sort.time ? 0 : 180} />
            </div>
          </Tooltip>
          <Tooltip title={'刷新'}>
            <div
              className="sort"
              onClick={() => {
                run();
              }}
            >
              <RedoOutlined />
            </div>
          </Tooltip>
          <div>
            <Segmented
              value={sort?.type}
              onChange={(val) => {
                setsort((s) => ({
                  ...s,
                  type: val,
                }));
              }}
              options={[
                {
                  label: '全部',
                  value: '-1',
                },
              ].concat(
                Object.values(itemc).map((it) => ({
                  label: it.statusName,
                  value: it.value,
                })),
              )}
            />
          </div>
        </Col>

        <Col
          {...cols}
          className="hoverables"
          style={{
            width: '100%',
            marginTop: !screens?.md ? 12 : 0,
          }}
        >
          <Input
            style={{ maxWidth: !screens?.md ? '400px' : '280px', }}
            prefix={<SearchOutlined />}
            placeholder="按照项目名称筛选"
            onChange={(e) => {
              setsort((s) => ({
                ...s,
                search: e.target.value,
              }));
            }}
          />
        </Col>
      </Row>

      <DragModal
        {...modal}
        onCancel={() => {
          setmodal((s) => ({
            ...s,
            open: false,
          }));
        }}
        style={{ top: 20 }}
        width={['新建小组', '复制小组'].includes(modal.title) ? 1000 : 800}
      >
        {modal?.title === '新建小组' && (
          <AddPro
            defaultid={currentUser?.id}
            refresh={() => {
              run();
              setmodal((s) => ({
                ...s,
                open: false,
              }));
            }}
          />
        )}
        {modal?.title === '复制小组' && (
          <CopyPro
            defaultid={currentUser?.id}
            initialValues={modal?.initialValues}
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
      </DragModal>

      <Skeleton active loading={loading}>
        <Row gutter={12} className="cards">
          <AddCard
            onClick={() => {
              setmodal((s) => ({
                ...s,
                open: true,
                title: '新建小组',
              }));
            }}
          />
          {data
            ?.sort((a, b) => {
              const aval = dayjs(a.deadline).valueOf() - dayjs().valueOf();
              const bval = dayjs(b.deadline).valueOf() - dayjs().valueOf();
              if (sort?.time) {
                return aval - bval;
              } else {
                return bval - aval;
              }
            })
            ?.filter((it) => {
              if (!sort?.search) {
                return true;
              }
              return it?.project_name?.indexOf(sort?.search) !== -1;
            })
            ?.filter((it) => {
              if (sort?.type == '-1') {
                return true;
              }
              if (sort?.type == '0') {
                return (
                  dayjs(it.deadline).valueOf() < dayjs().valueOf() &&
                  it.total != it.stastic[it.stastic.length - 1].num?.length &&
                  it.total != 0
                );
              }
              if (sort?.type == '1') {
                return (
                  (dayjs(it.deadline).valueOf() > dayjs().valueOf() &&
                    it.total > it.stastic[it.stastic.length - 1].num?.length) ||
                  it.total == 0
                );
              }
              if (sort?.type == '2') {
                return it.total == it.stastic[it.stastic.length - 1].num?.length && it.total != 0;
              }
            })
            ?.map?.((it, i) => {
              return (
                <ProCard
                  run={run}
                  {...it}
                  key={i}
                  currentUser={currentUser}
                  copyItem={() => {
                    setmodal((s) => ({
                      ...s,
                      open: true,
                      title: '复制小组',
                      initialValues: { ...it },
                    }));
                  }}
                />
              );
            })}
        </Row>
      </Skeleton>
    </div>
  );
}

export default Homepage;

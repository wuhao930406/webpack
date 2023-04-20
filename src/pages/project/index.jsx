/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
import {
  AddMission,
  AddSteps,
  AddTags,
  AddUsers,
  EditRemark,
} from '@/components/DragModal/formdoms';
import IconFont from '@/components/IconFont';
import Limit from '@/components/Limit';
import { doFetch, getFetch } from '@/utils/doFetch';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditFilled,
  ExportOutlined,
  PlayCircleFilled,
  PlusOutlined,
  RedoOutlined,
  RollbackOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { history, useModel, useOutletContext, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import {
  Avatar,
  Badge,
  Card,
  DatePicker,
  Divider,
  Drawer,
  Empty,
  Grid,
  List,
  Modal,
  Popconfirm,
  Popover,
  Segmented,
  Select,
  Skeleton,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { Gantt } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import './index.less';
import QuoteList from './QuoteList';
const colordiy = {
  barProgressColor: 'rgba(24, 144, 255,0.6)',
  barProgressSelectedColor: 'rgba(24, 144, 255,0.6)',
  barBackgroundColor: '#999',
  barBackgroundSelectedColor: '#999',
};

const { Paragraph } = Typography;
const { useBreakpoint } = Grid;

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
};

const columns = [];

function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

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

const MissionPools = ({ datalist = [], userList, setmodal, refresh }) => {
  const screens = useBreakpoint();

  const {
    initialState: { vs },
    setInitialState,
  } = useModel('@@initialState');

  const setvs = (val) => {
    setInitialState((s) => ({
      ...s,
      vs: val,
    }));
  };

  return (
    <div
      className="rightcontent"
      style={{
        width: vs ? 250 : 50,
        right: vs ? 12 : 0,
        overflow: 'visible',
        height: !screens?.md ? `calc(100vh - 210px)` : `calc(100vh - 150px)`,
        top: !screens?.md ? 192 : 132,
        backgroundColor: vs ? '#ffffff' : 'transparent',
      }}
      onClick={() => {
        setvs(true);
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {!vs && (
          <div className="hovers">
            <ArrowLeftOutlined />
          </div>
        )}
        {vs && (
          <Card
            key="collspan"
            style={{ width: '100%', margin: 0, height: '100%' }}
            title={
              <b style={{ fontSize: 14 }}>
                任务池{' '}
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                    setvs(false);
                  }}
                >
                  收起
                </a>
              </b>
            }
            bordered={vs}
            className="card"
            hoverable
            extra={[
              <div
                key="adder"
                className="sorts"
                onClick={() => {
                  setmodal((s) => ({
                    ...s,
                    open: true,
                    title: '任务池-新建任务',
                    width: '1000px',
                    step_id: null,
                    sort: datalist?.length ? Math.max(...datalist?.map((it) => it.sort + 1)) : 0,
                    defaultValue: {},
                  }));
                }}
              >
                <PlusOutlined style={{ color: 'rgb(24, 144, 255)' }} />
              </div>,
            ]}
          >
            <div className="scrollcontian">
              <Scrollbars
                thumbMinSize={10}
                autoHide
                style={{
                  width: '100%',
                  height: '100%',
                }}
                hideTracksWhenNotNeeded
              >
                <QuoteList
                  type="pool"
                  userList={userList ?? []}
                  refresh={() => {
                    refresh?.();
                  }}
                  edit={(defaultValue) => {
                    setmodal((s) => ({
                      ...s,
                      open: true,
                      title: '任务池-编辑任务',
                      width: '1000px',
                      step_id: null,
                      defaultValue: defaultValue,
                      sort: null,
                    }));
                  }}
                  datas={datalist ?? []}
                  listId={'mission_pool'}
                ></QuoteList>
              </Scrollbars>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const Project = () => {
  // const location = useLocation();
  // const id = location.state.id;
  const screens = useBreakpoint();

  const { setdom } = useOutletContext();
  const { id } = useParams();
  const [state, setState] = useState({
    columns,
    search: { status: '-1', mine: false, selectuser: null },
  });
  const [modal, setmodal] = useState({
    open: false,
  });
  const [drawer, setdrawer] = useState({
    open: false,
  });
  const [chooseusers, setchooseusers] = useState([]);
  const [ganttype, setganttype] = useState('project');

  //动态接口手动调用
  const messagelist = useRequest(
    async () => {
      const extra = chooseusers?.length !== 0 ? { chooseusers: chooseusers.toString() } : {};
      let res = await getFetch({
        url: '/webtool/v1/notice',
        params: { project_id: id, ...extra },
      });
      return res?.data ?? [];
    },
    {
      manual: true,
      debounceWait: 300,
    },
  );

  const [pooldata, setpooldata] = useState([]);

  const {
    initialState: { currentUser, activeUserIdList, curitem },
    setInitialState,
  } = useModel('@@initialState');

  const { data, loading, refresh } = useRequest(
    async () => {
      const res = await getFetch({
        url: '/webtool/v1/project/' + id,
        params: { ...state?.search, tags: state?.search?.tags?.join(',') },
      });
      return res?.data;
    },
    {
      debounceWait: 300,
      refreshDeps: [state.search, id, curitem],
      onSuccess: (data) => {
        const all =
          data?.steps
            ?.map?.((it) =>
              it.items?.map((its) => ({
                ...its,
                step: it,
              })),
            )
            ?.flat?.() ?? [];
        const allen = all?.length ?? 1;
        const doing = all?.filter?.((it) => it.status === '1')?.length ?? 0;
        const done = all?.filter?.((it) => it.status === '2')?.length ?? 0;
        const progress = !isNaN(((doing * 0.5 + done) * 100) / allen)
          ? parseInt(((doing * 0.5 + done) * 100) / allen)
          : 0;

        const projectline = {
          start: new Date(dayjs(data?.created_at).format('YYYY-MM-DD HH:mm')),
          end: new Date(dayjs(data?.deadline).format('YYYY-MM-DD HH:mm')),
          name: data?.project_name,
          id: data?.id + 'project',
          type: 'project',
          progress,
          styles: {
            progressColor: 'rgba(24, 144, 255,0.6)',
            progressSelectedColor: 'rgba(24, 144, 255,0.6)',
            backgroundColor: '#999999',
            backgroundSelectedColor: '#999999',
          },
          allen,
          doing,
          done,
          users: data?.user_info_list,
        };

        const defaultgantt = [
          projectline,
          ...data?.steps?.map((it) => {
            const allen = it?.items?.length ?? 1;
            const doing = it?.items?.filter?.((it) => it.status === '1')?.length ?? 0;
            const done = it?.items?.filter?.((it) => it.status === '2')?.length ?? 0;
            const progress = !isNaN(((doing * 0.5 + done) * 100) / allen)
              ? parseInt(((doing * 0.5 + done) * 100) / allen)
              : 0;
            let users = it?.items?.map((it) => it?.userid);
            users = data?.user_info_list?.filter((it) => users.includes(it?.id)) ?? [];

            const defaultdays = [
              new Date(),
              new Date(dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm')),
            ];
            let arr = it?.other?.split(',') ?? null;
            arr = arr
              ? arr?.map((it) => {
                  const y = dayjs(it).format('YYYY');
                  const m = dayjs(it).format('MM');
                  const d = dayjs(it).format('DD');
                  const s = dayjs(it).format('HH');
                  const f = dayjs(it).format('mm');
                  return new Date(y, m - 1, d, s, f);
                })
              : defaultdays;

            return {
              start: arr[0],
              end: arr[1],
              name: it?.name,
              id: it?.id + 'step',
              type: 'task',
              progress,
              allen,
              doing,
              done,
              users,
            };
          }),
        ];

        // editables
        const defaultganttp = [
          projectline,
          ...all?.map?.((it) => {
            //结束时间如果存在diy的则拿diy 否则拿阶段截止时间 阶段截止时间未设置 就设为明天
            const defaultdays = [
              new Date(),
              new Date(dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm')),
            ];
            let arr = it?.step?.other?.split(',') ?? null,
              users = data?.user_info_list?.filter((its) => its?.id === it?.userid) ?? [];
            arr = arr
              ? arr?.map((it) => {
                  const y = dayjs(it).format('YYYY');
                  const m = dayjs(it).format('MM');
                  const d = dayjs(it).format('DD');
                  const s = dayjs(it).format('HH');
                  const f = dayjs(it).format('mm');
                  return new Date(y, m - 1, d, s, f);
                })
              : defaultdays;

            const end = it?.deadline
              ? new Date(dayjs(it?.deadline).format('YYYY-MM-DD HH:mm'))
              : arr[1];
            const start = it?.starttime
              ? new Date(dayjs(it?.starttime).format('YYYY-MM-DD HH:mm'))
              : new Date(dayjs(it?.created_at).format('YYYY-MM-DD HH:mm'));

            return {
              start,
              end,
              name: it?.step?.name + ' -- ' + it?.mission_name,
              id: it?.id + 'mission',
              type: 'task',
              progress:
                it?.status === '0' ? 0 : it.status === '1' ? 50 : it.status === '2' ? 100 : 0,
              users,
              status: it?.status,
            };
          }),
        ];

        setState((s) => ({
          ...s,
          columns: data?.steps,
          gantt: defaultgantt,
          ganttp: defaultganttp,
          defaultgantt,
          defaultganttp,
        }));
      },
    },
  );

  const tags = useRequest(
    async () => {
      const res = await getFetch({ url: '/webtool/v1/tag', params: { project_id: parseInt(id) } });
      return res?.data;
    },
    {
      debounceWait: 300,
      refreshDeps: [id],
    },
  );

  const mission_pool = useRequest(
    async () => {
      const res = await getFetch({
        url: '/webtool/v1/item',
        params: { step_id: currentUser?.org_id + 9999999 },
      });
      return res?.data;
    },
    {
      debounceWait: 300,
      refreshDeps: [currentUser?.org_id],
      onSuccess: (res, params) => {
        setpooldata(res);
      },
    },
  );

  const onDragEnd = async (result) => {
    // the only one that is required
    const { destination, source, draggableId, combine } = result;

    if (result.type === 'COLUMN') {
      const submitarr = Object?.values?.(state?.columns);
      let resarr = swapArray(submitarr, source.index, destination.index);
      resarr = resarr.map((it, i) => ({
        ...it,
        sort: i,
      }));
      setState((s) => ({
        ...s,
        columns: resarr,
      }));
      resarr?.map((it, i) => {
        doFetch({
          url: '/webtool/v1/step/' + it?.id,
          params: {
            sort: i,
          },
          method: 'PUT',
        });
      });
      return;
    }

    if (!destination) {
      return;
    }
    if (destination.droppableId === 'mission_pool' && source.droppableId === 'mission_pool') {
      let newColumns = pooldata ? JSON.parse(JSON.stringify(pooldata)) : [];
      const moveItem = newColumns[source.index];
      newColumns = newColumns?.filter((it, i) => i !== source.index);
      newColumns.splice(destination.index, 0, { ...moveItem });
      setpooldata(
        newColumns?.map((it, i) => ({
          ...it,
          sort: i,
        })),
      );
      const sortlist = newColumns?.map((it, i) =>
        _.pick(
          {
            ...it,
          },
          ['id', 'step_id', 'status', 'project_id'],
        ),
      );
      doFetch({
        url: '/webtool/v1/mutisort',
        params: {
          sortlist,
        },
      });
      return;
    }

    if (destination.droppableId === 'mission_pool' && source.droppableId !== 'mission_pool') {
      const firstarrindex = state.columns
        ?.map((it) => it?.id?.toString())
        .indexOf(source.droppableId);
      let moveItem, donate;
      setState((s) => {
        let newColumns = JSON.parse(JSON.stringify(s.columns));
        newColumns = newColumns?.map((item, index) => {
          if (index === firstarrindex) {
            return {
              ...item,
              items: item.items.filter((it, i) => {
                if (i === source.index) {
                  moveItem = { ...it, status: '3', starttime: null }; //状态重置
                }
                return i !== source.index;
              }),
            };
          }
          return item;
        });
        return {
          ...s,
          columns: newColumns,
        };
      });

      setpooldata((s) => {
        const donates = JSON.parse(JSON.stringify(s));
        const step_id = currentUser?.org_id + 9999999;
        donates.splice(destination.index, 0, { ...moveItem });
        donate = donates?.map((it, i) =>
          _.pick(
            {
              ...it,
              sort: i,
              step_id,
              project_id: parseInt(id),
            },
            ['id', 'step_id', 'status', 'project_id', 'starttime'],
          ),
        );
        doFetch({
          url: '/webtool/v1/mutisort',
          params: {
            sortlist: donate,
          },
        });
        return donates?.map((it, i) => ({
          ...it,
          sort: i,
        }));
      });

      return;
    }

    if (destination.droppableId !== 'mission_pool' && source.droppableId === 'mission_pool') {
      const secondarrindex = state.columns
        ?.map((it) => it?.id?.toString())
        .indexOf(destination.droppableId);

      let moveItem, donate;

      await setpooldata((s) => {
        const donates = JSON.parse(JSON.stringify(s));
        const res = donates?.filter((it, i) => {
          if (i === source.index) {
            moveItem = { ...it, status: '0', starttime: null }; //状态重置
          }
          return i !== source?.index;
        });
        return res;
      });

      await setState((s) => {
        let newColumns = JSON.parse(JSON.stringify(s.columns));
        newColumns = newColumns?.map((item, index) => {
          if (index === secondarrindex) {
            donate = JSON.parse(JSON.stringify(item.items));
            donate.splice(destination.index, 0, { ...moveItem });
            const sortlist = donate?.map((it, i) =>
              _.pick(
                {
                  ...it,
                  sort: i,
                  step_id: item.id,
                  project_id: parseInt(id),
                },
                ['id', 'step_id', 'status', 'project_id', 'starttime'],
              ),
            );
            doFetch({
              url: '/webtool/v1/mutisort',
              params: {
                sortlist,
              },
            });
            if (moveItem?.tags?.length > 0) {
              const params = {
                tags: moveItem?.tags?.map((it) => ({
                  ...it,
                  project_id: parseInt(id),
                })),
                onlyupdate: true,
                project_id: parseInt(id),
              };
              doFetch({ url: '/webtool/v1/mutitag', params: { ...params } });
            }

            return {
              ...item,
              items: donate?.map((it, i) => ({
                ...it,
                sort: i,
              })),
            };
          }
          return item;
        });
        return {
          ...s,
          columns: newColumns,
        };
      });

      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const firstarrindex = state.columns
      ?.map((it) => it?.id?.toString())
      .indexOf(source.droppableId);
    const secondarrindex = state.columns
      ?.map((it) => it?.id?.toString())
      .indexOf(destination.droppableId);

    if (firstarrindex === secondarrindex) {
      await setState((s) => {
        let newColumns = JSON.parse(JSON.stringify(s.columns));
        newColumns = newColumns?.map((item, index) => {
          if (index === firstarrindex) {
            let newColumnes = item.items ? JSON.parse(JSON.stringify(item.items)) : [];
            const moveItem = newColumnes[source.index];
            newColumnes = newColumnes?.filter((it, i) => i !== source.index);
            newColumnes.splice(destination.index, 0, { ...moveItem });
            const sortlist = newColumnes?.map((it, i) =>
              _.pick(
                {
                  ...it,
                },
                ['id', 'step_id', 'status', 'project_id'],
              ),
            );

            doFetch({
              url: '/webtool/v1/mutisort',
              params: {
                sortlist,
              },
            });

            return {
              ...item,
              items: newColumnes?.map((it, i) => ({
                ...it,
                sort: i,
              })),
            };
          }
          return item;
        });
        return {
          ...s,
          columns: newColumns,
        };
      });
    } else {
      let moveItem, donate;
      setState((s) => {
        let newColumns = JSON.parse(JSON.stringify(s.columns));
        newColumns = newColumns
          ?.map((item, index) => {
            if (index === firstarrindex) {
              return {
                ...item,
                items: item.items.filter((it, i) => {
                  if (i === source.index) {
                    moveItem = { ...it, status: '0', starttime: null }; //状态重置
                  }
                  return i !== source.index;
                }),
              };
            }
            return item;
          })
          .map((item, index) => {
            if (index === secondarrindex) {
              donate = JSON.parse(JSON.stringify(item.items));
              donate.splice(destination.index, 0, { ...moveItem, step_id: item.id });
              return {
                ...item,
                items: donate?.map((it, i) => ({
                  ...it,
                  sort: i,
                })),
              };
            }
            return item;
          });
        return {
          ...s,
          columns: newColumns,
        };
      });

      const sortlist = donate?.map((it, i) =>
        _.pick(
          {
            ...it,
          },
          ['id', 'step_id', 'status', 'project_id', 'starttime'],
        ),
      );

      doFetch({
        url: '/webtool/v1/mutisort',
        params: {
          sortlist,
        },
      }).then((res) => {
        if (res.code === 0) {
          Modal.confirm({
            title: '修改执行人',
            maskClosable: true,
            content: (
              <div>
                <Select
                  style={{ width: '100%' }}
                  placeholder={'修改执行人'}
                  options={data?.user_info_list?.map((it) => {
                    return {
                      label: it?.user_name,
                      value: it?.id,
                    };
                  })}
                  onChange={(value) => {
                    doFetch({
                      url: '/webtool/v1/item/' + moveItem.id,
                      params: { userid: value },
                      method: 'PUT',
                    }).then((res) => {
                      if (res.code === 0) {
                        Modal.destroyAll();
                        refresh();
                      }
                    });
                  }}
                ></Select>
              </div>
            ),
            footer: false,
          });
        }
      });
    }
  };

  const notfinish = useMemo(() => {
    if (state?.columns?.length === 0) {
      return true;
    }
    let alltask = state?.columns?.map((it) => it.items.map((it) => it.status));
    alltask = [...new Set(alltask.flat())];
    if (alltask.length === 0 || alltask.some((it) => ['0', '1'].includes(it))) {
      return true;
    }
  }, [state?.columns]);

  //向父组件推子组件内容
  useEffect(() => {
    if (!data) return;
    const dom = (
      <div className={!screens.md ? 'spread' : 'centerl'} style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 8 }}>
          <div className="centerl" style={{ marginBottom: 2 }}>
            {currentUser?.id === data?.project_user_id ? (
              <Paragraph
                className="oneline"
                style={{ color: '#000000', fontSize: 16, fontWeight: 'bolder' }}
                editable={{
                  onChange: async (value) => {
                    let res = await doFetch({
                      url: '/webtool/v1/project/' + id,
                      params: {
                        project_name: value,
                      },
                      method: 'PUT',
                    });
                    if (res.code === 0) {
                      refresh();
                    }
                  },
                }}
              >
                {data?.project_name}
              </Paragraph>
            ) : (
              <b style={{ color: '#000000', fontSize: 16 }}>{data?.project_name}</b>
            )}
          </div>
          <div className="centerl">
            <Tooltip title={dayjs(data?.deadline).format('YYYY-MM-DD HH:mm')}>
              <span className="center" style={{ color: '#333', marginRight: 2, fontSize: 12 }}>
                {dayjs(data?.deadline).endOf('day').diff(dayjs(), 'hour') > 0 ? (
                  dayjs(data?.deadline).endOf('day').diff(dayjs(), 'hour') > 24 ? (
                    <span style={{ color: 'rgba(115,155,6,1)' }}>
                      距截止{dayjs(data?.deadline).endOf('day').diff(dayjs(), 'day')}天
                    </span>
                  ) : (
                    <span style={{ color: 'rgb(178, 116, 0)' }}>
                      距截止{dayjs(data?.deadline).endOf('day').diff(dayjs(), 'hour')}小时
                    </span>
                  )
                ) : dayjs().diff(dayjs(data?.deadline).endOf('day'), 'hour') > 24 ? (
                  <span
                    style={{
                      color: notfinish ? '#d84c00' : 'green',
                    }}
                  >
                    {notfinish ? '超过截止' : '已完成'}
                    {dayjs().diff(dayjs(data?.deadline).endOf('day'), 'day')}天
                  </span>
                ) : (
                  <span
                    style={{
                      color: notfinish ? '#d84c00' : 'green',
                    }}
                  >
                    {notfinish ? '超过截止' : '已完成'}
                    {dayjs().diff(dayjs(data?.deadline).endOf('day'), 'hour')}小时
                  </span>
                )}
              </span>
            </Tooltip>
            {currentUser?.id === data?.project_user_id && (
              <Popover
                content={
                  <DatePicker
                    defaultValue={dayjs(data?.deadline) ?? dayjs()}
                    style={{ width: 180 }}
                    onChange={async (value) => {
                      let res = await doFetch({
                        url: '/webtool/v1/project/' + id,
                        params: {
                          deadline: value,
                        },
                        method: 'PUT',
                      });
                      if (res.code === 0) {
                        refresh();
                      }
                    }}
                  />
                }
                placement="bottom"
              >
                <a style={{ color: '#1677ff', cursor: 'pointer', fontSize: 12 }}>- 修改</a>
              </Popover>
            )}
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <Tooltip title={'小组公告'}>
            <div
              className="sort"
              style={{
                width: 38,
                height: 38,
                boxShadow: '0 0 12px rgba(0,0,0,0.1)',
                marginRight: 16,
                marginLeft: 16,
              }}
              onClick={async () => {
                setdrawer((s) => ({
                  ...s,
                  title: '小组公告',
                  open: true,
                  width: 800,
                }));
              }}
            >
              <IconFont type="icon-jilu" style={{ fontSize: 22 }} />
            </div>
          </Tooltip>
          <Tooltip title={'任务动态'}>
            <div
              className="sort"
              style={{
                width: 38,
                height: 38,
                boxShadow: '0 0 12px rgba(0,0,0,0.1)',
                marginRight: 16,
              }}
              onClick={async () => {
                setdrawer((s) => ({
                  ...s,
                  title: '任务动态',
                  open: true,
                  width: 800,
                }));
                await messagelist?.runAsync();
              }}
            >
              <IconFont type="icon-dt" style={{ fontSize: 22 }} />
            </div>
          </Tooltip>
          <Tooltip title={'进度总览'}>
            <div
              className="sort"
              style={{
                width: 38,
                height: 38,
                boxShadow: '0 0 12px rgba(0,0,0,0.1)',
              }}
              onClick={async () => {
                setdrawer((s) => ({
                  ...s,
                  title: (
                    <span>
                      <b style={{ marginRight: 6 }}>进度总览</b>
                      <Segmented
                        onChange={(val) => {
                          setganttype(val);
                        }}
                        options={[
                          {
                            label: '项目',
                            value: 'project',
                          },
                          {
                            label: '任务',
                            value: 'task',
                          },
                        ]}
                      />
                    </span>
                  ),
                  open: true,
                  closable: true,
                  width: '100vw',
                }));
                await messagelist?.runAsync();
              }}
            >
              <IconFont type="icon-fsux_tubiao_gantetu" style={{ fontSize: 20 }} />
            </div>
          </Tooltip>
        </div>
      </div>
    );
    setdom(dom);
  }, [data, screens.md]);

  useEffect(() => {
    if (drawer?.title !== '任务动态' && drawer?.title) {
      setState((s) => {
        if (ganttype === 'project') {
          let newgantt = [...s?.defaultgantt];
          if (chooseusers?.length > 0) {
            newgantt = newgantt?.filter((it, i) => {
              return chooseusers?.some((item) => it?.users?.some((itz) => itz?.id === item));
            });
          }
          return {
            ...s,
            gantt: newgantt,
          };
        } else {
          let newganttp = [...s?.defaultganttp];
          if (chooseusers?.length > 0) {
            newganttp = newganttp?.filter((it, i) => {
              return chooseusers?.some((item) => it?.users?.some((itz) => itz?.id === item));
            });
          }
          return {
            ...s,
            ganttp: newganttp,
          };
        }
      });
    }
    messagelist?.run();
  }, [chooseusers]);

  const dragfn =
    currentUser?.id === data?.project_user_id
      ? {
          onDateChange: async (task, children) => {
            if (currentUser?.id !== data?.project_user_id) {
              return;
            }
            let res;
            if (task?.id.indexOf('step') !== -1) {
              let id = task?.id.replace('step', '');
              res = await doFetch({
                url: '/webtool/v1/step/' + id,
                params: {
                  other: [
                    dayjs(task?.start).format('YYYY-MM-DD HH:mm'),
                    dayjs(task?.end).format('YYYY-MM-DD HH:mm'),
                  ].toString(),
                },
                method: 'PUT',
              });
            } else if (task?.id.indexOf('mission') !== -1) {
              let id = task?.id.replace('mission', '');
              res = await doFetch({
                url: '/webtool/v1/item/' + id,
                params: {
                  starttime: task?.start,
                  deadline: task?.end,
                },
                method: 'PUT',
              });
            }
            if (res.code === 0) {
              refresh();
            }
          },
        }
      : {};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Drawer
        {...drawer}
        maskStyle={{
          backgroundColor: 'transparent',
        }}
        closable={true}
        onClose={() => {
          setdrawer((s) => ({
            ...s,
            open: false,
          }));
          if (!['小组公告', '任务动态', '编辑小组公告'].includes(drawer?.title)) {
            refresh();
          }
        }}
        placement="left"
        extra={
          drawer?.title === '编辑小组公告' ? (
            <div
              className="sorts"
              onClick={() => {
                setdrawer((s) => ({
                  ...s,
                  title: '小组公告',
                  open: true,
                  width: 800,
                }));
              }}
            >
              <RollbackOutlined style={{ color: '#000000' }} />
            </div>
          ) : drawer?.title === '小组公告' ? (
            <div
              className="sorts"
              onClick={() => {
                setdrawer((s) => ({
                  ...s,
                  title: '编辑小组公告',
                  open: true,
                  width: 800,
                }));
              }}
              style={{ display: currentUser?.id === data?.project_user_id ? 'flex' : 'none' }}
            >
              <EditFilled style={{ color: '#1890ff' }} />
            </div>
          ) : (
            <Avatar.Group maxCount={!screens?.md ? 3 : 8}>
              <Avatar
                style={{
                  cursor: 'pointer',
                  boxShadow: chooseusers.length === 0 ? '0 0 6px #2376B7' : 'none',
                  backgroundColor: '#8AA4A8',
                  marginRight: 6,
                  transition: 'all 0.4s',
                }}
                onClick={() => {
                  setchooseusers((s) => {
                    return [];
                  });
                }}
              >
                全部
              </Avatar>
              {data?.user_info_list?.map((it, i) => {
                return (
                  <Tooltip key={it?.id} title={it?.user_name}>
                    <Avatar
                      style={{
                        cursor: 'pointer',
                        boxShadow: chooseusers.includes(it?.id) ? '0 0 6px #2376B7' : 'none',
                        margin: '0 2px',
                        transition: 'all 0.4s',
                      }}
                      src={it?.head_url || null}
                      onClick={() => {
                        setchooseusers((s) => {
                          if (s.includes(it?.id)) {
                            return s?.filter((itz) => itz !== it?.id);
                          } else {
                            return [...new Set([...s, it?.id])];
                          }
                        });
                      }}
                    >
                      {it?.head_url || it?.user_name.charAt(0)}
                    </Avatar>
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          )
        }
        width={'100%'}
        contentWrapperStyle={{
          maxWidth: ['小组公告', '任务动态', '编辑小组公告'].includes(drawer?.title) ? 680 : '100%',
        }}
      >
        {drawer?.title === '任务动态' ? (
          <div
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <List
              style={{ cursor: 'pointer' }}
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
                      <span key="12" style={{ fontSize: 12 }}>
                        {difftime(dayjs(), dayjs(item.created_at))}
                      </span>,
                    ]}
                    onClick={async () => {
                      await setInitialState((s) => ({
                        ...s,
                        curitem: item,
                      }));
                      await setdrawer((s) => ({
                        ...s,
                        open: false,
                      }));
                      if (currentUser?.id === item?.user?.id) {
                        //转为已读
                        await doFetch({
                          url: `/webtool/v1/notice/${item?.id}`,
                          params: { isread: true },
                          method: 'PUT',
                        });
                      }
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        [
                          '编辑了任务',
                          '开始了任务',
                          '完成了任务',
                          '挂起了任务',
                          '删除了任务',
                        ].includes(item?.title) ? (
                          <Tooltip title={item?.user?.user_name}>
                            <Avatar src={item?.user?.head_url || null}>
                              {item?.user?.head_url || item?.user?.user_name.charAt(0)}
                            </Avatar>
                          </Tooltip>
                        ) : (
                          <Tooltip title={item?.other_user?.user_name}>
                            <Badge dot={!item?.isread}>
                              <Avatar src={item?.other_user?.head_url || null}>
                                {item?.other_user?.head_url ||
                                  item?.other_user?.user_name.charAt(0)}
                              </Avatar>
                            </Badge>
                          </Tooltip>
                        )
                      }
                      title={
                        item.title === '你有新的任务' ? (
                          <b>
                            <a style={{ color: '#008E59' }}>
                              发布了任务给
                              {item?.other_user?.user_name === item?.user?.user_name
                                ? '自己'
                                : item?.user?.user_name}
                              :{item.mission_name}
                            </a>
                          </b>
                        ) : item.title === '你有新的回复' ? (
                          <b style={{ color: '#22A2C3' }}>
                            在任务{item.mission_name}中 回复{' '}
                            {item?.other_user?.user_name === item?.user?.user_name
                              ? '自己'
                              : item?.user?.user_name}
                          </b>
                        ) : [
                            '编辑了任务',
                            '开始了任务',
                            '完成了任务',
                            '挂起了任务',
                            '删除了任务',
                          ].includes(item.title) ? (
                          <b>
                            {item.title} {item.mission_name}
                          </b>
                        ) : item.title === '删除了任务' ? (
                          <b style={{ color: '#FB8B05' }}>删除了任务 {item.mission_name}</b>
                        ) : null
                      }
                    />
                    <div className="oneline" style={{ flex: 0.5, textAlign: 'right' }}>
                      {strings ||
                        (item?.deadline && (
                          <span style={{ paddingLeft: 8 }}>
                            <a>{dayjs(item?.deadline).format('YYYY年MM月DD日')}</a>
                            前截止
                          </span>
                        ))}
                    </div>
                  </List.Item>
                );
              }}
            />
          </div>
        ) : drawer?.title === '小组公告' ? (
          data?.output_path ? (
            <Limit content={data?.output_path} style={{ padding: '16px' }}></Limit>
          ) : (
            <Empty style={{ marginTop: 88 }}></Empty>
          )
        ) : drawer?.title === '编辑小组公告' ? (
          <div style={{ padding: '0 24px' }}>
            <EditRemark
              id={id}
              initialValues={{ output_path: data?.output_path }}
              refresh={() => {
                refresh();
                setdrawer((s) => ({
                  ...s,
                  title: '小组公告',
                }));
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <Gantt
              tasks={
                ganttype === 'project'
                  ? state?.gantt ?? [
                      {
                        start: new Date(2020, 1, 1),
                        end: new Date(2020, 1, 2),
                        name: 'Idea',
                        id: 'Task 0',
                        type: 'task',
                        progress: 45,
                        isDisabled: true,
                        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
                      },
                    ]
                  : state?.ganttp ?? [
                      {
                        start: new Date(2020, 1, 1),
                        end: new Date(2020, 1, 2),
                        name: 'Idea',
                        id: 'Task 0',
                        type: 'task',
                        progress: 45,
                        isDisabled: true,
                        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
                      },
                    ]
              }
              {...dragfn}
              locale={'zh-cn'}
              {...colordiy}
              viewMode={screens?.md ? 'Day' : 'Week'}
              TaskListHeader={({ headerHeight, rowWidth }) => {
                const styles = {
                  style: {
                    flex: 1,
                    height: headerHeight,
                    borderLeft: '1px solid #ffffff',
                  },
                };
                if (!screens.md) {
                  return null;
                }

                return (
                  <div className="tableheader" style={{ width: 260 }}>
                    <div style={{ width: 180, height: headerHeight }}>名称</div>
                    <div {...styles}>人员</div>
                  </div>
                );
              }}
              TaskListTable={({ rowHeight, tasks }) => {
                const style = {
                  style: {
                    width: '100%',
                    height: rowHeight,
                    display: 'flex',
                  },
                };
                if (!screens.md) {
                  return null;
                }
                return (
                  <div
                    className="tablebody"
                    style={{
                      height: rowHeight * tasks?.length,
                      width: 260,
                    }}
                  >
                    {tasks?.map((it, i) => {
                      return (
                        <div key={it?.id} {...style}>
                          <div className="center" style={{ width: 180 }}>
                            <Tooltip title={it?.name}>
                              <span className="oneline" style={{ padding: 6 }}>
                                {it?.name}
                              </span>
                            </Tooltip>
                          </div>
                          <div
                            className="center"
                            style={{
                              flex: 1,
                              borderLeft: '1px solid #f0f0f0',
                              height: rowHeight,
                              fontSize: 12,
                              gap: 2,
                            }}
                          >
                            <Tooltip
                              title={it?.users?.map((it) => (
                                <span key={it?.id} style={{ margin: '0 2px' }}>
                                  {it?.user_name}
                                </span>
                              ))}
                            >
                              <span>
                                {it.users?.length > 1
                                  ? it.users.length + '人'
                                  : it.users[0]?.user_name}
                              </span>
                            </Tooltip>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
              TooltipContent={({ task }) => {
                return (
                  <div className="diytooltip">
                    <p style={{ margin: '0 0 6px 0' }}>
                      <b style={{ display: 'block' }}>{task?.name}</b>
                      <span
                        style={{
                          color: '#999',
                          fontSize: 12,
                          display: 'block',
                          margin: '6px 0 0 0',
                        }}
                      >
                        {dayjs(task?.start).format('YYYY.MM.DD')}至
                        {dayjs(task?.end).format('YYYY.MM.DD')}
                      </span>
                    </p>
                    <p style={{ margin: '0 0 10px 0' }}>
                      <span>
                        进度: <b style={{ color: '#1890ff' }}>{task?.progress}%</b>
                      </span>
                      <span style={{ marginLeft: 12 }}>
                        时长:
                        <b style={{ color: '#1890ff' }}>
                          {dayjs(task?.end).diff(dayjs(task?.start), 'day')}天
                        </b>
                      </span>
                    </p>
                    {task?.status ? (
                      <span style={{ color: items[task?.status]?.color }}>
                        {items[task?.status]?.icon}
                        {items[task?.status]?.statusName}
                      </span>
                    ) : (
                      <p className="center" style={{ margin: '0 0 0px 0', fontSize: 12, gap: 8 }}>
                        <span>全部:{task?.allen}</span>
                        <span style={{ color: '#ff4800' }}>进行中:{task?.doing}</span>
                        <span style={{ color: 'green' }}>已完成:{task?.done}</span>
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>
        )}
      </Drawer>

      <Modal
        {...modal}
        onCancel={() => {
          setmodal((s) => ({
            ...s,
            open: false,
          }));
        }}
        footer={false}
        destroyOnClose={true}
        style={{ top: 20 }}
      >
        {['新建任务', '编辑任务', '任务池-新建任务', '任务池-编辑任务'].includes(modal?.title) && (
          <AddMission
            title={modal?.title}
            org_id={currentUser?.org_id}
            project_id={parseInt(id)}
            sort={modal?.sort}
            step_id={modal?.step_id}
            defaultValue={modal?.defaultValue}
            userList={data?.user_info_list}
            enddate={data?.deadline}
            refresh={() => {
              refresh();
              mission_pool?.refresh();
              setmodal((s) => ({
                ...s,
                open: false,
              }));
            }}
          />
        )}
        {['新建流程', '编辑起止时间'].includes(modal?.title) && (
          <AddSteps
            id={id}
            step_id={modal?.step_id}
            title={modal?.title}
            columns={state?.columns}
            initialValues={modal?.initialValues}
            refresh={() => {
              refresh();
              setmodal((s) => ({
                ...s,
                open: false,
              }));
            }}
          />
        )}
        {modal?.title === '管理标签' && (
          <AddTags
            project_id={parseInt(id)}
            refresh={() => {
              refresh();
              setmodal((s) => ({
                ...s,
                open: false,
              }));
            }}
          />
        )}
        {modal?.title === '编辑项目成员' && (
          <AddUsers
            project_id={parseInt(id)}
            initialValues={{
              user_list: data?.user_info_list?.map((it) => it.id),
            }}
            refresh={() => {
              refresh();
              setmodal((s) => ({
                ...s,
                open: false,
              }));
            }}
          />
        )}
      </Modal>

      <div
        className="center bglight"
        style={{
          justifyContent: 'space-between',
          margin: '0px 0 12px 0',
          padding: 12,
          borderRadius: 12,
          minWidth: 1366,
          overflow: 'auto',
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}
      >
        {loading && !data ? (
          <Skeleton.Input active />
        ) : (
          <>
            <div className="center">
              <div
                className="sort"
                onClick={() => {
                  history.push('/welcome/homepage');
                }}
                style={{ marginRight: 12 }}
              >
                <ArrowLeftOutlined style={{ color: '#1890ff' }} />
              </div>
              <Tooltip title={'刷新'}>
                <div
                  className="sort"
                  style={{ marginRight: 12 }}
                  onClick={() => {
                    refresh();
                    mission_pool?.refresh();
                  }}
                >
                  <RedoOutlined />
                </div>
              </Tooltip>
              <Tooltip title={'导出Excel'}>
                <div
                  className="sort"
                  style={{ marginRight: 12 }}
                  onClick={() => {
                    getFetch({
                      url: '/webtool/download',
                      params: {
                        ...state?.search,
                        tags: state?.search?.tags?.join(','),
                        id: id,
                        filename: data?.project_name,
                        url: REACT_APP_URL,
                      },
                    });
                  }}
                >
                  <ExportOutlined style={{ color: 'green' }} />
                </div>
              </Tooltip>
              <Segmented
                value={state.search.status}
                onChange={async (val) => {
                  await setState((s) => ({
                    ...s,
                    search: {
                      ...s.search,
                      status: val,
                    },
                  }));
                }}
                options={[
                  {
                    label: '全部',
                    value: '-1',
                  },
                ].concat(
                  Object.values(items).map((it) => ({
                    label: it.statusName,
                    value: it.value,
                  })),
                )}
              />
              <div className="center">
                <span style={{ fontSize: 14, textIndent: 12 }}>只看我的</span>
                <Switch
                  size="large"
                  style={{ margin: '0 12px 0 6px' }}
                  checked={state?.search?.mine}
                  onChange={(val) => {
                    setState((s) => ({
                      ...s,
                      search: {
                        ...s.search,
                        mine: val,
                        selectuser: null,
                      },
                    }));
                  }}
                ></Switch>
              </div>
              <Select
                maxTagCount={1}
                onDropdownVisibleChange={() => {
                  tags.refresh();
                }}
                placeholder={'请选择标签'}
                style={{ width: '286px', margin: '0 12px' }}
                mode="multiple"
                allowClear
                value={state.search.tags}
                onChange={async (val) => {
                  await setState((s) => ({
                    ...s,
                    search: {
                      ...s.search,
                      tags: val,
                    },
                  }));
                }}
                options={tags?.data?.map((it) => {
                  return {
                    label: it?.tag_name,
                    value: it?.id,
                  };
                })}
              ></Select>
              {currentUser?.id === data?.project_user_id && (
                <Tooltip title={'标签管理'}>
                  <div
                    className="sort"
                    onClick={() => {
                      setmodal((s) => ({
                        ...s,
                        title: '管理标签',
                        open: true,
                      }));
                    }}
                  >
                    <TagOutlined />
                  </div>
                </Tooltip>
              )}
            </div>

            <div className="center" style={{ gap: 12 }}>
              <Avatar.Group maxCount={6}>
                {[
                  ...data?.user_info_list.filter((it) => it?.id === data?.project_user_id),
                  ...[
                    ...data?.user_info_list.filter(
                      (it) =>
                        it?.id !== data?.project_user_id &&
                        activeUserIdList.includes(it.id.toString()),
                    ),
                    ...data?.user_info_list.filter(
                      (it) =>
                        it?.id !== data?.project_user_id &&
                        !activeUserIdList.includes(it.id.toString()),
                    ),
                  ],
                ].map((it, i) => {
                  if (it?.head_url && it?.head_url !== '') {
                    return (
                      <Tooltip title={(i === 0 ? '组长:' : '成员:') + it?.user_name} key={i}>
                        <Avatar
                          src={it?.head_url}
                          className={i === 0 ? 'borderanis' : ''}
                          style={{
                            filter:
                              activeUserIdList.indexOf(it.id.toString()) !== -1 ||
                              currentUser?.id === it.id
                                ? 'grayscale(0%)'
                                : 'grayscale(100%)',
                            cursor: 'pointer',
                            boxShadow:
                              state.search.selectuser === it?.id ? '0 0 6px #ff4800' : 'none',
                          }}
                          onClick={() => {
                            setState((s) => {
                              return {
                                ...s,
                                search: {
                                  ...s.search,
                                  selectuser: s.search.selectuser === it?.id ? null : it?.id,
                                  mine: false,
                                },
                              };
                            });
                          }}
                        />
                      </Tooltip>
                    );
                  } else {
                    return (
                      <Tooltip title={(i === 0 ? '组长:' : '成员:') + it?.user_name} key={i}>
                        <Avatar
                          className={i === 0 ? 'borderanis' : ''}
                          style={{
                            filter:
                              activeUserIdList.indexOf(it.id.toString()) !== -1 ||
                              currentUser?.id === it.id
                                ? 'grayscale(0%)'
                                : 'grayscale(100%)',
                            cursor: 'pointer',
                            boxShadow:
                              state.search.selectuser === it?.id ? '0 0 6px #ff4800' : 'none',
                          }}
                          onClick={() => {
                            setState((s) => {
                              return {
                                ...s,
                                search: {
                                  ...s.search,
                                  selectuser: s.search.selectuser === it?.id ? null : it?.id,
                                  mine: false,
                                },
                              };
                            });
                          }}
                        >
                          {it?.user_name?.charAt(0)}
                        </Avatar>
                      </Tooltip>
                    );
                  }
                })}
              </Avatar.Group>
              {currentUser?.id === data?.project_user_id && (
                <Avatar
                  icon={<EditFilled style={{ fontSize: 14, marginTop: 7, display: 'block' }} />}
                  style={{ backgroundColor: '#73c0de', cursor: 'pointer', marginLeft: -20 }}
                  onClick={() => {
                    setmodal((s) => ({
                      ...s,
                      title: '编辑项目成员',
                      open: true,
                    }));
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>

      <Skeleton active loading={loading && !data}>
        <Droppable droppableId={'board'} direction="horizontal" type="COLUMN">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                height: 'calc(100vh - 0)',
                minWidth: 1366,
                marginBottom: 12,
                paddingBottom: 12,
              }}
            >
              {state.columns
                .sort((a, b) => a.sort - b.sort)
                .map((column, index) => (
                  <Draggable
                    key={column?.id?.toString()}
                    draggableId={column?.id?.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Card
                        key={column?.id?.toString() + 'down'}
                        title={
                          currentUser?.id === data?.project_user_id ? (
                            <div
                              {...provided.dragHandleProps}
                              style={{
                                color: '#000000',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Paragraph
                                className="oneline"
                                style={{ color: '#000000', whiteSpace: 'normal' }}
                                editable={{
                                  onChange: async (value) => {
                                    let res = await doFetch({
                                      url: '/webtool/v1/step/' + column?.id,
                                      params: {
                                        name: value,
                                      },
                                      method: 'PUT',
                                    });
                                    if (res.code === 0) {
                                      refresh();
                                    }
                                  },
                                }}
                              >
                                {column?.name}
                              </Paragraph>
                              <span
                                style={{
                                  fontSize: 12,
                                  color: '#666',
                                  display: column?.items?.length === 0 ? 'none' : 'inline-block',
                                  paddingRight: 4,
                                  paddingTop: 2,
                                }}
                              >
                                共{' '}
                                <b style={{ fontSize: 16, color: '#000' }}>
                                  {column?.items?.length}
                                </b>{' '}
                                个
                              </span>
                            </div>
                          ) : (
                            <div className="center" style={{ alignItems: 'baseline' }}>
                              <Tooltip title={column?.name}>
                                <b style={{ fontSize: 14, flex: 1 }} className="oneline">
                                  {column?.name}
                                </b>
                              </Tooltip>
                              <span
                                style={{
                                  fontSize: 12,
                                  color: '#666',
                                  display: column?.items?.length === 0 ? 'none' : 'inline-block',
                                  paddingRight: 4,
                                  textIndent: 6,
                                }}
                              >
                                共{' '}
                                <b style={{ fontSize: 16, color: '#000' }}>
                                  {column?.items?.length}
                                </b>{' '}
                                个
                              </span>
                            </div>
                          )
                        }
                        className="card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        hoverable
                        extra={[
                          <div
                            key="adder"
                            className="sorts"
                            onClick={() => {
                              setmodal((s) => ({
                                ...s,
                                open: true,
                                title: '新建任务',
                                width: '1000px',
                                step_id: column.id,
                                sort: column?.items?.length
                                  ? Math.max(...column?.items?.map((it) => it.sort + 1))
                                  : 0,
                                defaultValue: {},
                              }));
                            }}
                          >
                            <PlusOutlined style={{ color: 'rgb(24, 144, 255)' }} />
                          </div>,
                          column?.items?.length === 0 &&
                            currentUser?.id === data?.project_user_id && (
                              <Popconfirm
                                title="是否删除该流程？"
                                placement="bottomRight"
                                onConfirm={async () => {
                                  let res = await doFetch({
                                    url: '/webtool/v1/step/' + column.id,
                                    method: 'DELETE',
                                  });
                                  if (res.code === 0) {
                                    refresh();
                                  }
                                }}
                              >
                                <div key="adder" className="sorts">
                                  <DeleteOutlined style={{ color: '#ff4800' }} />
                                </div>
                              </Popconfirm>
                            ),
                        ]}
                      >
                        <div
                          className="diycard"
                          onClick={() => {
                            if (currentUser?.id === data?.project_user_id) {
                              setmodal((s) => ({
                                ...s,
                                open: true,
                                title: '编辑起止时间',
                                width: '400px',
                                initialValues: column?.other?.split(',') ?? [],
                                step_id: column?.id,
                              }));
                            }
                          }}
                        >
                          {(function () {
                            if (column?.other) {
                              let arr = column?.other?.split(',');
                              return (
                                <div className="spread">
                                  <span style={{ color: '#519670' }}>
                                    起{dayjs(arr[0]).format('YYYY-MM-DD')}
                                  </span>
                                  <Divider
                                    type="vertical"
                                    style={{ marginTop: 4, backgroundColor: '#e0e0e0' }}
                                  />
                                  <span style={{ color: '#ff4800' }}>
                                    止{dayjs(arr[1]).format('YYYY-MM-DD')}
                                  </span>
                                </div>
                              );
                            }
                            return <span>未设置起止时间</span>;
                          })()}
                        </div>

                        <QuoteList
                          userList={data?.user_info_list}
                          refresh={() => {
                            refresh();
                            mission_pool?.refresh();
                          }}
                          edit={(defaultValue) => {
                            setmodal((s) => ({
                              ...s,
                              open: true,
                              title: '编辑任务',
                              width: '1000px',
                              step_id: column.id,
                              defaultValue: defaultValue,
                              sort: null,
                            }));
                          }}
                          datas={column?.items ?? []}
                          listId={column?.id?.toString()}
                        ></QuoteList>
                      </Card>
                    )}
                  </Draggable>
                ))}
              <MissionPools
                userList={data?.user_info_list}
                setmodal={setmodal}
                datalist={pooldata ?? []}
                refresh={() => {
                  refresh();
                  mission_pool?.refresh();
                }}
              />

              {!snapshot.draggingFromThisWith && currentUser?.id === data?.project_user_id && (
                <Card
                  key="additems"
                  style={{ height: 50 }}
                  hoverable
                  className="center"
                  onClick={() => {
                    setmodal((s) => ({
                      ...s,
                      open: true,
                      title: '新建流程',
                      width: '400px',
                      initialValues: [],
                    }));
                  }}
                >
                  <PlusOutlined style={{ color: '#1890ff' }} />
                </Card>
              )}
            </div>
          )}
        </Droppable>
      </Skeleton>
    </DragDropContext>
  );
};
export default Project;

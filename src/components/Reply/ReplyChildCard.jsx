/* eslint-disable eqeqeq */
import IconFont from '@/components/IconFont';
import Limit from '@/components/Limit';
import {
  CloseOutlined,
  EditFilled,
  LoadingOutlined,
  MessageFilled,
} from '@ant-design/icons';
import { Avatar, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';


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

const emojiarr = ['👍', '👎', '😆', '😊', '😢', '😭', '😂', '🎉', '❤️', '🚀', '👀'];

function qc(arr) {
  let tempArr = [];
  let obj = {};
  let resultArr = [];

  arr.forEach((v) => {
    if (!tempArr.includes(v)) {
      tempArr.push(v);
    }
  });
  arr.forEach((v) => {
    if (obj[v]) {
      obj[v]++;
    } else {
      obj[v] = 1;
    }
  });
  tempArr.forEach((v) => {
    resultArr.push({
      name: v,
      num: obj[v],
    });
  });

  return resultArr;
}


const ReplyChildCard = ({
  user = {},
  reply,
  bereply_user = {},
  otherusers = [],
  setdoreply,
  id,
  msg_id,
  doreply,
  currentUser,
  drawer,
  run,
  loading,
  info,
  formRef,
  children,
  created_at,
  curitem,
  other,
}) => {
  const [curclickid, setcurclickid] = useState();
  const intoRef = useRef();

  useEffect(() => {
    if (curitem?.msg_id == id) {
      intoRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [curitem?.msg_id]);

  return (
    <div
      style={{
        overflow: 'hidden',
        display: 'flex',
        transition: 'all 0.2s',
        borderBottom: '1px solid #f0f0f0',
        padding: '12px 12px 0 12px',
        backgroundColor: 'transparent',
      }}
      ref={intoRef}
    >
      <div style={{ flex: 1 }}>
        <div className="spread" style={{ height: 40, marginBottom: 0 }}>
          <div className="center">
            <Tooltip title={user.user_name}>
              <Avatar size="small" src={user?.head_url || null}>
                {user?.head_url ? null : user?.user_name?.charAt(0)}
              </Avatar>
            </Tooltip>
            <span style={{ color: curitem?.msg_id == id ? '#ff4800' : '#333333', textIndent: 12 }}>
              回复&nbsp;<b>{bereply_user?.user_name}</b>
            </span>

            <div className="center" style={{ gap: 8, paddingLeft: 12 }}>
              {qc(info?.map?.((it) => it?.type) ?? [])?.map((it) => {
                return (
                  <div
                    className="emojis"
                    key={it?.name}
                    onClick={() => {
                      setcurclickid(id);
                      if (loading && curclickid == id) return;
                      run({
                        url: `/webtool/v1/msg/${id}`,
                        params: { emoji: it?.name },
                        method: 'PUT',
                      });
                    }}
                  >
                    <span>{emojiarr[it?.name]}</span>
                    <span>{it?.num}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="center"
            style={{
              gap: 6,
              display: drawer?.val == 'edit' ? 'none' : 'flex',
              position: 'relative',
            }}
            id={`container${id}`}
          >
            <div
              className="sorts hoveremoji"
              style={{ position: 'relative', justifyContent: 'flex-end' }}
            >
              <div className="center" style={{ position: 'absolute', right: 30, width: 264 }}>
                {emojiarr?.map((it, i) => {
                  return (
                    <div
                      className="emoji"
                      key={i}
                      onClick={() => {
                        setcurclickid(id);
                        if (loading && curclickid == id) return;
                        run({
                          url: `/webtool/v1/msg/${id}`,
                          params: { emoji: i.toString() },
                          method: 'PUT',
                        });
                      }}
                    >
                      {it}
                    </div>
                  );
                })}
              </div>
              <div className="center" style={{ width: 30, height: 30 }}>
                <IconFont type="icon-xiaolian" style={{ fontSize: 16 }} />
              </div>
            </div>

            <div
              className="sorts"
              onClick={async (e) => {
                e.stopPropagation();
                await setdoreply({
                  ...user,
                  curid: msg_id,
                  curitemid: id,
                  type: 'reply',
                });
                setTimeout(() => {
                  intoRef?.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'start',
                  });
                }, 300);
              }}
            >
              <MessageFilled style={{ color: 'rgb(24, 144, 255)' }} />
            </div>
            {currentUser?.id == user?.id ? (
              <div
                className="sorts"
                onClick={async (e) => {
                  e.stopPropagation();
                  await setdoreply({
                    ...bereply_user,
                    curid: msg_id, // 父级消息id
                    curitemid: id, //本身消息id
                    type: 'edit2',
                    other:
                      other
                        ?.split(',')
                        ?.filter((it) => it !== '')
                        ?.map((it) => parseInt(it)) ?? [],
                  });
                  formRef?.current?.setFieldsValue({ reply });
                  setTimeout(() => {
                    intoRef?.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                      inline: 'start',
                    });
                  }, 300);
                }}
              >
                {loading && curclickid == id ? (
                  <LoadingOutlined />
                ) : (
                  <EditFilled style={{ color: 'green' }} />
                )}
              </div>
            ) : null}

            {currentUser?.id == user?.id ? (
              <Popconfirm
                title={'确认删除'}
                placement="left"
                getPopupContainer={() => document.getElementById(`container${id}`)}
                onConfirm={(e) => {
                  e.stopPropagation();
                  setcurclickid(id);
                  run({ url: `/webtool/v1/msg/${id}`, params: {}, method: 'DELETE' });
                }}
                onCancel={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  className="sorts"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {loading && curclickid == id ? (
                    <LoadingOutlined />
                  ) : (
                    <CloseOutlined style={{ color: '#ff4800' }} />
                  )}
                </div>
              </Popconfirm>
            ) : null}
          </div>
        </div>
        <div
          className="limit"
          style={{
            borderRadius: 8,
            marginBottom: 12,
            paddingBottom: 10,
          }}
        >
           <Limit content={reply}></Limit>
          <div className="spread" style={{ color: '#666', fontSize: 12 }}>
            <span>{difftime(dayjs(), dayjs(created_at))}</span>
            <span>
              <b style={{ display: otherusers && otherusers?.length > 0 ? 'inline' : 'none' }}>
                @{' '}
              </b>
              {otherusers?.map?.((it) => (
                <span key={it?.user_name} style={{ padding: '0 4px' }}>
                  {it?.user_name}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ReplyChildCard

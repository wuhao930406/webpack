/* eslint-disable eqeqeq */
import { AddReply } from '@/components/DragModal/formdoms';
import ReplyCard from '@/components/Reply/ReplyCard';
import { doFetch, getFetch } from '@/utils/doFetch';
import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import { useModel, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Avatar, Drawer, message, Select, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

function Reply({ drawer, userList, children, extra, full }) {
  const { id } = useParams();
  const [doreply, setdoreply] = useState(false);
  const {
    initialState: { currentUser, curitem },
    setInitialState,
  } = useModel('@@initialState');
  const formRef = useRef();

  const [submitdata, setsubmitdata] = useState({
    project_id: parseInt(id),
    item_id: null,
    bereply_userid: drawer?.userInfo?.id,
    other: [],
  });

  useEffect(() => {
    setsubmitdata((s) => ({
      ...s,
      project_id: parseInt(id),
      bereply_userid: drawer?.userInfo?.id,
      other: drawer?.open ? doreply?.other ?? [] : [],
    }));
  }, [drawer?.userInfo?.id, id, doreply?.other, drawer?.open]);

  const allmsg = useRequest(
    async () => {
      if (!drawer.open) return;
      let res = await getFetch({ url: '/webtool/v1/allmsg', params: { item_id: drawer?.id ?? 0 } });
      return res?.data;
    },
    {
      refreshDeps: [drawer?.id, drawer?.open, curitem],
    },
  );

  const { run, loading } = useRequest(
    (params) => {
      return doFetch(params);
    },
    {
      manual: true,
      debounceWait: 600,
      onSuccess: (res) => {
        allmsg?.refresh();
        if (res?.code === 0) {
          formRef.current.setFieldsValue({ reply: '' });
          setdoreply(false);
          setsubmitdata(s=>({
            ...s,
            other:[]
          }))
        }
      },
    },
  );

  return (
    <Drawer
      maskStyle={{
        backgroundColor: 'transparent',
      }}
      contentWrapperStyle={full ? {} : { maxWidth: 1280 }}
      placement="right"
      extra={extra(setdoreply)}
      width={full?"100vw":"100%"}
      destroyOnClose
      {...drawer}
      closable={drawer?.closable}
    >
      <div
        onClick={() => {
          setdoreply(false);
        }}
      >
        <div style={{ padding: 18 }}>{children}</div>
        {allmsg?.data?.map((it) => {
          return (
            <ReplyCard
              key={it?.id}
              {...it}
              drawer={drawer}
              doreply={doreply}
              run={run}
              loading={loading}
              currentUser={currentUser}
              curitem={curitem}
              formRef={formRef}
              setdoreply={(val) => {
                setdoreply(val);
              }}
            />
          );
        })}
        <div style={{ height: doreply ? 490 : 66 }}></div>
      </div>

      {drawer?.val === 'reply' && currentUser?.user_name && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            backgroundColor: '#fff',
            padding: '12px',
            borderTop: '1px solid #ddd',
            width:full? drawer?.bp?'calc(100vw - 24px)':"calc(70vw - 24px)" :"auto"
          }}
          onClick={() => {
            if (doreply === false) {
              setdoreply(drawer?.userInfo);
            }
          }}
        >
          <div
            style={{
              height: doreply ? 460 : 40,
              overflow: 'hidden',
              display: 'flex',
              transition: 'all 0.2s',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <div className="center">
              <div className="info">
                <Tooltip title={currentUser.user_name}>
                  <Avatar size="large" src={currentUser?.head_url || null}>
                    {currentUser?.head_url ? null : currentUser.user_name?.charAt(0)}
                  </Avatar>
                </Tooltip>
              </div>
              <div className="spread" style={{ flex: 1 }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    margin: 'auto',
                    width: 54,
                    height: 3,
                    borderRadius: 6,
                    backgroundColor: '#ccc',
                  }}
                ></div>
                <div className="centerl" style={{ flex: 1 }}>
                  <span>
                    回复 <b>{doreply?.user_name ?? '-'}</b>
                  </span>
                  <b style={{ padding: '0 12px', fontSize: 16 }}>@</b>
                  <Select
                    mode="multiple"
                    allowClear
                    value={submitdata?.other}
                    onChange={(val) => {
                      setsubmitdata((s) => ({
                        ...s,
                        other: val,
                      }));
                    }}
                    placeholder="请选择"
                    options={userList
                      ?.filter((it) => it.id !== currentUser?.id && it?.id !== doreply?.id)
                      ?.map((it) => {
                        return {
                          label: it?.user_name,
                          value: it?.id,
                        };
                      })}
                    style={{ width: '120px' }}
                    maxTagCount={1}
                  ></Select>
                </div>
                <div
                  className="sorts"
                  style={{
                    width: 66,
                    height: 32,
                    backgroundColor: 'rgb(24, 144, 255)',
                    color: '#fff',
                  }}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (loading || !doreply) {
                      setdoreply(drawer?.userInfo);
                      return;
                    }
                    const reply = formRef.current.getFieldFormatValue('reply');
                    const div = document.createElement('div');
                    div.innerHTML = reply;
                    if (div.innerText === '' || div.innerText.replace(/\s*/g, '') === '') {
                      message.warning('请至少回复一句话！');
                      return;
                    }
                    let extra = {};
                    if (doreply?.curid) {
                      extra = { msg_id: doreply?.curid };
                    }
                    // 设置提及人员
                    const other = submitdata?.other?.toString() ?? '';
                    if (doreply?.type == 'edit2') {
                      run({
                        url: '/webtool/v1/msg/' + doreply?.curitemid,
                        params: {
                          ...submitdata,
                          ...extra,
                          other,
                          item_id: drawer?.id,
                          reply,
                        },
                        method: 'PUT',
                      });
                      return;
                    }
                    if (doreply?.type == 'edit1') {
                      run({
                        url: '/webtool/v1/msg/' + doreply?.curid,
                        params: {
                          ...submitdata,
                          other,
                          item_id: drawer?.id,
                          reply,
                        },
                        method: 'PUT',
                      });
                      return;
                    }

                    run({
                      url: '/webtool/v1/msg',
                      params: {
                        ...submitdata,
                        ...extra,
                        other,
                        item_id: drawer?.id,
                        reply,
                        bereply_userid: doreply?.id,
                      },
                    });
                  }}
                >
                  <b>回复</b>
                  &nbsp;
                  {loading ? (
                    <LoadingOutlined></LoadingOutlined>
                  ) : (
                    <SendOutlined style={{ color: '#fff' }} />
                  )}
                </div>
              </div>
            </div>
            <div style={{ padding: "0 4px",flex:1,marginTop:-12 }}>
              <AddReply formRef={formRef}></AddReply>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default Reply;

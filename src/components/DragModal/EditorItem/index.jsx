/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { memo, useMemo } from 'react';
const { useBreakpoint } = Grid;

function EditorItem({ value, onChange, height, serverURL, style, bordered }) {
  const screens = useBreakpoint();
  let UploadFn = (param) => {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('TOKENES');
    const fd = new FormData();
    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: xhr.responseText ? JSON.parse(xhr.responseText)?.url : null,
        meta: {
          id: parseInt(Math.random() * 100000),
          title: param.file.name,
          alt: param.file.name,
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
          poster: 'http://xxx/xx.png', // 指定视频播放器的封面
        },
      });
    };
    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };
    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败',
      });
    };
    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);
    fd.append('file', param.file);
    xhr.open('POST', serverURL ? serverURL : `${REACT_APP_URL}/webtool/upload`, true);
    xhr.setRequestHeader('Authorization', token);
    xhr.send(fd);
  };

  const controls = useMemo(() => {
    if (screens.md) {
      return [
        'undo',
        'redo',
        'separator',
        'font-size',
        'line-height',
        'letter-spacing',
        'separator',
        'text-color',
        'bold',
        'italic',
        'underline',
        'strike-through',
        'separator',
        'superscript',
        'subscript',
        'remove-styles',
        'emoji',
        'separator',
        'text-indent',
        'text-align',
        'separator',
        'headings',
        'list-ul',
        'list-ol',
        'blockquote',
        'code',
        'separator',
        'link',
        'separator',
        'hr',
        'separator',
        'media',
        'separator',
        'clear',
      ];
    } else {
      return [
        'undo',
        'redo',
        'separator',
        'font-size',
        'line-height',
        'separator',
        'text-color',
        'separator',
        'text-align',
        'separator',
        'list-ul',
        'list-ol',
        'separator',
        'link',
        'separator',
        'hr',
        'separator',
        'media',
        'separator',
        'clear',
      ];
    }
  }, [screens]);

  return (
    <div
      style={{
        ...style,
        border: '#ddd solid 1px',
        height: height ? height : 400,
        overflow: 'hidden',
        borderRadius: 12,
      }}
    >
      <BraftEditor
        controls={controls}
        media={{ uploadFn: UploadFn }}
        value={BraftEditor.createEditorState(value)}
        onChange={(val) => {
          onChange(val);
        }}
      />
    </div>
  );
}

export default memo(EditorItem);

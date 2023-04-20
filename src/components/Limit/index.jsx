/* eslint-disable eqeqeq */
import { useModel } from '@umijs/max';
import { Image } from 'antd';
import { useRef,useState  } from 'react';

function Limit({ content, style={} }) {
  const [preview, setpreview] = useState({
    visible: false,
  });
  const containerRef = useRef();

  const handleClick = (e) => {
    if (e.target.tagName !== 'IMG') {
      return;
    }
    let srcarr = [],
      current = 0;
    if (containerRef?.current) {
      const imgTags = containerRef.current.querySelectorAll('img');
      srcarr = Array.from(imgTags)?.map((el, i) => {
        if (el.src === e.target.src) {
          current = i + 1;
        }
        return el.src;
      });
    }
    setpreview((s) => ({
      current: current,
      urls: srcarr,
      visible: true,
    }));
  };

  return (
    <div style={style}>
      <div
        style={{
          display: 'none',
        }}
      >
        <Image.PreviewGroup
          preview={{
            visible: preview?.visible,
            current: preview?.current-1,
            onVisibleChange: (vis) =>
              setpreview((s) => ({
                ...s,
                visible: vis,
              })),
          }}
        >
          {preview?.urls?.map?.((it) => (
            <Image src={it} key={it} />
          ))}
        </Image.PreviewGroup>
      </div>
      <div
        onClick={handleClick}
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: content }}
        className="limit"
      ></div>
    </div>
  );
}

export default Limit;

import { Divider } from 'antd';
import './index.less';
function weather({ weather }) {
  const obj = {
    晴: (
      <div className="icon sunny">
        <div className="sun">
          <div className="rays"></div>
        </div>
      </div>
    ),
    阴: (
      <div className="icon cloudy">
        <div className="cloud"></div>
      </div>
    ),
    霾: (
      <div className="icon cloudy">
        <div className="cloud"></div>
        <div className="cloud"></div>
      </div>
    ),
    雾: (
      <div className="icon cloudy">
        <div className="cloud"></div>
        <div className="cloud"></div>
      </div>
    ),
    云: (
      <div className="icon cloudy">
        <div className="cloud"></div>
        <div className="cloud"></div>
      </div>
    ),
    雷: (
      <div className="icon thunder-storm">
        <div className="cloud"></div>
        <div className="lightning">
          <div className="bolt"></div>
          <div className="bolt"></div>
        </div>
      </div>
    ),
    雪: (
      <div className="icon flurries">
        <div className="cloud"></div>
        <div className="snow">
          <div className="flake"></div>
          <div className="flake"></div>
        </div>
      </div>
    ),
    雨: (
      <div className="icon rainy">
        <div className="cloud"></div>
        <div className="rain"></div>
      </div>
    ),
  };

  return (
    <div className="center">
      {weather?.map((it, i) => {
        if (!it?.value) return null;
        let keyarr = Object.keys(obj);
        let curkey = keyarr.filter((item) => it?.value?.indexOf(item) !== -1)[0];

        return (
          <div
            key={i}
            className="hoverablec"
            style={{ opacity: i === 0 ? 1 : 0.5, cursor: 'pointer' }}
            onClick={() => {
              window.open('https://www.baidu.com/s?wd=%E5%A4%A9%E6%B0%94');
            }}
          >
            <span>{it?.text}</span>
            {obj[curkey]}
            {i === 0 && (
              <Divider type="vertical" style={{ marginRight: 12, height: 20, marginTop: 0}} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default weather;

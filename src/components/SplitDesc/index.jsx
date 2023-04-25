import { ProDescriptions } from "@ant-design/pro-components";
import "./index.less";

function SplitDesc({columns = [], dataSource}) {
    
  return columns?.map?.((it, i) => {
    if (Array.isArray(it)) {
      return <ProDescriptions dataSource={dataSource} columns={it} key={i} />;
    } else {
      return (
        <div className="title" style={{ borderWidth: i == 0 ? 0 : 1 }}>
          {it.title}
        </div>
      );
    }
  });
}

export default SplitDesc;

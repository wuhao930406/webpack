import { Button } from "@mui/material";
import { Popconfirm } from "antd";

function PremButton(props) {
  const { children, btn, pop, access } = props;
  let accesses = access ? ["havePrem"].includes(access) : true;
  //配置按钮权限接口

  return pop ? (
    <Popconfirm
      {...pop}
      disabled={pop?.disabled || !accesses}
      placement="bottomRight"
    >
      <Button
        {...btn}
        disabled={btn?.disabled || !accesses}
        sx={{ minWidth: 44 }}
      >
        {children}
      </Button>
    </Popconfirm>
  ) : (
    <Button
      {...btn}
      disabled={btn?.disabled || !accesses}
      sx={{ minWidth: 44 }}
    >
      {children}
    </Button>
  );
}

export default PremButton;

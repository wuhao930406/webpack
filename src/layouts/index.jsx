import { AlertTitle } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import { Outlet,useModel } from "@umijs/max";
import React from "react";
import ThemeProvider from "./theme";

// 自定义主题
// const { palette } = useTheme();
// const theme = useMemo(() => {
//   return createTheme(curthemeconfig);
// }, [curthemeconfig]);

{
  /* <div style={{ position: "fixed", right: 36, top: 36 }}>
<IconButton
    onClick={() => {
    if (curthemeconfig.palette.mode == "dark") {
        dispatch(changetheme("lightTheme"));
    } else {
        dispatch(changetheme("darkTheme"));
    }
    }}
>
    {curthemeconfig.palette.mode !== "dark" ? (
    <WbSunnyIcon style={{ color: "#ff9900" }}></WbSunnyIcon>
    ) : (
    <DarkModeIcon></DarkModeIcon>
    )}
</IconButton>
</div>  */
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const handleClose = (event) => {
    setInitialState((s) => ({
      ...s,
      message: {
        ...message,
        open: false,
      },
    }));
  };

  const {
    initialState: { message },
    setInitialState,
  } = useModel("@@initialState");

  return (
    <ThemeProvider>
      <CssBaseline />
      <Snackbar
        open={message?.open}
        TransitionComponent={(props) => <Slide {...props} direction="left" />}
        {...message?.snackbar}
        onClose={handleClose}
      >
        <Alert
          severity={message?.type}
          onClose={handleClose}
          {...message.alert}
        >
          {message?.title ? <AlertTitle>{message?.title}</AlertTitle> : null}
          {message?.content}
        </Alert>
      </Snackbar>
      <Outlet />
    </ThemeProvider>
  );
}

export default App;

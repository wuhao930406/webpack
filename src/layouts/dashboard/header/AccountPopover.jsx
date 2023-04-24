import DraggableDialog from "@/components/DraggableDialog";
import InitForm from "@/components/InitForm";
import { doFetch } from "@/utils/doFetch";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useModel, useNavigate } from "@umijs/max";
import { useRequest } from "ahooks";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import ECB from "crypto-js/mode-ecb";
import Pkcs7 from "crypto-js/pad-pkcs7";
import dayjs from "dayjs";
import { useState } from "react";
import { message } from 'antd';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "修改密码",
    type: "pwd",
  },
  {
    label: "个人信息",
    type: "info",
  },
];

const columnes = [
  {
    title: "旧密码",
    dataIndex: "password",
    key: "password",
    valueType: "password",
    colProps: {
      span: 24,
    },
    formItemProps: {
      rules: [
        {
          required: true,
          message: "此项为必填项",
        },
      ],
    },
  },
  {
    title: "新密码",
    dataIndex: "newPassword",
    key: "newPassword",
    valueType: "password",
    colProps: {
      span: 24,
    },
    formItemProps: {
      rules: [
        {
          required: true,
          message: "此项为必填项",
        },
      ],
    },
  },
  {
    title: "确认新密码",
    dataIndex: "confirmNewPassword",
    key: "confirmNewPassword",
    valueType: "password",
    colProps: {
      span: 24,
    },
    formItemProps: {
      dependencies: ["newPassword"],
      rules: [
        {
          required: true,
          message: "此项为必填项",
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue("newPassword") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("两次密码不一致!"));
          },
        }),
      ],
    },
  },
];

export default function AccountPopover() {
  const [open, setOpen] = useState(null);

  const [dialogprops, setdialogprops] = useState({
    open: false,
  });

  const {
    initialState: { currentUser },
    setInitialState,
  } = useModel("@@initialState");

  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (path) => {
    setOpen(null);
    if (path === "/user/login") {
      doFetch({ url: "/system/logout", params: {} }).then((res) => {
        console.log(res);
        if (res?.code === "0000") {
          path && navigate(path);
        }
      });
      return;
    }
    path && navigate(path);
  };
  const handleClosed = () => {
    setdialogprops({
      open: false,
    });
  };

  const { runAsync, loading } = useRequest(doFetch, {
    manual: true,
    onSuccess: (res, parames) => {
      if (res?.code == "0000") {
        handleClosed();
        handleClose("/user/login");
        message.success("操作成功");
      }
    },
  });

  return (
    <>
      <DraggableDialog
        handleClose={handleClosed}
        loading={loading}
        dialogprops={dialogprops}
      >
        <InitForm
          fields={columnes}
          onFinish={(val, extra) => {
            const { password, newPassword } = val;
            let timestamp = dayjs().valueOf().toString() + "acb";
            let newtimestamp = AES.encrypt(
              timestamp,
              Utf8.parse("NANGAODEAESKEY--"),
              {
                mode: ECB,
                padding: Pkcs7,
              }
            ).toString();
            let passwordsrc = AES.encrypt(password, Utf8.parse(timestamp), {
              mode: ECB,
              padding: Pkcs7,
            }).toString();
            let newPasswordsrc = AES.encrypt(
              newPassword,
              Utf8.parse(timestamp),
              {
                mode: ECB,
                padding: Pkcs7,
              }
            ).toString();

            let postdata = {
              encryptKey: newtimestamp,
              password: passwordsrc,
              newPassword: newPasswordsrc,
            };
            runAsync({
              url: "/system/updatePassword",
              params: postdata,
            });
          }}
        ></InitForm>
      </DraggableDialog>
      <IconButton onClick={handleOpen}>
        <SettingsIcon></SettingsIcon>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {currentUser?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {currentUser?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => {
                if (option.type === "pwd") {
                  setOpen(null);
                  setdialogprops((s) => ({
                    ...s,
                    open: true,
                    title: "修改密码",
                  }));
                } else {
                  handleClose("/work/usercenter");
                }
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          onClick={() => {
            handleClose("/user/login");
          }}
          sx={{ m: 1 }}
        >
          退出登录
        </MenuItem>
      </Popover>
    </>
  );
}

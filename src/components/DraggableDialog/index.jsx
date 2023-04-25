import { SendOutlined } from "@ant-design/icons";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import React from "react";
import Draggable from "react-draggable";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog({
  children,
  dialogprops,
  handleClose,
  loading,
  formdom,
  maxWidth,
}) {
  const formRef = React.useRef();

  return (
    <div>
      <Dialog
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        TransitionComponent={Transition}
        maxWidth={maxWidth ?? "xs"}
        fullWidth
        {...dialogprops}
        //keepMounted
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {dialogprops?.title}
        </DialogTitle>
        <DialogContent>
          {children &&
            React.cloneElement(children, { submitter: false, formRef })}
          {formdom &&
            React.cloneElement(formdom, { submitter: false, formRef })}
        </DialogContent>
        {dialogprops?.footer === false ? null : (
          <DialogActions>
            <Button
              type="reset"
              key="rest"
              onClick={() => {
                formRef?.current?.resetFields();
              }}
            >
              重置
            </Button>
            <LoadingButton
              type="submit"
              key="submit"
              variant="contained"
              loading={loading}
              loadingPosition="start"
              startIcon={<SendOutlined />}
              onClick={() => {
                console.log(formRef?.current?.submit());
              }}
            >
              提交
            </LoadingButton>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}

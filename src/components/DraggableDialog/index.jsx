import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import * as React from "react";
import Draggable from "react-draggable";
import Slide from '@mui/material/Slide';

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

export default function DraggableDialog({ children, config={} }) {
  const [open, setOpen] = React.useState(false);
  const [formdom, setformdom] = React.useState(null);
  const formRef = React.useRef();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {Object.keys(config)?.map((it, i) => (
        <Button
          key={it}
          variant="contained"
          {...it.btn}
          onClick={() => {
            setOpen(true)
            setformdom(config[it]);
          }}
        >
          {config[it]?.title}
        </Button>
      ))}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        sx={{marginTop:"-20vh"}}
        //keepMounted
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {formdom?.title}
        </DialogTitle>
        <DialogContent>
          {children && React.cloneElement(children, { submitter: false, formRef })}
          {formdom && React.cloneElement(formdom?.component, { submitter: false, formRef }) }
        </DialogContent>
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
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            onClick={() => () => {
              formRef?.current?.submit();
            }}
          >
            提交
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

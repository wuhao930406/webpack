import { Modal } from 'antd';
import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
const DragModal = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };


  return (
    <Modal
      {...props}
      footer={false}
      destroyOnClose
    >
      {props?.children}
    </Modal>
  );
};
export default DragModal;

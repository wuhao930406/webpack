'use strict';

import { useState } from 'react';
import { TwitterPicker } from 'react-color';
import reactCSS from 'reactcss';

let ColorPicker = ({ color, handleChange }) => {
  const [displayColorPicker, setdisplayColorPicker] = useState();
  let handleClick = () => {
      setdisplayColorPicker(!displayColorPicker);
    },
    handleClose = () => {
      setdisplayColorPicker(false);
    };
  const styles = reactCSS({
    default: {
      color: {
        width: '14px',
        height: '14px',
        borderRadius: '14px',
        background: color,
      },
      swatch: {
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
        left: -7,
        top: 38,
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <div style={{marginRight:4,position:"relative"}}>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <TwitterPicker color={color} onChangeComplete={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;

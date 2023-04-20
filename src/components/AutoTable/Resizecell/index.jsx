import React, { Component } from 'react';
import { Resizable } from 'react-resizable';

function Resizecell({ onResize, onResizeStop, width, onClick, ...restProps }) {
  return (
    <Resizable width={width ?? 1} height={0} onResize={onResize} onResizeStop={onResizeStop}>
      <th {...restProps} />
    </Resizable>
  );
}

export default Resizecell;

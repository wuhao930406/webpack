import React from 'react';

function highlightText(originalText, keyword) {
  const regex = new RegExp(`(${keyword})`, 'gi');
  return originalText.replace(regex, "<span style='color:#ff4800'>$1</span>");
}

function Highlighter({ children, keyword }) {
  const html = keyword ? highlightText(children, keyword) : children;

  const handleClick = (e) => {
    console.log('====================================');
    console.log(e.target.src);
    console.log('====================================');
    console.log('====================================');
    console.log(e);
    console.log('====================================');
  };

  if (typeof children === 'string') {
    return (
      <div onClick={handleClick} className="limit" dangerouslySetInnerHTML={{ __html: html }} />
    );
  }

  const clonedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return (
        <div onClick={handleClick} className="limit" dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
    return child;
  });

  return <div>{clonedChildren}</div>;
}

export default Highlighter;

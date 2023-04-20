import { useEffect, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Input, message, Space, Tag, theme, Tooltip } from 'antd';
import { useRef } from 'react';
import ColorPicker from './colorpicker';

const Tagadder = ({ value = [{ color: '#13c2c2', text: '123' }], onChange, max }) => {
  const { token } = theme.useToken();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag) => {
    const newTags = value.filter((tag) => tag.text !== removedTag);
    onChange(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (!inputValue || inputValue.replace(/\s/g, '') === '') {
      message.destroy();
      message.error('标签不可为空字符！');
      setInputVisible(false);
      return;
    }
    if (inputValue && value?.map((it) => it.text).indexOf(inputValue) === -1) {
      onChange([
        ...value,
        {
          color: '#13c2c2',
          text: inputValue,
          tag_name: inputValue,
        },
      ]);
    } else {
      if (inputValue) message.warning('已存在的标签名！');
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    if (!editInputValue || editInputValue.replace(/\s/g, '') === '') {
      message.destroy();
      message.error('标签不可为空字符！');
      return;
    }
    if (
      editInputValue &&
      value
        ?.filter((it, i) => i !== editInputIndex)
        .map((it) => it.text)
        .indexOf(editInputValue) === -1
    ) {
      const newTags = [...value];
      newTags[editInputIndex] = {
        ...newTags[editInputIndex],
        text: editInputValue,
      };
      onChange(newTags);
      setEditInputIndex(-1);
      setInputValue('');
    } else {
      message.warning('已存在的标签名！');
    }
  };

  const tagInputStyle = {
    width: 78,
    verticalAlign: 'top',
  };
  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: 'dashed',
  };
  return (
    <Space size={[0, 8]} wrap style={{ paddingTop: 4, justifyContent: 'flex-start' }}>
      {value.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              style={tagInputStyle}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag?.text?.length > 20;
        const tagElem = (
          <Tag
            key={tag.text}
            closable
            style={{
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
            onClose={() => handleClose(tag.text)}
          >
            <ColorPicker
              color={tag.color}
              handleChange={(val) => {
                let newval = JSON.parse(JSON.stringify(value));
                newval = newval?.map((it, i) => {
                  if (index === i) {
                    it.color = val.hex;
                  }
                  return it;
                });
                onChange(newval);
              }}
            ></ColorPicker>
            <span
              onDoubleClick={(e) => {
                setEditInputIndex(index);
                setEditInputValue(tag.text);
                e.preventDefault();
              }}
            >
              {isLongTag ? `${tag.text.slice(0, 20)}...` : tag.text}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag.text} key={tag.text}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        value.length < max &&
        editInputIndex === -1 && (
          <Tag style={tagPlusStyle} onClick={showInput}>
            <PlusOutlined /> 新建标签
          </Tag>
        )
      )}
    </Space>
  );
};
export default Tagadder;

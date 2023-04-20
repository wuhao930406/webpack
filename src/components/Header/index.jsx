import { doFetch } from '@/utils/doFetch';
import { Avatar, message, Upload } from 'antd';

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const Header = ({ currentUser, run }) => {
  const imageUrl = currentUser?.head_url ?? null;

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      doFetch({
        url: `/webtool/v1/user/${currentUser?.id}`,
        params: { head_url: info?.file?.response?.url ?? null },
        method: 'PUT',
      }).then((res) => {
        if (res?.code === 0) {
          run();
        }
      });
    }
  };

  const uploadButton = (
    <Avatar size={45} style={{ flexShrink: 0 }}>
      {currentUser?.user_name?.charAt(0)}
    </Avatar>
  );

  const token = localStorage.getItem('TOKENES');

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action={`${REACT_APP_URL}/webtool/upload`}
      headers={{
        Authorization: token,
      }}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? <Avatar size={45} style={{ flexShrink: 0 }} src={imageUrl} /> : uploadButton}
    </Upload>
  );
};
export default Header;

import { doFetch } from "@/utils/doFetch";
import { LoadingOutlined } from "@ant-design/icons";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";

import { Typography } from "@mui/material";
import "./index.less";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg" ||
    file.type === "image/svg" ||
    file.type === "image/gif";
  if (!isJpgOrPng) {
    message.error("仅可以上传 JPG/PNG/GIF/JPEG/SVG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片必须小于 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const Head = ({ defaultImg, dofetchUserInfo }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(defaultImg);
  let token = localStorage.getItem("TOKENES");

  const handleChange = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      const { response } = info.file;
      const data = response?.data?.dataList ?? {};
      let res = await doFetch({
        url: "/user/updateHeadPortrait",
        params: {
          pic: data,
        },
      });
      if (res.code === "0000") {
        setLoading(false);
        setImageUrl(data[0]?.url);
        await dofetchUserInfo();
      }
    }
  };

  const uploadButton = (
    <div
      className="hoverable"
      style={{
        position: "relative",
        background: `url(${DEFAULT_HEAD_IMG}) no-repeat center`,
        backgroundSize: "contain",
        width: "88%",
        height: "88%",
        borderRadius: 888,
      }}
    >
      {loading && (
        <div
          className="center"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: 888,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <LoadingOutlined style={{ color: "#fff" }} />
        </div>
      )}
      <div
        className="mask"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: 888,
        }}
      >
        <AddAPhotoIcon></AddAPhotoIcon>
        <Typography variant="b" fontSize={12} mt={1}>
          上传头像
        </Typography>
      </div>
    </div>
  );

  const UploadImage = ({ src }) => (
    <div
      className="hoverable"
      style={{
        position: "relative",
        background: `url(${DEFAULT_HEAD_IMG}) no-repeat center`,
        backgroundSize: "contain",
        width: "88%",
        height: "88%",
        borderRadius: 888,
      }}
    >
      {src && (
        <div
          className="center"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: 888,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <img src={src} alt="" style={{ borderRadius: 112 }} />
        </div>
      )}
      <div
        className="mask"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: 888,
        }}
      >
        <AddAPhotoIcon></AddAPhotoIcon>
        <Typography variant="b" fontSize={12} mt={1}>
          上传头像
        </Typography>
      </div>
    </div>
  );

  return (
    <div className="diystyle">
      <ImgCrop
        rotate
        grid
        showReset
        quality={1}
        shape={"rect"} //裁切区域形状，'rect' 或 'round'
        aspect={1 / 1} //裁切区域宽高比，width / height
        beforeCrop={(file) => {
          if (file.type !== "image/gif") {
            return true;
          }
        }}
      >
        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          action={REACT_APP_URL + "/file/upload"}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          headers={{ token }}
        >
          {imageUrl ? <UploadImage src={imageUrl} /> : uploadButton}
        </Upload>
      </ImgCrop>
    </div>
  );
};
export default Head;

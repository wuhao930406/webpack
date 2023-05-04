import PropTypes from "prop-types";
// @mui
import {
  Box,
  Card,
  colors,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// utils
// components
import IconFont from "@/components/IconFont";
import Label from "@/components/label";
import difftime from "@/utils/difftime";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { useState } from "react";

// ----------------------------------------------------------------------

const StyledProductImg = styled("img")({
  top: 0,
  width: "92%",
  height: "92%",
  marginTop: "4%",
  objectFit: "cover",
  position: "absolute",
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product, remove, edit, publish }) {
  const { courseName, picUrl, createTime, statusName, type } = product;
  const [confirm, setconfirm] = useState(false);
  const [shut, setshut] = useState(false);

  return (
    <Card sx={{ borderRadius: 3 }} className="hovered" id="jikl">
      <Box sx={{ pt: "66%", position: "relative" }} className="center">
        {statusName && (
          <Label
            variant="filled"
            color={(statusName === "sale" && "error") || "info"}
            sx={{
              zIndex: 9,
              top: 20,
              left: 20,
              position: "absolute",
              textTransform: "uppercase",
            }}
          >
            {statusName}
          </Label>
        )}
        <StyledProductImg
          alt={courseName}
          src={picUrl ?? DEFAULT_404_IMG}
          sx={{ borderRadius: 2 }}
        />

        <Box
          className="actionhover"
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <Box className="masker"></Box>
          <Box className="edit">
            <Tooltip title="编辑">
              <IconButton
                onClick={() => {
                  edit(product);
                }}
              >
                <EditIcon
                  style={{ fontSize: 20, color: colors.blue[200] }}
                ></EditIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title={confirm ? "确认删除" : "删除"}>
              {confirm ? (
                <IconButton
                  disabled={confirm === "1"}
                  onClick={() => {
                    remove(product);
                  }}
                >
                  <CheckIcon
                    style={{
                      fontSize: 20,
                      color:
                        confirm === "1" ? colors.grey[500] : colors.green[500],
                    }}
                  ></CheckIcon>
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setconfirm("1");

                    setTimeout(() => {
                      setconfirm(true);
                    }, 1000);

                    setTimeout(() => {
                      setconfirm(false);
                    }, 3000);
                  }}
                >
                  <DeleteIcon
                    style={{ fontSize: 20, color: colors.red[500] }}
                  ></DeleteIcon>
                </IconButton>
              )}
            </Tooltip>
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-around"
            width={"100%"}
            className="stackani"
          >
            <Tooltip title="备课">
              <IconButton>
                <IconFont
                  type="icon-beike"
                  style={{ fontSize: 20, color: "#ffffff" }}
                ></IconFont>
              </IconButton>
            </Tooltip>
            <Tooltip title="授权">
              <IconButton>
                <IconFont
                  type="icon-shouquanguanli"
                  style={{ fontSize: 20, color: "#ffffff" }}
                ></IconFont>
              </IconButton>
            </Tooltip>
            {type == 3 ? null : (
              <Tooltip title={type == 1 ? "发布" : type == 2 ? "取消发布" : ""}>
                <IconButton
                  onClick={() => {
                    publish(product);
                  }}
                >
                  {type == 1 ? (
                    <IconFont
                      type="icon-fabu"
                      style={{ fontSize: 20, color: "#ffffff" }}
                    ></IconFont>
                  ) : (
                    <IconFont
                      type="icon-undo"
                      style={{ fontSize: 20, color: "#ffffff" }}
                    ></IconFont>
                  )}
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="复制创建">
              <IconButton>
                <IconFont
                  type="icon-fuzhi"
                  style={{ fontSize: 20, color: "#ffffff" }}
                ></IconFont>
              </IconButton>
            </Tooltip>

            {type == 2 && (
              <Tooltip title={shut ? "确认关闭" : "关闭"}>
                {shut ? (
                  <IconButton
                    disabled={shut === "1"}
                    onClick={() => {
                      publish(product, { type: 3 });
                    }}
                  >
                    <CheckIcon
                      style={{
                        fontSize: 20,
                        color:
                          shut === "1" ? colors.grey[500] : colors.green[500],
                      }}
                    ></CheckIcon>
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      setshut("1");

                      setTimeout(() => {
                        setshut(true);
                      }, 1000);

                      setTimeout(() => {
                        setshut(false);
                      }, 3000);
                    }}
                  >
                    <IconFont
                      type="icon-guanbi"
                      style={{ fontSize: 20, color: "#ffffff" }}
                    ></IconFont>
                  </IconButton>
                )}
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          width={"100%"}
          overflow={"hidden"}
          alignItems={"center"}
        >
          <Typography variant="subtitle2" noWrap>
            {courseName}
          </Typography>
          <Box width={60} textAlign={"right"} flexShrink={0}>
            <Tooltip title={createTime}>
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: "text.disabled",
                }}
              >
                {difftime(dayjs(), dayjs(createTime))}
              </Typography>
            </Tooltip>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}

import PropTypes from "prop-types";
// @mui
import {
  Box,
  Card,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// utils
import { fCurrency } from "@/utils/formatNumber";
// components
import IconFont from "@/components/IconFont";

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

ShopProductLoadingCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductLoadingCard({ product, loading }) {
  const { courseName, picUrl, price, status, priceSale } = product;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <Box sx={{ pt: "66%", position: "relative" }} className="center">
        <Skeleton
          variant="rectangular"
          width={"92%"}
          height={"92%"}
          sx={{ position: "absolute",top: '8%',borderRadius: 2 }}
          animation="wave"
        />
      </Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        <Skeleton animation="wave"/>
      </Stack>
    </Card>
  );
}

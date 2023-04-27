import PropTypes from "prop-types";
// @mui
import {
  Box,
  Card,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// utils
import { fCurrency } from "@/utils/formatNumber";
// components
import IconFont from "@/components/IconFont";
import Label from "@/components/label";

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

export default function ShopProductCard({ product }) {
  const { name, cover, price, colors, status, priceSale } = product;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <Box sx={{ pt: "66%", position: "relative" }} className="center">
        {status && (
          <Label
            variant="filled"
            color={(status === "sale" && "error") || "info"}
            sx={{
              zIndex: 9,
              top: 20,
              right: 20,
              position: "absolute",
              textTransform: "uppercase",
            }}
          >
            {status}
          </Label>
        )}
        <StyledProductImg alt={name} src={cover} sx={{ borderRadius: 2 }} />
      </Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Tooltip title="备课">
            <IconButton>
              <IconFont type="icon-beike"></IconFont>
            </IconButton>
          </Tooltip>

          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: "text.disabled",
                textDecoration: "line-through",
              }}
            >
              {priceSale && fCurrency(priceSale)}
            </Typography>
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

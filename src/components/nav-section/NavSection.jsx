import PropTypes from "prop-types";
import { NavLink as RouterLink } from "react-router-dom";
// @mui
import { Box, List, ListItemText, Typography } from "@mui/material";
//
import { StyledNavItem, StyledNavItemIcon } from "./styles";

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], collspan, ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => {
          if (item.children) {
            return (
              <Box
                key={item.title}
                sx={{
                  pb:1.2
                }}
              >
                <Typography component="div" sx={{ pl: collspan?0:2.3, pt: 2, pb: 1,fontSize:"14px" }} align={collspan?"center":"left"}>
                  {item.title}
                </Typography>
                {item.children.map((item) => (
                  <NavItem collspan={collspan} key={item.title} item={item} />
                ))}
              </Box>
            );
          } else {
            return <NavItem collspan={collspan} key={item.title} item={item} />;
          }
        })}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item, collspan }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: !collspan ? "row" : "column",
        margin: "6px 0",
        pt: !collspan ? 1 : 1.5,
        "&.active": {
          color: "text.primary",
          bgcolor: "action.selected",
          fontWeight: "fontWeightBold",
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
      <ListItemText disableTypography primary={title} sx={{ pb: 0 }} />
      <Box sx={!collspan ? {} : { position: "absolute", right: 0, top: 0 }}>
        {info && info}
      </Box>
    </StyledNavItem>
  );
}

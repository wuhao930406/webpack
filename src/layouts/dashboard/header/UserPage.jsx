import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { useLocation } from "@umijs/max";
import navConfig from "../nav/config";

export default function UserPage() {
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const location = useLocation();
  console.log("====================================");
  console.log(location.pathname);
  console.log("====================================");

  const data = React.useMemo(() => {
    const currouteconfig = navConfig?.filter((it, i) => {
      return it?.path === location?.pathname;
    });
    return currouteconfig[0]?.children ?? [];
  }, [location.pathname]);

  return (
    <Container maxWidth="xl">
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
        sx={{ height: 64,ml:"-16px" }}
      >
        {data?.map((it, i) => (
          <Tab
            value={it?.path+i}
            label={it?.title}
            sx={{ height: 64, margin: "0 6px" }}
            key={i}
          />
        ))}
      </Tabs>
    </Container>
  );
}

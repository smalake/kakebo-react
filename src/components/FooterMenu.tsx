import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation, useNavigate } from "react-router-dom";

export const FooterMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  useEffect(() => {
    setValue(location.pathname.split("-private")[0]);
  }, [location.pathname]);

  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: "0" }}>
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        <BottomNavigationAction label="入力" value="/event-register" icon={<EditIcon />} />
        <BottomNavigationAction label="カレンダー" value="/calendar" icon={<CalendarMonthIcon />} />
        <BottomNavigationAction label="グラフ" value="/graph" icon={<EqualizerIcon />} />
        <BottomNavigationAction label="設定" value="/setting" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Box>
  );
};

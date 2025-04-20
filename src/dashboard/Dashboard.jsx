import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Grid,
  Paper,
  Box,
  styled,
  List,
  ListItem,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SummarizeIcon from "@mui/icons-material/Summarize";
import DescriptionIcon from "@mui/icons-material/Description";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import EventIcon from "@mui/icons-material/Event";
import MapIcon from "@mui/icons-material/Map";
import DevicesIcon from "@mui/icons-material/Devices";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import TimelineIcon from "@mui/icons-material/Timeline";
import SpeedIcon from "@mui/icons-material/Speed";
import BarChartIcon from "@mui/icons-material/BarChart";
import RouteIcon from "@mui/icons-material/Route";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirIcon from "@mui/icons-material/Air";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NoCrashIcon from "@mui/icons-material/NoCrash";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import CommuteIcon from "@mui/icons-material/Commute";
import UpdateIcon from "@mui/icons-material/Update";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FmdGoodIcon from "@mui/icons-material/FmdGood";

import MainMap from "../main/MainMap";

const themeColors = {
  background: "#F4F6F8",
  paper: "#FFFFFF",
  textPrimary: "#263238",
  textSecondary: "#546E7A",
  accentBlue: "#1976D2",
  accentGreen: "#388E3C",
  accentRed: "#D32F2F",
  accentYellow: "#FFC107",
  accentOrange: "#FF9800",
  divider: "rgba(0, 0, 0, 0.12)",
};

const StyledNavbarButton = styled(Button)(({ theme }) => ({
  color: themeColors.textPrimary,
  textTransform: "none",
  margin: theme.spacing(0, 1),
  "& .MuiListItemIcon-root": {
    color: "inherit",
    minWidth: "auto",
    marginRight: theme.spacing(1),
  },
}));
const StyledUserSection = styled(Box)(({ theme }) => ({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  color: themeColors.textPrimary,
}));

const DashboardMenuItem = ({ icon, primary, to, onClick, ...props }) => (
  <MenuItem
    component={Link}
    to={to}
    onClick={onClick}
    {...props}
    sx={{
      color: themeColors.textPrimary,
      "& .MuiListItemIcon-root": { color: themeColors.textSecondary },
      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
    }}
  >
    <ListItemIcon>{icon}</ListItemIcon> <ListItemText primary={primary} />
  </MenuItem>
);

const formatAttributeKey = (key) => {
  switch (key) {
    case "batteryLevel":
      return "แบตเตอรี่";
    case "distance":
      return "ระยะทาง";
    case "totalDistance":
      return "ระยะทางรวม";
    case "motion":
      return "เคลื่อนไหว";
    default:
      return key;
  }
};
const formatAttributeValue = (key, value) => {
  if (value === null || value === undefined) return "N/A";
  switch (key) {
    case "batteryLevel":
      return `${value}%`;
    case "distance":
    case "totalDistance":
      return !isNaN(parseFloat(value))
        ? `${(parseFloat(value) / 1000).toFixed(2)} กม.`
        : "0.00 กม.";
    case "motion":
      return value ? "ใช่" : "ไม่";
    case "speed":
      return !isNaN(parseFloat(value))
        ? `${(parseFloat(value) * 1.852).toFixed(1)} กม/ชม`
        : "N/A";
    default:
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
  }
};
const formatCurrentTime = (date) =>
  date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
const formatCurrentDate = (date) => {
  const year = date.getFullYear() + 543;
  const month = date.toLocaleDateString("th-TH", { month: "short" });
  const day = date.toLocaleDateString("th-TH", { day: "2-digit" });
  return `${day} ${month} ${year}`;
};
const getPm25Style = (pm25Value) => {
  if (pm25Value === null || pm25Value === undefined || isNaN(pm25Value))
    return { text: "N/A", color: themeColors.textSecondary };
  if (pm25Value <= 25) return { text: "ดีมาก", color: themeColors.accentBlue };
  if (pm25Value <= 37) return { text: "ดี", color: themeColors.accentGreen };
  if (pm25Value <= 50)
    return { text: "ปานกลาง", color: themeColors.accentYellow };
  if (pm25Value <= 90)
    return { text: "เริ่มมีผลกระทบต่อสุขภาพ", color: themeColors.accentOrange };
  return { text: "มีผลกระทบต่อสุขภาพ", color: themeColors.accentRed };
};

const KpiCard = ({ title, value, icon, color = themeColors.textPrimary }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2.5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      backgroundColor: themeColors.paper,
      color: themeColors.textPrimary,
      borderRadius: 2,
      minHeight: 120,
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
      {icon &&
        React.cloneElement(icon, { sx: { fontSize: "1.8rem", color: color } })}
      <Typography variant="body1" sx={{ color: themeColors.textSecondary }}>
        {" "}
        {title}{" "}
      </Typography>
    </Stack>
    <Typography
      variant="h4"
      component="div"
      fontWeight="bold"
      sx={{ color: color, mt: "auto", wordBreak: "break-word" }}
    >
      {" "}
      {value}{" "}
    </Typography>
  </Paper>
);

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportsAnchorEl, setReportsAnchorEl] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    devices: [],
    latestPositions: {},
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({
    temp: null,
    description: "N/A",
    icon: null,
  });
  const [aqiData, setAqiData] = useState({ pm25: null });
  const [selectedDeviceId, setSelectedDeviceId] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("");

  const isMenuOpen = Boolean(anchorEl);
  const isReportsOpen = Boolean(reportsAnchorEl);

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    console.log(`Workspaceing (add auth if needed): ${url}`);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        console.error(`Error fetching ${url}: Status ${response.status}`);
        if (response.status === 401)
          console.error("Unauthorized access attempt.");
        return response;
      }
      return response;
    } catch (error) {
      console.error(`Network error fetching ${url}:`, error);
      throw error;
    }
  }, []);

  const fetchWeatherData = useCallback(async () => {
    const WEATHER_API_KEY = "5ba36ee34feeb91ab1749bdee693a210";
    if (!WEATHER_API_KEY || WEATHER_API_KEY === "API") {
      console.warn("Weather API Key missing");
      setWeatherData({ temp: null, description: "No API Key", icon: null });
      return;
    }
    const LAT = 13.8970327;
    const LON = 100.5892159;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${WEATHER_API_KEY}&units=metric&lang=th`;
    try {
      const response = await fetch(weatherUrl);
      if (!response.ok) {
        console.warn(`Weather fetch failed: ${response.status}`);
        setWeatherData({ temp: null, description: "Load Failed", icon: null });
        return;
      }
      const data = await response.json();
      setWeatherData({
        temp: data.main?.temp,
        description: data.weather?.[0]?.description || "N/A",
        icon: data.weather?.[0]?.icon,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData({ temp: null, description: "Fetch Error", icon: null });
    }
  }, []);

  const fetchAqiData = useCallback(async () => {
    const AQI_API_KEY = "5ba36ee34feeb91ab1749bdee693a210";
    if (!AQI_API_KEY || AQI_API_KEY === "API") {
      console.warn("AQI API Key missing");
      setAqiData({ pm25: null });
      return;
    }
    const LAT = 13.8970327;
    const LON = 100.5892159;
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${AQI_API_KEY}`;
    try {
      const response = await fetch(aqiUrl);
      if (!response.ok) {
        console.warn(`AQI fetch failed: ${response.status}`);
        setAqiData({ pm25: null });
        return;
      }
      const data = await response.json();
      setAqiData({ pm25: data.list?.[0]?.components?.pm2_5 });
    } catch (error) {
      console.error("Error fetching AQI data:", error);
      setAqiData({ pm25: null });
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth("/api/session");
        if (!response.ok) {
          console.warn(`User session fetch failed: ${response.status}.`);
          setUserData(null);
          return;
        }
        setUserData(await response.json());
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    };

    const fetchDashboardData = async (isInitialLoad = false) => {
      if (isInitialLoad) setLoading(true);
      let currentDevices = [];
      try {
        const devicesResponse = await fetchWithAuth("/api/devices");
        if (!devicesResponse.ok) {
          console.error(`Error fetching devices: ${devicesResponse.status}`);
          if (isInitialLoad) setLoading(false);
          return;
        }
        const devicesData = await devicesResponse.json();
        currentDevices = Array.isArray(devicesData) ? devicesData : [];

        if (currentDevices.length === 0) {
          console.log("No devices found.");
          setDashboardData({ devices: [], latestPositions: {} });
          if (isInitialLoad) setLoading(false);
          return;
        }

        const positionPromises = currentDevices.map((device) =>
          fetchWithAuth(`/api/positions?deviceId=${device.id}&limit=1`)
            .then(async (res) => {
              if (!res.ok) {
                console.warn(
                  `Positions fetch failed for device ${device.id}: ${res.status}`
                );
                return { deviceId: device.id, position: null };
              }
              const contentType = res.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const positions = await res.json();
                const latestPosition =
                  Array.isArray(positions) && positions.length > 0
                    ? positions[0]
                    : null;
                return { deviceId: device.id, position: latestPosition };
              } else {
                console.warn(
                  `Non-JSON response received for positions of device ${device.id}.`
                );
                return { deviceId: device.id, position: null };
              }
            })
            .catch((error) => {
              console.error(
                `Network error fetching positions for device ${device.id}:`,
                error
              );
              return { deviceId: device.id, position: null };
            })
        );
        const positionResults = await Promise.all(positionPromises);
        const latestPositionsMap = positionResults.reduce((acc, result) => {
          if (result.position) acc[result.deviceId] = result.position;
          return acc;
        }, {});
        setDashboardData({
          devices: currentDevices,
          latestPositions: latestPositionsMap,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        if (isInitialLoad) setLoading(false);
      }
    };

    fetchUserData();
    fetchDashboardData(true);
    fetchWeatherData();
    fetchAqiData();

    const dataRefreshInterval = 30000;
    const weatherRefreshInterval = 900000;
    const timeRefreshInterval = 1000;

    const dashboardIntervalId = setInterval(
      () => fetchDashboardData(false),
      dataRefreshInterval
    );
    const timeIntervalId = setInterval(
      () => setCurrentTime(new Date()),
      timeRefreshInterval
    );
    const weatherIntervalId = setInterval(() => {
      fetchWeatherData();
      fetchAqiData();
    }, weatherRefreshInterval);

    return () => {
      clearInterval(dashboardIntervalId);
      clearInterval(timeIntervalId);
      clearInterval(weatherIntervalId);
    };
  }, [fetchWithAuth, fetchWeatherData, fetchAqiData]);

  const onlineCount = useMemo(() => {
    return dashboardData.devices.filter((d) => d.status === "online").length;
  }, [dashboardData.devices]);

  const offlineCount = useMemo(() => {
    return dashboardData.devices.length - onlineCount;
  }, [dashboardData.devices.length, onlineCount]);

  const { deviceRanking, totalDistanceAllDevices } = useMemo(() => {
    let totalDistanceSum = 0;
    const ranked = [...dashboardData.devices]
      .map((device) => {
        const position = dashboardData.latestPositions[device.id];
        const totalDistance = position?.attributes?.totalDistance ?? 0;
        const numericDistance = !isNaN(parseFloat(totalDistance))
          ? parseFloat(totalDistance)
          : 0;
        if (!isNaN(numericDistance)) totalDistanceSum += numericDistance;
        return { ...device, totalDistance: numericDistance };
      })
      .filter((device) => device.totalDistance > 0)
      .sort((a, b) => b.totalDistance - a.totalDistance)
      .slice(0, 5);
    const formattedTotalDistance = formatAttributeValue(
      "totalDistance",
      totalDistanceSum
    );
    return {
      deviceRanking: ranked,
      totalDistanceAllDevices: formattedTotalDistance,
    };
  }, [dashboardData.devices, dashboardData.latestPositions]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleReportsOpen = (event) => setReportsAnchorEl(event.currentTarget);
  const handleReportsClose = () => setReportsAnchorEl(null);
  const mapPositions = useMemo(
    () =>
      Object.values(dashboardData.latestPositions).filter(
        (p) =>
          p && typeof p.latitude === "number" && typeof p.longitude === "number"
      ),
    [dashboardData.latestPositions]
  );
  const mapSelectedPosition = null;
  const handleMapEventsClick = useCallback(
    () => console.log("Map Events Clicked"),
    []
  );
  const pm25Style = useMemo(() => getPm25Style(aqiData.pm25), [aqiData.pm25]);

  const handleDeviceChange = (event) => {
    const deviceId = event.target.value;
    console.log("Selected Device ID:", deviceId);
    setSelectedDeviceId(deviceId);
  };

  const handleTimeRangeChange = (event) => {
    const timeValue = event.target.value;
    console.log("Selected Time Range:", timeValue);
    setSelectedTimeRange(timeValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: themeColors.background,
        overflow: "hidden",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: themeColors.paper,
          boxShadow: "none",
          borderBottom: `1px solid ${themeColors.divider}`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            component={Link}
            to="/"
            sx={{ color: themeColors.textPrimary, mr: 1 }}
            title="Home"
          >
            {" "}
            <HomeIcon sx={{ fontSize: "2rem" }} />{" "}
          </IconButton>
          <StyledNavbarButton
            id="dashboard-button"
            aria-controls={isMenuOpen ? "dashboard-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? "true" : undefined}
            onClick={handleMenuOpen}
          >
            {" "}
            <ListItemIcon>
              {" "}
              <DashboardIcon />{" "}
            </ListItemIcon>{" "}
            Dashboard{" "}
          </StyledNavbarButton>
          <Menu
            id="dashboard-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            MenuListProps={{ "aria-labelledby": "dashboard-button" }}
            PaperProps={{
              sx: {
                backgroundColor: themeColors.paper,
                color: themeColors.textPrimary,
                mt: 1,
              },
            }}
          >
            <DashboardMenuItem
              icon={<TimelineIcon />}
              primary="Live Tracking"
              to="/"
              onClick={handleMenuClose}
            />
            <DashboardMenuItem
              icon={<SpeedIcon />}
              primary="Detailed Dashboard"
              to="/dashboard/detailed"
              onClick={handleMenuClose}
            />
            <DashboardMenuItem
              icon={<BarChartIcon />}
              primary="Analytic Dashboard"
              to="/dashboard/analytic"
              onClick={handleMenuClose}
            />
          </Menu>
          <StyledNavbarButton
            id="reports-button"
            aria-controls={isReportsOpen ? "reports-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isReportsOpen ? "true" : undefined}
            onClick={handleReportsOpen}
          >
            {" "}
            <ListItemIcon>
              {" "}
              <SummarizeIcon />{" "}
            </ListItemIcon>{" "}
            Reports{" "}
          </StyledNavbarButton>
          <Menu
            id="reports-menu"
            anchorEl={reportsAnchorEl}
            open={isReportsOpen}
            onClose={handleReportsClose}
            MenuListProps={{ "aria-labelledby": "reports-button" }}
            PaperProps={{
              sx: {
                backgroundColor: themeColors.paper,
                color: themeColors.textPrimary,
                mt: 1,
              },
            }}
          >
            <DashboardMenuItem
              icon={<DescriptionIcon />}
              primary="Summary Report"
              to="/reports/summary"
              onClick={handleReportsClose}
            />
            <DashboardMenuItem
              icon={<PauseCircleOutlineIcon />}
              primary="Stop Report"
              to="/reports/stop"
              onClick={handleReportsClose}
            />
            <DashboardMenuItem
              icon={<DirectionsCarFilledIcon />}
              primary="Drive Report"
              to="/reports/drive"
              onClick={handleReportsClose}
            />
            <DashboardMenuItem
              icon={<EventIcon />}
              primary="Event Report"
              to="/reports/event"
              onClick={handleReportsClose}
            />
            <DashboardMenuItem
              icon={<MapIcon />}
              primary="Trip Report"
              to="/reports/trip"
              onClick={handleReportsClose}
            />
          </Menu>
          <StyledNavbarButton component={Link} to="/settings/devices">
            {" "}
            <ListItemIcon>
              {" "}
              <DevicesIcon />{" "}
            </ListItemIcon>{" "}
            Devices{" "}
          </StyledNavbarButton>
          <StyledNavbarButton component={Link} to="/settings/preferences">
            {" "}
            <ListItemIcon>
              {" "}
              <RoomPreferencesIcon />{" "}
            </ListItemIcon>{" "}
            Preferences{" "}
          </StyledNavbarButton>
          <StyledNavbarButton component={Link} to="/settings/notifications">
            {" "}
            <ListItemIcon>
              {" "}
              <NotificationsActiveIcon />{" "}
            </ListItemIcon>{" "}
            Notifications{" "}
          </StyledNavbarButton>
          <StyledNavbarButton component={Link} to="/settings/settings">
            {" "}
            <ListItemIcon>
              {" "}
              <SettingsSuggestIcon />{" "}
            </ListItemIcon>{" "}
            Settings{" "}
          </StyledNavbarButton>
          <StyledUserSection>
            {userData ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                {" "}
                <AccountCircleIcon
                  sx={{ fontSize: "2.5rem", color: themeColors.textPrimary }}
                />{" "}
                <Stack>
                  {" "}
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    title={userData.name}
                  >
                    {userData.name || "User"}
                  </Typography>{" "}
                  <Typography
                    variant="caption"
                    title={userData.administrator ? "Administrator" : "User"}
                    sx={{
                      color: userData.administrator
                        ? themeColors.accentGreen
                        : themeColors.textSecondary,
                      fontWeight: userData.administrator ? "bold" : "normal",
                    }}
                  >
                    {userData.administrator ? "Admin" : "User"}
                  </Typography>{" "}
                </Stack>{" "}
              </Stack>
            ) : (
              <CircularProgress
                size={24}
                sx={{ color: themeColors.textPrimary }}
                title="Loading user..."
              />
            )}
          </StyledUserSection>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 2 },
          mt: "64px",
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: themeColors.textPrimary,
            }}
          >
            <CircularProgress color="inherit" />{" "}
            <Typography sx={{ ml: 2 }}>Loading Dashboard Data...</Typography>
          </Box>
        ) : (
          <>
            <Grid
              container
              sx={{ mb: { xs: 2, md: 2 }, display: { xs: "none", md: "flex" } }}
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Grid item xs="auto">
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <Select
                    variant="outlined"
                    value={selectedTimeRange}
                    onChange={handleTimeRangeChange}
                    displayEmpty
                    IconComponent={ExpandMoreIcon}
                    sx={{
                      backgroundColor: themeColors.paper,
                      borderRadius: "4px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: themeColors.divider,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: themeColors.textSecondary,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: themeColors.accentBlue,
                      },
                      "& .MuiSelect-select": {
                        padding: "8px 32px 8px 12px",
                        fontSize: "0.875rem",
                        color:
                          selectedTimeRange === ""
                            ? themeColors.textSecondary
                            : themeColors.textPrimary,
                        fontStyle:
                          selectedTimeRange === "" ? "italic" : "normal",
                      },
                      "& .MuiSelect-icon": { color: themeColors.textSecondary },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          backgroundColor: themeColors.paper,
                          "& .MuiMenuItem-root": {
                            fontSize: "0.875rem",
                            color: themeColors.textPrimary,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem
                      value=""
                      disabled
                      sx={{
                        fontStyle: "italic",
                        color: themeColors.textSecondary,
                      }}
                    >
                      เลือกเวลา
                    </MenuItem>
                    <MenuItem value="today">วันนี้</MenuItem>
                    <MenuItem value="yesterday">เมื่อวาน</MenuItem>
                    <MenuItem value="this_week">อาทิตย์นี้</MenuItem>
                    <MenuItem value="last_week">อาทิตย์ที่แล้ว</MenuItem>
                    <MenuItem value="this_month">เดือนนี้</MenuItem>
                    <MenuItem value="last_month">เดือนที่แล้ว</MenuItem>
                    <MenuItem value="all_time">ข้อมูลทั้งหมด</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs>
                <Stack
                  direction="row"
                  spacing={{ xs: 1, sm: 1.5 }}
                  alignItems="center"
                  divider={
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        borderColor: "rgba(0, 0, 0, 0.1)",
                        height: "16px",
                        alignSelf: "center",
                        mx: 0.5,
                      }}
                    />
                  }
                  sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}
                >
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    title="Company Information"
                    sx={{ flexShrink: 0 }}
                  >
                    {" "}
                    <FmdGoodIcon
                      sx={{
                        color: themeColors.accentBlue,
                        fontSize: "1.2rem",
                        transform: "translateY(-1px)",
                      }}
                    />{" "}
                    <Typography
                      variant="caption"
                      sx={{ color: themeColors.textPrimary }}
                    >
                      {" "}
                      บริษัท ทางยกระดับดอนเมือง จำกัด{" "}
                    </Typography>{" "}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    title="Weather Condition"
                    sx={{ flexShrink: 0 }}
                  >
                    {" "}
                    {weatherData.icon && (
                      <Box
                        component="img"
                        src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                        alt={weatherData.description || "Weather icon"}
                        sx={{
                          width: 28,
                          height: 28,
                          transform: "translateY(-2px)",
                          filter: "brightness(0.8) contrast(0.9)",
                        }}
                      />
                    )}{" "}
                    <Typography
                      variant="caption"
                      sx={{ color: themeColors.textPrimary }}
                    >
                      {" "}
                      {weatherData.temp !== null
                        ? `${weatherData.temp.toFixed(0)}°C`
                        : "--°C"}{" "}
                      {weatherData.description}{" "}
                    </Typography>{" "}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    title={`PM2.5 (${pm25Style.text})`}
                    sx={{ flexShrink: 0 }}
                  >
                    {" "}
                    <AirIcon
                      sx={{
                        fontSize: "1.1rem",
                        color: pm25Style.color,
                        transform: "translateY(-1px)",
                      }}
                    />{" "}
                    <Typography
                      variant="caption"
                      sx={{
                        color: themeColors.textPrimary,
                        fontWeight: "medium",
                      }}
                    >
                      {" "}
                      PM2.5:{" "}
                      {aqiData.pm25 !== null
                        ? `${aqiData.pm25.toFixed(1)} µg/m³`
                        : "N/A"}{" "}
                      <Box component="span" sx={{ color: pm25Style.color }}>
                        ({pm25Style.text})
                      </Box>{" "}
                    </Typography>{" "}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    title={`Current Date & Time`}
                    sx={{ flexShrink: 0 }}
                  >
                    {" "}
                    <AccessTimeIcon
                      sx={{
                        fontSize: "1.1rem",
                        color: themeColors.accentGreen,
                        transform: "translateY(-1px)",
                      }}
                    />{" "}
                    <Typography
                      variant="caption"
                      sx={{ color: themeColors.textPrimary }}
                    >
                      {" "}
                      {formatCurrentDate(currentTime)}{" "}
                    </Typography>{" "}
                    <Typography
                      variant="caption"
                      sx={{
                        minWidth: "60px",
                        textAlign: "left",
                        color: themeColors.textPrimary,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {" "}
                      {formatCurrentTime(currentTime)}{" "}
                    </Typography>{" "}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                {" "}
                <KpiCard
                  title="รถทั้งหมด"
                  value={dashboardData.devices.length}
                  icon={<CommuteIcon />}
                  color={themeColors.accentBlue}
                />{" "}
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                {" "}
                <KpiCard
                  title="กำลังใช้งาน"
                  value={onlineCount}
                  icon={<NoCrashIcon />}
                  color={themeColors.accentGreen}
                />{" "}
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                {" "}
                <KpiCard
                  title="ไม่ได้ใช้งาน"
                  value={offlineCount}
                  icon={<CarCrashIcon />}
                  color={themeColors.accentRed}
                />{" "}
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                {" "}
                <KpiCard
                  title="ระยะทางรวม"
                  value={totalDistanceAllDevices}
                  icon={<RouteIcon />}
                  color={themeColors.accentBlue}
                />{" "}
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                {" "}
                <KpiCard
                  title="รออัพเดท 1"
                  value="..."
                  icon={<UpdateIcon />}
                  color={themeColors.textSecondary}
                />{" "}
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                {" "}
                <KpiCard
                  title="รออัพเดท 2"
                  value="..."
                  icon={<UpdateIcon />}
                  color={themeColors.textSecondary}
                />{" "}
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    backgroundColor: themeColors.paper,
                    borderRadius: 2,
                    color: themeColors.textPrimary,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={2}
                    flexShrink={0}
                  >
                    {" "}
                    <LeaderboardIcon
                      sx={{ color: themeColors.accentBlue }}
                    />{" "}
                    <Typography variant="h6" fontWeight="medium">
                      {" "}
                      Top 5 ระยะทาง{" "}
                    </Typography>{" "}
                  </Stack>
                  <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
                    <List dense sx={{ p: 0 }}>
                      {deviceRanking.length > 0 ? (
                        deviceRanking.map((device, index) => (
                          <ListItem
                            key={device.id}
                            divider={index < deviceRanking.length - 1}
                            sx={{
                              px: 0,
                              py: 1,
                              "&:last-child .MuiDivider-root": {
                                display: "none",
                              },
                            }}
                          >
                            {" "}
                            <ListItemIcon
                              sx={{
                                minWidth: 40,
                                color: themeColors.textSecondary,
                              }}
                            >
                              {" "}
                              <Typography fontWeight="bold">
                                #{index + 1}
                              </Typography>{" "}
                            </ListItemIcon>{" "}
                            <ListItemText
                              primary={device.name || `ID: ${device.id}`}
                              secondary={formatAttributeValue(
                                "totalDistance",
                                device.totalDistance
                              )}
                              primaryTypographyProps={{
                                color: themeColors.textPrimary,
                                fontWeight: "medium",
                                noWrap: true,
                              }}
                              secondaryTypographyProps={{
                                color: themeColors.textSecondary,
                              }}
                            />{" "}
                          </ListItem>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: themeColors.textSecondary,
                            textAlign: "center",
                            py: 2,
                          }}
                        >
                          {" "}
                          ไม่มีข้อมูลระยะทาง{" "}
                        </Typography>
                      )}
                    </List>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  elevation={3}
                  sx={{
                    backgroundColor: themeColors.paper,
                    borderRadius: 2,
                    height: {
                      xs: "50vh",
                      md: "calc(100vh - 64px - 48px - 136px - 48px)",
                    },
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    p: 0,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      p: 2,
                      borderBottom: `1px solid ${themeColors.divider}`,
                      flexShrink: 0,
                      color: themeColors.textPrimary,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TravelExploreIcon
                        sx={{ color: themeColors.accentBlue }}
                      />
                      <Typography variant="h6" fontWeight="medium">
                        {" "}
                        แผนที่ภาพรวม{" "}
                      </Typography>
                    </Box>
                    <FormControl sx={{ minWidth: 150 }} size="small">
                      <Select
                        variant="outlined"
                        value={selectedDeviceId}
                        onChange={handleDeviceChange}
                        displayEmpty
                        IconComponent={ExpandMoreIcon}
                        sx={{
                          backgroundColor: themeColors.paper,
                          borderRadius: "4px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: themeColors.divider,
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: themeColors.textSecondary,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: themeColors.accentBlue,
                          },
                          "& .MuiSelect-select": {
                            padding: "8px 32px 8px 12px",
                            fontSize: "0.875rem",
                            color: themeColors.textPrimary,
                          },
                          "& .MuiSelect-icon": {
                            color: themeColors.textSecondary,
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              backgroundColor: themeColors.paper,
                            },
                          },
                        }}
                      >
                        <MenuItem
                          value="all"
                          sx={{
                            fontSize: "0.875rem",
                            color: themeColors.textSecondary,
                          }}
                        >
                          {" "}
                          รถทั้งหมด{" "}
                        </MenuItem>
                        {dashboardData.devices?.map((device) => (
                          <MenuItem
                            key={device.id}
                            value={device.id}
                            sx={{
                              fontSize: "0.875rem",
                              color: themeColors.textPrimary,
                            }}
                          >
                            {" "}
                            {device.name || `Device ID: ${device.id}`}{" "}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>

                  <Box sx={{ flexGrow: 1, position: "relative" }}>
                    <MainMap
                      filteredPositions={mapPositions.filter(
                        (p) =>
                          selectedDeviceId === "all" ||
                          p.deviceId.toString() === selectedDeviceId.toString()
                      )}
                      selectedPosition={mapSelectedPosition}
                      onEventsClick={handleMapEventsClick}
                    />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  sx={{
                    backgroundColor: themeColors.paper,
                    borderRadius: 2,
                    color: themeColors.textPrimary,
                    overflow: "hidden",
                    mt: 0,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: `1px solid ${themeColors.divider}`,
                    }}
                  >
                    {" "}
                    <Typography variant="h6" fontWeight="medium">
                      {" "}
                      รายละเอียดอุปกรณ์{" "}
                    </Typography>{" "}
                  </Box>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        {" "}
                        <TableRow
                          sx={{
                            "& th": {
                              backgroundColor: themeColors.background,
                              color: themeColors.textSecondary,
                              fontWeight: "bold",
                              borderBottom: `2px solid ${themeColors.divider}`,
                            },
                          }}
                        >
                          {" "}
                          <TableCell
                            align="center"
                            sx={{ width: "60px", p: "6px 8px" }}
                          >
                            สถานะ
                          </TableCell>{" "}
                          <TableCell sx={{ p: "6px 8px" }}>
                            ชื่ออุปกรณ์ / ID
                          </TableCell>{" "}
                          <TableCell sx={{ p: "6px 8px" }}>
                            ตำแหน่งล่าสุด (Lat, Lng)
                          </TableCell>{" "}
                          <TableCell sx={{ p: "6px 8px" }}>
                            เวลาตำแหน่ง
                          </TableCell>{" "}
                          <TableCell sx={{ p: "6px 8px" }}>ความเร็ว</TableCell>{" "}
                          <TableCell sx={{ p: "6px 8px" }}>กม. รวม</TableCell>{" "}
                        </TableRow>{" "}
                      </TableHead>
                      <TableBody>
                        {dashboardData.devices
                          .filter(
                            (device) =>
                              selectedDeviceId === "all" ||
                              device.id.toString() ===
                                selectedDeviceId.toString()
                          )
                          .map((device) => {
                            const position =
                              dashboardData.latestPositions[device.id];
                            const isOnline = device.status === "online";
                            const totalDist =
                              position?.attributes?.totalDistance ?? 0;
                            const lastUpdate =
                              position?.fixTime ||
                              position?.serverTime ||
                              device.lastUpdate;
                            return (
                              <TableRow
                                key={device.id}
                                hover
                                sx={{
                                  "& td": {
                                    color: themeColors.textPrimary,
                                    borderBottom: `1px solid ${themeColors.divider}`,
                                    p: "6px 8px",
                                    fontSize: "0.875rem",
                                  },
                                  "&:last-child td": { borderBottom: 0 },
                                }}
                              >
                                <TableCell align="center">
                                  {" "}
                                  <Box
                                    title={isOnline ? "Online" : "Offline"}
                                    sx={{ display: "inline-flex" }}
                                  >
                                    {" "}
                                    {isOnline ? (
                                      <NoCrashIcon
                                        fontSize="small"
                                        sx={{ color: themeColors.accentGreen }}
                                      />
                                    ) : (
                                      <CarCrashIcon
                                        fontSize="small"
                                        sx={{ color: themeColors.accentRed }}
                                      />
                                    )}{" "}
                                  </Box>{" "}
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    noWrap
                                    title={device.name || `ID: ${device.id}`}
                                  >
                                    {" "}
                                    {device.name || `ID: ${device.id}`}{" "}
                                  </Typography>{" "}
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Typography variant="body2" noWrap>
                                    {" "}
                                    {position
                                      ? `${position.latitude?.toFixed(
                                          5
                                        )}, ${position.longitude?.toFixed(5)}`
                                      : "-"}{" "}
                                  </Typography>{" "}
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Typography
                                    variant="caption"
                                    noWrap
                                    sx={{ fontVariantNumeric: "tabular-nums" }}
                                  >
                                    {" "}
                                    {lastUpdate
                                      ? new Date(lastUpdate).toLocaleString(
                                          "th-TH",
                                          {
                                            year: "numeric",
                                            month: "numeric",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: false,
                                          }
                                        )
                                      : "-"}{" "}
                                  </Typography>{" "}
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{ fontVariantNumeric: "tabular-nums" }}
                                  >
                                    {" "}
                                    {formatAttributeValue(
                                      "speed",
                                      position?.speed
                                    )}{" "}
                                  </Typography>{" "}
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{ fontVariantNumeric: "tabular-nums" }}
                                  >
                                    {" "}
                                    {formatAttributeValue(
                                      "totalDistance",
                                      totalDist
                                    )}{" "}
                                  </Typography>{" "}
                                </TableCell>
                              </TableRow>
                            );
                          })}

                        {selectedDeviceId !== "all" &&
                          dashboardData.devices.filter(
                            (d) =>
                              d.id.toString() === selectedDeviceId.toString()
                          ).length === 0 &&
                          dashboardData.devices.length > 0 && (
                            <TableRow>
                              {" "}
                              <TableCell
                                colSpan={6}
                                align="center"
                                sx={{
                                  color: themeColors.textSecondary,
                                  py: 4,
                                  border: 0,
                                }}
                              >
                                {" "}
                                ไม่พบข้อมูลสำหรับ Device ที่เลือก{" "}
                              </TableCell>{" "}
                            </TableRow>
                          )}
                        {dashboardData.devices.length === 0 && (
                          <TableRow>
                            {" "}
                            <TableCell
                              colSpan={6}
                              align="center"
                              sx={{
                                color: themeColors.textSecondary,
                                py: 4,
                                border: 0,
                              }}
                            >
                              {" "}
                              ไม่มีข้อมูลอุปกรณ์{" "}
                            </TableCell>{" "}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;

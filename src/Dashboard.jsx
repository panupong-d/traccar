import React, { useState, useEffect } from "react";
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
} from "@mui/material";
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
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TimelineIcon from "@mui/icons-material/Timeline";
import SpeedIcon from "@mui/icons-material/Speed";
import BarChartIcon from "@mui/icons-material/BarChart";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Icon จำนวนรถทั้งหมด
import WifiIcon from '@mui/icons-material/Wifi'; // Icon ออนไลน์
import WifiOffIcon from '@mui/icons-material/WifiOff'; // Icon ออฟไลน์
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction'; // Icon ออนไลน์วันนี้

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#82ca9d', '#d9534f']; // เขียว (ออนไลน์), แดง (ออฟไลน์)

const StyledNavbarButton = styled(Button)(({ theme }) => ({
    color: theme.palette.common.white,
    textTransform: "none",
    margin: theme.spacing(0, 1),
}));

const StyledUserSection = styled(Box)(({ theme }) => ({
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    color: theme.palette.common.white,
}));

const DashboardMenuItem = ({ icon, primary, to, onClick, ...props }) => (
    <MenuItem component={Link} to={to} onClick={onClick} {...props}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
    </MenuItem>
);

const DashboardPage = () => {
    const [userData, setUserData] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [reportsAnchorEl, setReportsAnchorEl] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        devices: [],
        positions: [],
    });
    const isMenuOpen = Boolean(anchorEl);
    const isReportsOpen = Boolean(reportsAnchorEl);

    const fetchWithAuth = async (url, options = {}) => {
        return fetch(url, options);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetchWithAuth("/api/session");
                if (!response.ok) {
                    console.warn("Warning: /api/session might require authentication. User data will not be available.");
                    setUserData(null);
                    return;
                }
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserData(null);
            }
        };

        const fetchDashboardData = async () => {
            try {
                const [devicesResponse, positionsResponse] = await Promise.all([
                    fetchWithAuth("/api/devices"),
                    fetchWithAuth("/api/positions"),
                ]);

                if (devicesResponse.ok && positionsResponse.ok) {
                    const devicesData = await devicesResponse.json();
                    const positionsData = await positionsResponse.json();

                    setDashboardData({
                        devices: devicesData,
                        positions: positionsData,
                    });
                } else {
                    console.error("Error fetching dashboard data");
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchUserData();
        fetchDashboardData();
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleReportsOpen = (event) => {
        setReportsAnchorEl(event.currentTarget);
    };

    const handleReportsClose = () => {
        setReportsAnchorEl(null);
    };

    const onlineDevices = dashboardData.devices.filter(device => device.status === 'online');
    const offlineDevices = dashboardData.devices.filter(device => device.status !== 'online');

    const pieChartData = [
        { name: 'ออนไลน์', value: onlineDevices.length },
        { name: 'ออฟไลน์', value: offlineDevices.length },
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <AppBar position="fixed" sx={{ backgroundColor: "#283593" }}>
                <Toolbar>
                    <IconButton color="inherit" component={Link} to="/">
                        <HomeIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>

                    <StyledNavbarButton onClick={handleMenuOpen}>
                        <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                            <DashboardIcon />
                        </ListItemIcon>
                        Dashboard
                    </StyledNavbarButton>
                    <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                        <DashboardMenuItem
                            icon={<TimelineIcon />}
                            primary="Live Tracking"
                            to="/"
                            onClick={handleMenuClose}
                        />
                        <DashboardMenuItem
                            icon={<SpeedIcon />}
                            primary="Detailed Dashboard"
                            onClick={handleMenuClose}
                        />
                        <DashboardMenuItem
                            icon={<BarChartIcon />}
                            primary="Analytic Dashboard"
                            onClick={handleMenuClose}
                        />
                    </Menu>

                    <StyledNavbarButton onClick={handleReportsOpen}>
                        <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                            <SummarizeIcon />
                        </ListItemIcon>
                        Reports
                    </StyledNavbarButton>
                    <Menu anchorEl={reportsAnchorEl} open={isReportsOpen} onClose={handleReportsClose}>
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
                        <MenuItem component={Link} to="/reports/combined" onClick={handleReportsClose}>
                            <ListItemText primary="Combined Report" />
                        </MenuItem>
                        <MenuItem component={Link} to="/reports/chart" onClick={handleReportsClose}>
                            <ListItemText primary="Chart Report" />
                        </MenuItem>
                        <MenuItem component={Link} to="/reports/route" onClick={handleReportsClose}>
                            <ListItemText primary="Route Report" />
                        </MenuItem>
                        <MenuItem component={Link} to="/reports/scheduled" onClick={handleReportsClose}>
                            <ListItemText primary="Scheduled Report" />
                        </MenuItem>
                        <MenuItem component={Link} to="/reports/statistics" onClick={handleReportsClose}>
                            <ListItemText primary="Statistics Report" />
                        </MenuItem>
                    </Menu>

                    <StyledNavbarButton component={Link} to="/settings/devices">
                        <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                            <DevicesIcon />
                        </ListItemIcon>
                        Devices
                    </StyledNavbarButton>

                    <StyledNavbarButton component={Link} to="/settings/preferences">
                        <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                            <RoomPreferencesIcon />
                        </ListItemIcon>
                        Preferences
                    </StyledNavbarButton>

                    <StyledNavbarButton component={Link} to="/settings/notifications">
                        <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                            <NotificationsActiveIcon />
                        </ListItemIcon>
                        Notifications
                    </StyledNavbarButton>

                    <StyledNavbarButton component={Link} to="/settings/settings">
                        <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                            <SettingsSuggestIcon />
                        </ListItemIcon>
                        Settings
                    </StyledNavbarButton>

                    <StyledUserSection>
                        {userData && (
                            <Stack direction="row" alignItems="center">
                                <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                                    <AccountCircleIcon sx={{ fontSize: "2rem" }} />
                                </ListItemIcon>
                                <Stack>
                                    <Typography variant="body1" fontWeight="bold">
                                        {userData.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            ml: 0,
                                            color: userData.administrator ? "yellow" : "inherit",
                                        }}
                                    >
                                        {userData.administrator ? "Admin" : "User"}
                                    </Typography>
                                </Stack>
                            </Stack>
                        )}
                    </StyledUserSection>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 3, mt: "64px", overflowY: "auto" }}>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <Grid container spacing={3} justifyContent="center" sx={{ display: 'flex' }}>

                            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                    <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'success.main', mb: 1 }}>
                                        <DirectionsCarIcon sx={{ fontSize: '2.5rem' }} />
                                    </ListItemIcon>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
                                        {dashboardData.devices.length}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary" align="center">
                                        จำนวนรถอุปกรณ์
                                    </Typography>
                                </Paper>
                            </Grid>


                            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom align="center">
                                        สถานะออนไลน์/ออฟไลน์
                                    </Typography>
                                    <ResponsiveContainer width={150} height={150}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                startAngle={0}
                                                endAngle={180}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                                        <WifiIcon sx={{ color: COLORS[0], mr: 0.5 }} />
                                        <Typography variant="body2" sx={{ mr: 1 }}>{onlineDevices.length} ออนไลน์</Typography>
                                        <WifiOffIcon sx={{ color: COLORS[1], mr: 0.5 }} />
                                        <Typography variant="body2">{offlineDevices.length} ออฟไลน์</Typography>
                                    </Box>
                                </Paper>
                            </Grid>

 
                            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                    <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', mb: 1 }}>
                                        <OnlinePredictionIcon sx={{ fontSize: '2.5rem' }} />
                                    </ListItemIcon>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
                                        {onlineDevices.length}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary" align="center">
                                        ออนไลน์วันนี้
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>


                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                รายชื่ออุปกรณ์และความเร็วล่าสุด
                            </Typography>
                            <List>
                                {dashboardData.devices.map(device => {
                                    const latestPosition = dashboardData.positions.find(
                                        pos => pos.deviceId === device.id
                                    );
                                    const speed = latestPosition ? latestPosition.speed : 'ไม่พบข้อมูล';
                                    const speedUnit = latestPosition ? ' กม/ชม' : '';

                                    return (
                                        <ListItem key={device.id} divider>
                                            <ListItemText
                                                primary={device.name || `อุปกรณ์ ID: ${device.id}`}
                                                secondary={`ความเร็วล่าสุด: ${speed}${speedUnit}`}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default  Page;
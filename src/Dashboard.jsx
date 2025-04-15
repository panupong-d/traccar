import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    AppBar, Toolbar, IconButton, Typography, Button, ListItemIcon, ListItemText,
    Menu, MenuItem, Stack, Grid, Paper, Box, styled, List, ListItem,
    CircularProgress, Divider, Chip, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Avatar
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
import DevicesIcon from '@mui/icons-material/Devices';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import TimelineIcon from "@mui/icons-material/Timeline";
import SpeedIcon from "@mui/icons-material/Speed";
import BarChartIcon from "@mui/icons-material/BarChart";

import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import RouteIcon from '@mui/icons-material/Route';
import SensorsIcon from '@mui/icons-material/Sensors';

import MainMap from "./main/MainMap";

const themeColors = {
    background: '#1a1a2e',
    paper: '#1f1f3a',
    textPrimary: '#e0e0e0',
    textSecondary: '#a0a0b0',
    accentGreen: '#2ecc71',
    accentRed: '#e74c3c',
    accentBlue: '#3498db',
    divider: 'rgba(255, 255, 255, 0.12)',
};

const StyledNavbarButton = styled(Button)(({ theme }) => ({
    color: themeColors.textPrimary,
    textTransform: "none",
    margin: theme.spacing(0, 1),
    '& .MuiListItemIcon-root': {
        color: 'inherit',
        minWidth: 'auto',
        marginRight: theme.spacing(1),
    }
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
            '& .MuiListItemIcon-root': { color: themeColors.textSecondary },
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
    >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
    </MenuItem>
);

const formatAttributeKey = (key) => {
    switch (key) {
        case 'batteryLevel': return 'แบตเตอรี่';
        case 'distance': return 'ระยะทาง';
        case 'totalDistance': return 'ระยะทางรวม';
        case 'motion': return 'เคลื่อนไหว';
        default: return key;
    }
};

const formatAttributeValue = (key, value) => {
     if (value === null || value === undefined) return 'N/A';
    switch (key) {
        case 'batteryLevel': return `${value}%`;
        case 'distance':
        case 'totalDistance':
             return !isNaN(parseFloat(value)) ? `${(parseFloat(value) / 1000).toFixed(2)} กม.` : '0.00 กม.';
        case 'motion': return value ? 'ใช่' : 'ไม่';
        case 'speed':
             return !isNaN(parseFloat(value)) ? `${(parseFloat(value)).toFixed(1)} กม/ชม` : 'N/A';
        default:
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
    }
};

const KpiCard = ({ title, value, icon, color = themeColors.textPrimary }) => (
    <Paper elevation={3} sx={{
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        backgroundColor: themeColors.paper,
        color: themeColors.textPrimary,
        borderRadius: 2,
        minHeight: 120,
    }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
             {icon && React.cloneElement(icon, { sx: { fontSize: '1.8rem', color: color } })}
            <Typography variant="body1" sx={{ color: themeColors.textSecondary }}>{title}</Typography>
        </Stack>
        <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: color, mt: 'auto' }}>
            {value}
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
    const isMenuOpen = Boolean(anchorEl);
    const isReportsOpen = Boolean(reportsAnchorEl);

    const fetchWithAuth = async (url, options = {}) => {
        return fetch(url, options);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetchWithAuth("/api/session");
                if (!response.ok) { console.warn("Warning: /api/session failed."); setUserData(null); return; }
                setUserData(await response.json());
            } catch (error) { console.error("Error fetching user data:", error); setUserData(null); }
        };

        const fetchDashboardData = async (isInitialLoad = false) => {
            if (isInitialLoad) setLoading(true);
            let currentDevices = dashboardData.devices;

            try {
                const devicesResponse = await fetchWithAuth("/api/devices");
                if (!devicesResponse.ok) { console.error("Error fetching devices:", devicesResponse.status); if (isInitialLoad) setLoading(false); return; }
                const devicesData = await devicesResponse.json();
                currentDevices = devicesData;

                if (!devicesData || devicesData.length === 0) {
                    setDashboardData({ devices: [], latestPositions: {} });
                    if (isInitialLoad) setLoading(false);
                    return;
                }

                const positionPromises = devicesData.map(device =>
                    fetchWithAuth(`/api/positions?deviceId=${device.id}`)
                        .then(async res => {
                            if (!res.ok) { console.warn(`Positions fetch failed for ${device.id}: ${res.status}`); return { deviceId: device.id, positions: [] }; }
                            const contentType = res.headers.get("content-type");
                            if (contentType && contentType.includes("application/json")) {
                                const positions = await res.json();
                                return { deviceId: device.id, positions: Array.isArray(positions) ? positions : [] };
                            }
                            console.warn(`Non-JSON response for positions ${device.id}.`);
                            return { deviceId: device.id, positions: [] };
                        }).catch(error => {
                            console.error(`Error fetching positions for ${device.id}:`, error);
                            return { deviceId: device.id, positions: [] };
                        })
                );

                const positionResults = await Promise.all(positionPromises);

                const latestPositionsMap = {};
                positionResults.forEach(result => {
                    if (result.positions && result.positions.length > 0) {
                        const latest = result.positions.reduce((latestPos, currentPos) => {
                            if (!currentPos?.serverTime) return latestPos;
                            try {
                                const currentDateTime = new Date(currentPos.serverTime);
                                const latestDateTime = latestPos ? new Date(latestPos.serverTime) : null;
                                if (!latestDateTime || currentDateTime > latestDateTime) {
                                    return currentPos;
                                }
                            } catch (e) {
                                console.warn(`Invalid date format for position:`, currentPos);
                                return latestPos;
                            }
                            return latestPos;
                        }, null);
                        if (latest) {
                            latestPositionsMap[result.deviceId] = latest;
                        }
                    }
                });

                setDashboardData({ devices: currentDevices, latestPositions: latestPositionsMap });

            } catch (error) {
                console.error("Error in fetchDashboardData:", error);
                setDashboardData(prev => ({ ...prev, devices: currentDevices }));
            } finally {
                if (isInitialLoad) setLoading(false);
            }
        };

        fetchUserData();
        fetchDashboardData(true);
        const intervalId = setInterval(() => fetchDashboardData(false), 10000);
        return () => clearInterval(intervalId);
    }, []);

    const { onlineCount, offlineCount, deviceRanking, totalDistanceAllDevices } = useMemo(() => {
        const online = dashboardData.devices.filter(d => d.status === 'online').length;
        const offline = dashboardData.devices.length - online;
        let totalDistanceSum = 0;

        const ranked = [...dashboardData.devices]
            .map(device => {
                const position = dashboardData.latestPositions[device.id];
                const totalDistance = position?.attributes?.totalDistance ?? 0;
                const numericDistance = !isNaN(parseFloat(totalDistance)) ? parseFloat(totalDistance) : 0;
                totalDistanceSum += numericDistance;
                return { ...device, totalDistance: numericDistance };
            })
            .filter(device => device.totalDistance > 0)
            .sort((a, b) => b.totalDistance - a.totalDistance)
            .slice(0, 5);

        const formattedTotalDistance = formatAttributeValue('totalDistance', totalDistanceSum);

        return {
            onlineCount: online,
            offlineCount: offline,
            deviceRanking: ranked,
            totalDistanceAllDevices: formattedTotalDistance
        };
    }, [dashboardData]);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleReportsOpen = (event) => setReportsAnchorEl(event.currentTarget);
    const handleReportsClose = () => setReportsAnchorEl(null);

    const mapPositions = useMemo(() =>
        Object.values(dashboardData.latestPositions).filter(p => p != null),
        [dashboardData.latestPositions]
    );
    const mapSelectedPosition = null;
    const handleMapEventsClick = useCallback(() => {
        console.log("Events clicked on dashboard map (no action defined)");
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: themeColors.background }}>
            <AppBar position="fixed" sx={{ backgroundColor: themeColors.paper, boxShadow: 'none', borderBottom: `1px solid ${themeColors.divider}` }}>
                <Toolbar>
                    <IconButton color="inherit" component={Link} to="/" sx={{ color: themeColors.textPrimary }}> <HomeIcon sx={{ fontSize: "2rem" }} /> </IconButton>
                    <StyledNavbarButton onClick={handleMenuOpen}> <ListItemIcon> <DashboardIcon /> </ListItemIcon> Dashboard </StyledNavbarButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                        PaperProps={{ sx: { backgroundColor: themeColors.paper, color: themeColors.textPrimary } }}
                    >
                        <DashboardMenuItem icon={<TimelineIcon />} primary="Live Tracking" to="/" onClick={handleMenuClose} />
                        <DashboardMenuItem icon={<SpeedIcon />} primary="Detailed Dashboard" to="/dashboard/detailed" onClick={handleMenuClose} />
                        <DashboardMenuItem icon={<BarChartIcon />} primary="Analytic Dashboard" to="/dashboard/analytic" onClick={handleMenuClose} />
                    </Menu>
                    <StyledNavbarButton onClick={handleReportsOpen}> <ListItemIcon> <SummarizeIcon /> </ListItemIcon> Reports </StyledNavbarButton>
                    <Menu
                        anchorEl={reportsAnchorEl}
                        open={isReportsOpen}
                        onClose={handleReportsClose}
                        PaperProps={{ sx: { backgroundColor: themeColors.paper, color: themeColors.textPrimary } }}
                    >
                        <DashboardMenuItem icon={<DescriptionIcon />} primary="Summary Report" to="/reports/summary" onClick={handleReportsClose} />
                        <DashboardMenuItem icon={<PauseCircleOutlineIcon />} primary="Stop Report" to="/reports/stop" onClick={handleReportsClose} />
                        <DashboardMenuItem icon={<DirectionsCarFilledIcon />} primary="Drive Report" to="/reports/drive" onClick={handleReportsClose} />
                        <DashboardMenuItem icon={<EventIcon />} primary="Event Report" to="/reports/event" onClick={handleReportsClose} />
                        <DashboardMenuItem icon={<MapIcon />} primary="Trip Report" to="/reports/trip" onClick={handleReportsClose} />
                    </Menu>
                    <StyledNavbarButton component={Link} to="/settings/devices"> <ListItemIcon><DevicesIcon /></ListItemIcon> Devices </StyledNavbarButton>
                    <StyledNavbarButton component={Link} to="/settings/preferences"> <ListItemIcon><RoomPreferencesIcon /></ListItemIcon> Preferences </StyledNavbarButton>
                    <StyledNavbarButton component={Link} to="/settings/notifications"> <ListItemIcon><NotificationsActiveIcon /></ListItemIcon> Notifications </StyledNavbarButton>
                    <StyledNavbarButton component={Link} to="/settings/settings"> <ListItemIcon><SettingsSuggestIcon /></ListItemIcon> Settings </StyledNavbarButton>
                    <StyledUserSection>
                        {userData ? (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <AccountCircleIcon sx={{ fontSize: "2.5rem", color: themeColors.textPrimary }} />
                                <Stack>
                                    <Typography variant="body1" fontWeight="bold"> {userData.name} </Typography>
                                    <Typography variant="caption" sx={{ color: userData.administrator ? "yellow" : themeColors.textSecondary }}> {userData.administrator ? "Admin" : "User"} </Typography>
                                </Stack>
                            </Stack>
                        ) : (<CircularProgress size={24} sx={{ color: themeColors.textPrimary }} />)}
                    </StyledUserSection>
                </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: "64px", overflowY: "auto" }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 100px)', color: themeColors.textPrimary }}>
                        <CircularProgress color="inherit" />
                        <Typography sx={{ ml: 2 }}>Loading Dashboard...</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid item xs={12} sm={6} md={3}> <KpiCard title="อุปกรณ์ทั้งหมด" value={dashboardData.devices.length} icon={<DevicesIcon />} color={themeColors.accentBlue} /> </Grid>
                        <Grid item xs={12} sm={6} md={3}> <KpiCard title="ออนไลน์" value={onlineCount} icon={<WifiIcon />} color={themeColors.accentGreen} /> </Grid>
                        <Grid item xs={12} sm={6} md={3}> <KpiCard title="ออฟไลน์" value={offlineCount} icon={<WifiOffIcon />} color={themeColors.accentRed} /> </Grid>
                        <Grid item xs={12} sm={6} md={3}> <KpiCard title="กม. รวมทั้งหมด" value={totalDistanceAllDevices} icon={<RouteIcon />} color={themeColors.accentBlue} /> </Grid>

                        <Grid item xs={12} md={5} lg={4}>
                            <Paper elevation={3} sx={{ p: 2, backgroundColor: themeColors.paper, borderRadius: 2, color: themeColors.textPrimary, height: '100%' }}>
                                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                    <LeaderboardIcon sx={{ color: themeColors.accentBlue }}/>
                                    <Typography variant="h6" fontWeight="medium">Top 5 ระยะทางรวม</Typography>
                                </Stack>
                                <List dense sx={{ p: 0 }}>
                                    {deviceRanking.length > 0 ? deviceRanking.map((device, index) => (
                                        <ListItem key={device.id} divider={index < deviceRanking.length - 1} sx={{ px: 0, py: 1, '&:last-child .MuiDivider-root': { display: 'none' } }}>
                                            <ListItemIcon sx={{ minWidth: 40, color: themeColors.textSecondary }}> <Typography fontWeight="bold">#{index + 1}</Typography> </ListItemIcon>
                                            <ListItemText
                                                primary={device.name || `ID: ${device.id}`}
                                                secondary={formatAttributeValue('totalDistance', device.totalDistance)}
                                                primaryTypographyProps={{ color: themeColors.textPrimary, fontWeight: 'medium', noWrap: true }}
                                                secondaryTypographyProps={{ color: themeColors.textSecondary }}
                                            />
                                        </ListItem>
                                    )) : ( <Typography variant="body2" sx={{ color: themeColors.textSecondary, textAlign: 'center', py: 2 }}>ไม่มีข้อมูลระยะทาง</Typography> )}
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={7} lg={8}>
                             <Paper elevation={3} sx={{
                                    backgroundColor: themeColors.paper,
                                    borderRadius: 2,
                                    height: { xs: '400px', md: '100%' },
                                    overflow: 'hidden',
                                    p: 0
                                }}>
                                <MainMap
                                    filteredPositions={mapPositions}
                                    selectedPosition={mapSelectedPosition}
                                    onEventsClick={handleMapEventsClick}
                                />
                             </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ backgroundColor: themeColors.paper, borderRadius: 2, color: themeColors.textPrimary, overflow: 'hidden' }}>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" fontWeight="medium">รายละเอียดอุปกรณ์</Typography>
                                </Box>
                                <TableContainer>
                                    <Table size="small" sx={{ '& th, & td': { borderColor: themeColors.divider } }}>
                                        <TableHead>
                                            <TableRow sx={{ '& th': { color: themeColors.textSecondary, fontWeight: 'bold', border: 0, backgroundColor: 'rgba(255, 255, 255, 0.05)', p: 1 } }}>
                                                <TableCell align="center" sx={{ width: '60px' }}>สถานะ</TableCell>
                                                <TableCell>ชื่ออุปกรณ์ / ID</TableCell>
                                                <TableCell>ตำแหน่งล่าสุด</TableCell>
                                                <TableCell>เวลาตำแหน่ง</TableCell>
                                                <TableCell>ความเร็ว</TableCell>
                                                <TableCell>กม. รวม</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.devices.length > 0 ? dashboardData.devices.map((device) => {
                                                const position = dashboardData.latestPositions[device.id];
                                                const isOnline = device.status === 'online';
                                                const totalDist = position?.attributes?.totalDistance ?? 0;
                                                const lastUpdate = position?.serverTime ?? device.lastUpdate;
                                                return (
                                                    <TableRow key={device.id} sx={{ '& td': { color: themeColors.textPrimary, border: 0, p: 1 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' } }}>
                                                        <TableCell align="center"> {isOnline ? <WifiIcon fontSize="small" sx={{ color: themeColors.accentGreen }} /> : <WifiOffIcon fontSize="small" sx={{ color: themeColors.accentRed }} />} </TableCell>
                                                        <TableCell> <Typography variant="body2" fontWeight="medium">{device.name || `ID: ${device.id}`}</Typography> </TableCell>
                                                        <TableCell> <Typography variant="body2">{position ? `${position.latitude?.toFixed(5)}, ${position.longitude?.toFixed(5)}` : '-'}</Typography> </TableCell>
                                                        <TableCell> <Typography variant="caption">{lastUpdate ? new Date(lastUpdate).toLocaleString() : '-'}</Typography> </TableCell>
                                                        <TableCell> <Typography variant="body2">{formatAttributeValue('speed', position?.speed)}</Typography> </TableCell>
                                                        <TableCell> <Typography variant="body2">{formatAttributeValue('totalDistance', totalDist)}</Typography> </TableCell>
                                                    </TableRow>
                                                );
                                            }) : (
                                                <TableRow> <TableCell colSpan={6} align="center" sx={{ color: themeColors.textSecondary, py: 4, border: 0 }}> ไม่มีข้อมูลอุปกรณ์ </TableCell> </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default DashboardPage;
import React, { useState, useCallback, useEffect } from "react";
import {
  Paper,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import DeviceList from "./main/DeviceList";
import BottomMenu from "./common/components/BottomMenu";
import StatusCard from "./common/components/StatusCard";
import { devicesActions } from "./store";
import usePersistedState from "./common/util/usePersistedState";
import EventsDrawer from "./main/EventsDrawer";
import useFilter from "./main/useFilter";
import MainToolbar from "./main/MainToolbar";
import MainMap from "./main/MainMap";
import { useAttributePreference } from "./common/util/preferences";
import HomeIcon from "@mui/icons-material/Home";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DevicesIcon from "@mui/icons-material/Devices";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import TuneIcon from "@mui/icons-material/Tune";
import TimelineIcon from "@mui/icons-material/Timeline";
import SpeedIcon from "@mui/icons-material/Speed";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Link } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import EventIcon from "@mui/icons-material/Event";
import MapIcon from "@mui/icons-material/Map";
import SummarizeIcon from "@mui/icons-material/Summarize";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Stack } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    backgroundColor: "#283593",
  },
  navbarButton: {
    color: "white",
    textTransform: "none",
    margin: theme.spacing(0, 1),
  },
  userSection: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    color: theme.palette.common.white,
  },
  content: {
    flex: 1,
    display: "flex",
    paddingTop: "64px",
  },
  sidebar: {
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      width: theme.dimensions.drawerWidthDesktop,
      margin: theme.spacing(1.5),
      zIndex: 3,
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  middle: {
    flex: 1,
    display: "grid",
  },
  contentMap: {
    pointerEvents: "auto",
    gridArea: "1 / 1",
  },
  contentList: {
    pointerEvents: "auto",
    gridArea: "1 / 1",
    zIndex: 4,
  },
  registerDevice: {
    textAlign: "center",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

const TestPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const mapOnSelect = useAttributePreference("mapOnSelect", true);

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find(
    (position) => selectedDeviceId && position.deviceId === selectedDeviceId
  );

  const [filteredDevices, setFilteredDevices] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = usePersistedState("filter", {
    statuses: [],
    groups: [],
  });
  const [filterSort, setFilterSort] = usePersistedState("filterSort", "");
  const [filterMap, setFilterMap] = usePersistedState("filterMap", false);

  const [devicesOpen, setDevicesOpen] = useState(desktop);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportsAnchorEl, setReportsAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null); // เพิ่ม userData state

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  useEffect(() => {
    fetch("/api/session")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setUserData(data))
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setUserData(null);
      });
  }, []);

  useFilter(
    keyword,
    filter,
    filterSort,
    filterMap,
    positions,
    setFilteredDevices,
    setFilteredPositions
  );

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReportsClick = (event) => {
    setReportsAnchorEl(event.currentTarget);
  };

  const handleReportsClose = () => {
    setReportsAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.navbar}>
        <Toolbar>
          <IconButton className={classes.navbarButton}>
            <HomeIcon sx={{ fontSize: "2rem" }} />
          </IconButton>

          <Button className={classes.navbarButton} onClick={handleMenuOpen}>
            <ListItemIcon>
              <DashboardIcon sx={{ marginRight: "8px" }} />
              Dashboard
            </ListItemIcon>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary="Live Tracking" />
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <SpeedIcon />
              </ListItemIcon>
              <ListItemText primary="Detailed Dashboard" />
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Analytic Dashboard" />
            </MenuItem>
          </Menu>

          <Button className={classes.navbarButton} onClick={handleReportsClick}>
            <ListItemIcon>
              <SummarizeIcon sx={{ marginRight: "8px" }} />
              Reports
            </ListItemIcon>
          </Button>

          <Menu
            anchorEl={reportsAnchorEl}
            open={Boolean(reportsAnchorEl)}
            onClose={handleReportsClose}
          >
            <Link
              to="/reports/summary"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem onClick={handleReportsClose}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Summary Report" />
              </MenuItem>
            </Link>
            <Link
              to="/reports/stop"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem onClick={handleReportsClose}>
                <ListItemIcon>
                  <PauseCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Stop Report" />
              </MenuItem>
            </Link>
            <Link
              to="/reports/drive"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem onClick={handleReportsClose}>
                <ListItemIcon>
                  <DirectionsCarFilledIcon />
                </ListItemIcon>
                <ListItemText primary="Drive Report" />
              </MenuItem>
            </Link>
            <Link
              to="/reports/event"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem onClick={handleReportsClose}>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Event Report" />
              </MenuItem>
            </Link>
            <Link
              to="/reports/trip"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem onClick={handleReportsClose}>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary="Trip Report" />
              </MenuItem>
            </Link>
          </Menu>

          <Link
            to="/settings/devices"
            className={classes.navbarButton}
            style={{ textDecoration: "none" }}
          >
            <Button className={classes.navbarButton}>
              <ListItemIcon>
                <DevicesIcon sx={{ marginRight: "8px" }} />
                Devices
              </ListItemIcon>
            </Button>
          </Link>

          <Link
            to="/settings/preferences"
            className={classes.navbarButton}
            style={{ textDecoration: "none" }}
          >
            <Button className={classes.navbarButton}>
              <ListItemIcon>
                <RoomPreferencesIcon sx={{ marginRight: "8px" }} />
                Preferences
              </ListItemIcon>
            </Button>
          </Link>

          <Link
            to="/settings/notifications"
            className={classes.navbarButton}
            style={{ textDecoration: "none" }}
          >
            <Button className={classes.navbarButton}>
              <ListItemIcon>
                <NotificationsActiveIcon sx={{ marginRight: "8px" }} />
                Notifications
              </ListItemIcon>
            </Button>
          </Link>

          <Link
            to="/settings/preferences"
            className={classes.navbarButton}
            style={{ textDecoration: "none" }}
          >
            <Button className={classes.navbarButton}>
              <ListItemIcon>
                <SettingsSuggestIcon sx={{ marginRight: "8px" }} />
                Settings
              </ListItemIcon>
            </Button>
          </Link>
          <div className={classes.userSection}>
            {userData && (
              <Stack direction="row" alignItems="center">
                <ListItemIcon style={{ margin: "0 -12px 0 0" }}>
                  <AccountCircleIcon style={{ fontSize: "2rem" }} />
                </ListItemIcon>
                <Stack>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    {userData.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{
                      marginLeft: "0px",
                      color: userData.administrator ? "yellow" : "inherit",
                    }}
                  >
                    {userData.administrator ? "Admin" : "User"}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <div className={classes.content}>
        <div className={classes.sidebar}>
          <Paper square elevation={3} className={classes.header}>
            <MainToolbar
              filteredDevices={filteredDevices}
              devicesOpen={devicesOpen}
              setDevicesOpen={setDevicesOpen}
              keyword={keyword}
              setKeyword={setKeyword}
              filter={filter}
              setFilter={setFilter}
              filterSort={filterSort}
              setFilterSort={setFilterSort}
              filterMap={filterMap}
              setFilterMap={setFilterMap}
            />
          </Paper>
          <div className={classes.middle}>
            {!desktop && (
              <div className={classes.contentMap}>
                <MainMap
                  filteredPositions={filteredPositions}
                  selectedPosition={selectedPosition}
                  onEventsClick={onEventsClick}
                />
              </div>
            )}
            <Paper
              square
              className={classes.contentList}
              style={devicesOpen ? {} : { visibility: "hidden" }}
            >
              <DeviceList devices={filteredDevices} />
            </Paper>
          </div>

          {desktop && (
            <div className={classes.footer}>{/* <BottomMenu /> */}</div>
          )}
        </div>

        {desktop && (
          <div className={classes.middle}>
            <MainMap
              filteredPositions={filteredPositions}
              selectedPosition={selectedPosition}
              onEventsClick={onEventsClick}
            />
          </div>
        )}
      </div>

      <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />
      {selectedDeviceId && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={selectedPosition}
          onClose={() => dispatch(devicesActions.selectId(null))}
          desktopPadding={theme.dimensions.drawerWidthDesktop}
        />
      )}
    </div>
  );
};

export default TestPage;

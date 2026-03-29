import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip,
  Fade,
  Backdrop,
  CircularProgress,
  ListItemButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Pets as PetsIcon,
  AssignmentTurnedIn as AdoptionIcon,
  People as UsersIcon,
  ReportProblem as ReportIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  FindInPage as LostIcon,
  Event as EventIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

import DashboardOverview from "../dashboard-overview/DashboardOverview";
import ManagePets from "../manage-pets/ManagePets";
import ManageAdoptionRequests from "../adoption-requests/AdminAdoptionRequests";
import ManageUsers from "../manage-users/ManageUsers";
import ReportedStrayAnimals from "../manage-reported-animals/ReportedStrayAnimals";
import ManageLostReports from "../manage-lost-reports/ManageLostReports";
import AddEvent from "../add-event/AddEvent";
import "./AdminDashboard.css";

const drawerWidth = 260;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 5,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [open, setOpen] = useState(true);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const isNotificationsMenuOpen = Boolean(notificationsAnchorEl);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);
  
  // Auth check
  useEffect(() => {
    const adminUser = localStorage.getItem('pawfinderAdminUser');
    if (!adminUser) {
      navigate('/login');
    } else {
      // Simulate loading state for UI
      setLoading(true);
      setTimeout(() => setLoading(false), 800);
    }
  }, [navigate]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('pawfinderAdminUser');
      navigate('/login');
    }, 500);
  };

  const handleTabChange = (tab: string) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false);
      if (isMobile) {
        setOpen(false);
      }
    }, 400);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You would implement actual theme switching here
  };
  
  // Get user data
  const userDataString = localStorage.getItem('pawfinderAdminUser');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  // Sample notifications
  const notifications = [
    { id: 1, type: 'adoption', message: 'New adoption request from John Doe', time: '5 minutes ago' },
    { id: 2, type: 'report', message: 'New stray animal reported in Downtown', time: '1 hour ago' },
    { id: 3, type: 'user', message: 'New user registration: Sarah Smith', time: '3 hours ago' },
  ];

  const menuItems = [
    { id: "dashboard", text: "Dashboard Overview", icon: <DashboardIcon /> },
    { id: "managePets", text: "Manage Pets", icon: <PetsIcon /> },
    { id: "adoptionRequests", text: "Adoption Requests", icon: <AdoptionIcon /> },
    { id: "manageUsers", text: "Manage Users", icon: <UsersIcon /> },
    { id: "reportedStrays", text: "Reported Strays", icon: <ReportIcon /> },
    { id: "lost", text: "Missing Pet Reports", icon: <LostIcon /> },
    { id: "addEvent", text: "Events Management", icon: <EventIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "managePets":
        return <ManagePets />;
      case "adoptionRequests":
        return <ManageAdoptionRequests />;
      case "manageUsers":
        return <ManageUsers />;
      case "reportedStrays":
        return <ReportedStrayAnimals />;
      case "lost":
        return <ManageLostReports />;
      case "addEvent":
        return <AddEvent />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      
      {/* Loading backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: open ? `${drawerWidth}px` : 0 },
          boxShadow: 'none',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'primary.main' }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.primary', fontWeight: 600 }}
          >
            {menuItems.find(item => item.id === activeTab)?.text || "Dashboard"}
          </Typography>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: 'text.secondary' }}/>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              sx={{ color: 'text.primary' }}
            />
          </Search>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Toggle dark/light mode">
              <IconButton sx={{ mr: 1, color: 'text.secondary' }} onClick={toggleDarkMode}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Help">
              <IconButton sx={{ mr: 1, color: 'text.secondary' }}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton
                aria-label="show new notifications"
                color="inherit"
                onClick={handleNotificationsMenuOpen}
                sx={{ mr: 1, color: 'text.secondary' }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {userData && (
              <Tooltip title="Account settings">
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar 
                    src={userData.avatar}
                    alt={userData.name}
                    sx={{ 
                      width: 35, 
                      height: 35,
                      border: '2px solid', 
                      borderColor: 'primary.main' 
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        id="notifications-menu"
        keepMounted
        open={isNotificationsMenuOpen}
        onClose={handleNotificationsMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            width: 320,
            maxHeight: 360,
            borderRadius: 2,
            mt: 1.5,
            '& .MuiMenuItem-root': {
              py: 1.5
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography sx={{ p: 2, pb: 1, fontWeight: 600 }}>
          Notifications
        </Typography>
        <Divider />
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationsMenuClose}>
            <Box sx={{ 
              display: 'flex', 
              width: '100%', 
              alignItems: 'flex-start',
              borderLeft: '4px solid',
              borderColor: notification.type === 'adoption' 
                ? 'primary.main' 
                : notification.type === 'report' 
                  ? 'error.main' 
                  : 'success.main',
              pl: 1
            }}>
              <Box sx={{ mr: 1.5, mt: 0.5 }}>
                {notification.type === 'adoption' ? (
                  <AdoptionIcon color="primary" fontSize="small" />
                ) : notification.type === 'report' ? (
                  <ReportIcon color="error" fontSize="small" />
                ) : (
                  <UsersIcon color="success" fontSize="small" />
                )}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem 
          onClick={handleNotificationsMenuClose}
          sx={{ justifyContent: 'center', color: 'primary.main', fontWeight: 500 }}
        >
          View All Notifications
        </MenuItem>
      </Menu>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        id="profile-menu"
        keepMounted
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { width: 220, borderRadius: 2, mt: 1.5 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {userData && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {userData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData.email}
            </Typography>
          </Box>
        )}
        
        <Divider />
        
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Avatar sx={{ width: 24, height: 24 }} />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
        </MenuItem>
      </Menu>
      
      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
            ...(isMobile && {
              top: 0,
              height: '100%',
            }),
          },
          zIndex: theme.zIndex.drawer,
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 2.5,
          backgroundColor: 'primary.main',
          color: 'white'
        }}>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1
            }}>
              <PetsIcon sx={{ fontSize: 32 }} />
              <Typography variant="h5" fontWeight="bold">
                PawFinder
              </Typography>
            </Box>
          </motion.div>
        </Box>
        
        <Divider />
        
        {userData && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05)
          }}>
            <Avatar 
              src={userData.avatar} 
              alt={userData.name} 
              sx={{ 
                width: 42, 
                height: 42, 
                mr: 2,
                border: '2px solid', 
                borderColor: 'primary.main'
              }} 
            />
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                {userData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {userData.role}
              </Typography>
            </Box>
          </Box>
        )}
        
        <Divider />
        
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.id}
              component="div"
              disablePadding
              sx={{
                mb: 0.5,
                display: 'block',
                mx: 1,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItemButton
                  selected={activeTab === item.id}
                  onClick={() => handleTabChange(item.id)}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                        color: 'white',
                      },
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: 'center',
                      color: activeTab === item.id ? 'white' : 'primary.main',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontWeight: activeTab === item.id ? 600 : 400,
                    }} 
                  />
                </ListItemButton>
              </motion.div>
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} PawFinder Admin
          </Typography>
        </Box>
      </Drawer>
      
      {/* Main content */}
      <Main open={open} sx={{ 
        flexGrow: 1, 
        height: '100vh',
        overflow: 'auto',
        bgcolor: 'background.default',
        pt: { xs: 8, sm: 9 },
        px: { xs: 2, sm: 3 }
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 2,
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
              minHeight: 'calc(100vh - 100px)'
            }}
          >
            {renderContent()}
          </Paper>
        </motion.div>
      </Main>
    </Box>
  );
};

export default AdminDashboard;

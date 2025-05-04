import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Palette,
  Dashboard,
  RateReview,
  Logout,
  Login,
  PersonAdd,
  Home,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
    setDrawerOpen(false);
  };

  const isMenuOpen = Boolean(anchorEl);

  const mobileDrawer = (
    <Box
      role="presentation"
      onClick={handleDrawerToggle}
      sx={{ width: 250 }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div">
          AI 패션 콜렉티브
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => handleNavigate('/')}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="홈" />
        </ListItem>
        
        {isAuthenticated ? (
          <>
            <ListItem button onClick={() => handleNavigate('/dashboard')}>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="대시보드" />
            </ListItem>
            <ListItem button onClick={() => handleNavigate('/design-studio')}>
              <ListItemIcon>
                <Palette />
              </ListItemIcon>
              <ListItemText primary="디자인 스튜디오" />
            </ListItem>
            <ListItem button onClick={() => handleNavigate('/design-evaluation')}>
              <ListItemIcon>
                <RateReview />
              </ListItemIcon>
              <ListItemText primary="디자인 평가" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => handleNavigate('/profile')}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="프로필" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="로그아웃" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button onClick={() => handleNavigate('/login')}>
              <ListItemIcon>
                <Login />
              </ListItemIcon>
              <ListItemText primary="로그인" />
            </ListItem>
            <ListItem button onClick={() => handleNavigate('/register')}>
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="회원가입" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleNavigate('/profile')}>프로필</MenuItem>
      <MenuItem onClick={() => handleNavigate('/dashboard')}>대시보드</MenuItem>
      <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            AI 패션 콜렉티브
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
              >
                홈
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/dashboard"
                  >
                    대시보드
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/design-studio"
                  >
                    디자인 스튜디오
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/design-evaluation"
                  >
                    디자인 평가
                  </Button>
                </>
              ) : null}
            </Box>
          )}

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {user?.profileImage ? (
                  <Avatar 
                    src={user.profileImage} 
                    alt={user.name} 
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Box>
          ) : (
            <Box>
              {!isMobile ? (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/login"
                  >
                    로그인
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/register"
                    variant="outlined"
                    sx={{ ml: 1, borderColor: 'white', color: 'white' }}
                  >
                    회원가입
                  </Button>
                </>
              ) : (
                <IconButton
                  edge="end"
                  aria-label="account menu"
                  aria-haspopup="true"
                  onClick={handleDrawerToggle}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {mobileDrawer}
      </Drawer>
    </>
  );
};

export default Header;
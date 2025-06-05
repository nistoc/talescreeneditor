import React, { useState } from 'react';
import { Box, Container, Typography, AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { AdminUsersPage } from './pages/AdminUsersPage';
import ProfilePage from './pages/ProfilePage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ScenarioPage } from './pages/ScenarioPage';
import { ProfileEditorPage } from './pages/ProfileEditorPage'; 
import AdminPage from './pages/AdminPage';

const NavigationDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const menuItems = [
    { text: 'Сценарии', path: '/scenarios', icon: <DashboardIcon /> },
    { text: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> },
    { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} component={Link} to={item.path} onClick={onClose}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Button component={Link} to="/" color="inherit">
        Home
      </Button>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <Box key={to} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ mx: 1 }}>/</Typography>
            <Button
              component={Link}
              to={to}
              color={last ? 'primary' : 'inherit'}
              disabled={last}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Tales Screen Editor
            </Typography>
          </Toolbar>
        </AppBar>
        <NavigationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Welcome to Tales Screen Editor
                </Typography>
                <Typography variant="body1">
                  This is your new React application with TypeScript and Material UI.
                </Typography>
              </Box>
            } />
            <Route path="/scenarios" element={<ScenariosPage />} />
            <Route path="/scenarios/:scenarioId" element={<ScenarioPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditorPage />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App; 
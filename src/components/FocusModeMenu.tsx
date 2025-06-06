import React, { useState } from 'react';
import { Box, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Link } from 'react-router-dom';

export const FocusModeMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { text: 'Scenarios', path: '/scenarios', icon: <DashboardIcon /> },
    { text: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> },
    { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
  ];

  return (
    <>
      <Tooltip title="Menu">
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                component={Link} 
                to={item.path} 
                onClick={() => setIsOpen(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}; 
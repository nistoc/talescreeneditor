import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FocusModeMenu } from '../components/FocusModeMenu';
import { useFocusMode } from '../contexts/FocusModeContext';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFocusMode } = useFocusMode();

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        {isFocusMode && <FocusModeMenu />}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        {isFocusMode && (
          <Typography variant="h5" component="div">
            Admin Dashboard
          </Typography>
        )}
      </Box>

      {!isFocusMode && (
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/admin/users')}
              >
                Manage Users
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Settings
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="success"
              >
                System Configuration
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage; 
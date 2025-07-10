import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Avatar, Grid, CircularProgress, Alert } from '@mui/material';
import { useProfile } from '../api/profile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FocusModeMenu } from '../components/FocusModeMenu';
import { useFocusMode } from '../contexts/FocusModeContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const userId = 1; // В реальном приложении это должно приходить из контекста авторизации
  const { data: profile, isLoading, error } = useProfile(userId);
  const { isFocusMode } = useFocusMode();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box p={2}>
        <Alert severity="error">Error loading profile</Alert>
      </Box>
    );
  }

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
            Profile
          </Typography>
        )}
      </Box>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {!isFocusMode && (
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
        )}
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <Grid item>
              <Avatar 
                src={profile?.avatar} 
                sx={{ width: 96, height: 96 }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h6">{profile?.name}</Typography>
              <Typography color="text.secondary">{profile?.email}</Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {profile?.role === 'admin' ? 'Administrator' : 'User'}
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Registration Date
              </Typography>
              <Typography>
                {new Date(profile?.createdAt || '').toLocaleDateString()}
              </Typography>
            </Box>
            
            {profile?.lastLogin && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Login
                </Typography>
                <Typography>
                  {new Date(profile.lastLogin).toLocaleString()}
                </Typography>
              </Box>
            )}
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/profile/edit')}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfilePage; 
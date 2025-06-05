import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Avatar, Grid } from '@mui/material';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <Grid item>
              <Avatar sx={{ width: 96, height: 96 }} />
            </Grid>
            <Grid item>
              <Typography variant="h6">User Name</Typography>
              <Typography color="text.secondary">user@example.com</Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Bio
              </Typography>
              <Typography>User bio goes here...</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Location
              </Typography>
              <Typography>User location</Typography>
            </Box>
            
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
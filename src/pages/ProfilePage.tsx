import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Avatar, Grid, CircularProgress, Alert } from '@mui/material';
import { useProfile } from '../api/profile';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const userId = 1; // В реальном приложении это должно приходить из контекста авторизации
  const { data: profile, isLoading, error } = useProfile(userId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">Ошибка загрузки профиля</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Профиль
        </Typography>
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
                Роль: {profile?.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Дата регистрации
              </Typography>
              <Typography>
                {new Date(profile?.createdAt || '').toLocaleDateString()}
              </Typography>
            </Box>
            
            {profile?.lastLogin && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Последний вход
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
              Редактировать профиль
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfilePage; 
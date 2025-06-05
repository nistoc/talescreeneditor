import React from 'react';
import { useProfile, useUpdateProfile } from '../api/profile';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';

export const ProfileEditorPage: React.FC = () => {
  const userId = 1; // В реальном приложении это должно приходить из контекста авторизации
  const { data: profile, isLoading, error } = useProfile(userId);
  const updateProfile = useUpdateProfile(userId);

  const [formData, setFormData] = React.useState({
    name: profile?.name || '',
    email: profile?.email || '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

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
        <Alert severity="error">Error loading profile</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} maxWidth="400px">
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}; 
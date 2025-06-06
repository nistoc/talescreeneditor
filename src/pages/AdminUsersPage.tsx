import React from 'react';
import { useAdminStats, useUsers, useUpdateUserStatus } from '../api/admin';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FocusModeMenu } from '../components/FocusModeMenu';
import { useFocusMode } from '../contexts/FocusModeContext';

export const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = React.useState(1);
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers(page);
  const updateUserStatus = useUpdateUserStatus(0); // userId будет установлен при вызове
  const { isFocusMode } = useFocusMode();

  const handleStatusChange = (userId: number, newStatus: 'active' | 'inactive' | 'banned') => {
    updateUserStatus.mutate(newStatus, {
      onSuccess: () => {
        // Можно добавить обновление списка пользователей
      },
    });
  };

  if (statsLoading || usersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (statsError || usersError) {
    return (
      <Box p={2}>
        <Alert severity="error">Error loading data</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isFocusMode ? 0 : 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        {isFocusMode && <FocusModeMenu />}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
        >
          Back to Admin
        </Button>
        {isFocusMode && (
          <Typography variant="h5" component="div">
            User Management
          </Typography>
        )}
      </Box>

      {!isFocusMode && (
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
      )}

      {/* Statistics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h5">{stats?.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h5">{stats?.activeUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Projects
              </Typography>
              <Typography variant="h5">{stats?.totalScenarios}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Projects
              </Typography>
              <Typography variant="h5">{stats?.activeScenarios}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ 
        '& .MuiTableCell-root': {
          px: isFocusMode ? 1 : 2,
          py: isFocusMode ? 1 : 2
        }
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="contained"
                      color={user.status === 'active' ? 'error' : 'success'}
                      onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleStatusChange(user.id, 'banned')}
                    >
                      Ban
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 
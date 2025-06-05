import React from 'react';
import { useAdminStats, useUsers, useUpdateUserStatus } from '../api/admin';
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

export const AdminUsersPage: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers(page);
  const updateUserStatus = useUpdateUserStatus(0); // userId будет установлен при вызове

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
        <Alert severity="error">Ошибка загрузки данных</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Управление пользователями
      </Typography>

      {/* Статистика */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Всего пользователей
              </Typography>
              <Typography variant="h5">{stats?.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Активных пользователей
              </Typography>
              <Typography variant="h5">{stats?.activeUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Всего проектов
              </Typography>
              <Typography variant="h5">{stats?.totalProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Активных проектов
              </Typography>
              <Typography variant="h5">{stats?.activeProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Таблица пользователей */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
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
                      {user.status === 'active' ? 'Деактивировать' : 'Активировать'}
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleStatusChange(user.id, 'banned')}
                    >
                      Забанить
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
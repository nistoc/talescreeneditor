import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject } from '../api/projects';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(Number(projectId));
  const updateProject = useUpdateProject(Number(projectId));

  const handleStatusChange = (newStatus: 'active' | 'archived' | 'draft') => {
    updateProject.mutate(
      { status: newStatus },
      {
        onSuccess: () => {
          // Можно добавить уведомление об успешном обновлении
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box p={2}>
        <Alert severity="error">Ошибка загрузки проекта</Alert>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'archived':
        return 'error';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box p={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/projects')}
        sx={{ mb: 3 }}
      >
        Назад к списку проектов
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" component="h1">
                {project.title}
              </Typography>
              <Chip
                label={project.status}
                color={getStatusColor(project.status)}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Описание
            </Typography>
            <Typography variant="body1" paragraph>
              {project.description}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Информация о проекте
            </Typography>
            <Box>
              <Typography variant="body2" color="textSecondary">
                ID проекта: {project.id}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Создан: {new Date(project.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Обновлен: {new Date(project.updatedAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Владелец: {project.ownerId}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStatusChange('active')}
                disabled={project.status === 'active'}
              >
                Активировать
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleStatusChange('draft')}
                disabled={project.status === 'draft'}
              >
                В черновики
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleStatusChange('archived')}
                disabled={project.status === 'archived'}
              >
                Архивировать
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}; 
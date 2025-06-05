import React from 'react';
import { useProjects, useCreateProject, useUpdateProject } from '../api/projects';
import { Project } from '../types/api.projects';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newProject, setNewProject] = React.useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    status: 'draft',
    ownerId: 1, // В реальном приложении это должно приходить из контекста авторизации
    collaborators: [],
  });

  const { data: projects, isLoading, error } = useProjects(page);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject('0'); // projectId будет установлен при вызове

  const handleCreateProject = () => {
    createProject.mutate(newProject, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewProject({
          title: '',
          description: '',
          status: 'draft',
          ownerId: 1,
          collaborators: [],
        });
      },
    });
  };

  const handleStatusChange = (projectId: string, newStatus: 'active' | 'archived' | 'draft') => {
    updateProject.mutate(
      { status: newStatus },
      {
        onSuccess: () => {
          // Можно добавить обновление списка проектов
        },
      }
    );
  };

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
        <Alert severity="error">Ошибка загрузки проектов</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Проекты</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Создать проект
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects?.map((project: Project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" gutterBottom>
                    {project.title}
                  </Typography>
                  <Chip
                    label={project.status}
                    color={getStatusColor(project.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {project.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Создан: {new Date(project.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  Подробнее
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleStatusChange(project.id, 'active')}
                  disabled={project.status === 'active'}
                >
                  Активировать
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleStatusChange(project.id, 'archived')}
                  disabled={project.status === 'archived'}
                >
                  Архивировать
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Диалог создания проекта */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
        <DialogTitle>Создать новый проект</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Название"
              value={newProject.title}
              onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Описание"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={handleCreateProject}
            variant="contained"
            color="primary"
            disabled={!newProject.title || createProject.isPending}
          >
            {createProject.isPending ? 'Создание...' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 
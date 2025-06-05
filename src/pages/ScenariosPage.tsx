import React from 'react';
import { useScenarios, useCreateScenario, useUpdateScenario } from '../api/scenarios';
import { Scenario } from '../types/api.scenarios';
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

export const ScenariosPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newScenario, setNewScenario] = React.useState<Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    status: 'draft',
    ownerId: 1, // В реальном приложении это должно приходить из контекста авторизации
    characters: [],
    maxBranchLength: 0,
    firstScreenId: '',
    screens: []
  });

  const { data: scenarios, isLoading, error } = useScenarios(page);
  const createScenario = useCreateScenario();
  const updateScenario = useUpdateScenario('new_scenario');

  const handleCreateScenario = () => {
    createScenario.mutate(newScenario, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewScenario({
          title: '',
          description: '',
          status: 'draft',
          ownerId: 1,
          characters: [],
          maxBranchLength: 0,
          firstScreenId: '',
          screens: []
        });
      },
    });
  };

  const handleStatusChange = (scenarioId: string, newStatus: 'active' | 'archived' | 'draft') => {
    updateScenario.mutate(
      { status: newStatus },
      {
        onSuccess: () => {
          // Можно добавить обновление списка сценариев
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
        <Alert severity="error">Error loading scenarios</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Scenarios</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create Scenario
        </Button>
      </Box>

      <Grid container spacing={3}>
        {scenarios?.map((scenario: Scenario) => (
          <Grid item xs={12} sm={6} md={4} key={scenario.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" gutterBottom>
                    {scenario.title}
                  </Typography>
                  <Chip
                    label={scenario.status}
                    color={getStatusColor(scenario.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {scenario.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created: {new Date(scenario.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/scenarios/${scenario.id}`)}
                >
                  Details
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleStatusChange(scenario.id, 'active')}
                  disabled={scenario.status === 'active'}
                >
                  Activate
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleStatusChange(scenario.id, 'archived')}
                  disabled={scenario.status === 'archived'}
                >
                  Archive
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Scenario Dialog */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
        <DialogTitle>Create New Scenario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={newScenario.title}
            onChange={(e) => setNewScenario({ ...newScenario, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newScenario.description}
            onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateScenario}
            variant="contained"
            color="primary"
            disabled={!newScenario.title || createScenario.isPending}
          >
            {createScenario.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 
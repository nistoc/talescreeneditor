import React from 'react';
import { useScenarios, useUpdateScenario } from '../api/scenarios';
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
  Chip,
} from '@mui/material';
import { CreateScenarioModal } from '../modals/CreateScenarioModal';

export const ScenariosPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const { data: scenarios, isLoading, error } = useScenarios(page);
  const updateScenario = useUpdateScenario('new_scenario');

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
                <Box mb={2}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Male Intro:
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {scenario.intro?.mal.content || 'No male intro available'}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ mt: 2 }}>
                    Female Intro:
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {scenario.intro?.fem.content || 'No female intro available'}
                  </Typography>
                </Box>
                {scenario.price && (
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Price: {scenario.price.value} {scenario.price.type}
                  </Typography>
                )}
                {scenario.genres && scenario.genres.length > 0 && (
                  <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
                    {scenario.genres.map((genre) => (
                      <Chip key={genre} label={genre} size="small" />
                    ))}
                  </Box>
                )}
                {scenario.createdDate && (
                  <Typography variant="body2" color="textSecondary">
                    Created: {new Date(scenario.createdDate).toLocaleDateString()}
                  </Typography>
                )}
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

      <CreateScenarioModal
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          // Можно добавить обновление списка сценариев
        }}
      />
    </Box>
  );
}; 
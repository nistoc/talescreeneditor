import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScenario, useUpdateScenario } from '../api/scenarios';
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

export const ScenarioPage: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  if (!scenarioId) {
    throw new Error('Scenario ID is required');
  }
  const navigate = useNavigate();
  const { data: scenario, isLoading, error } = useScenario(scenarioId);
  const updateScenario = useUpdateScenario(scenarioId);

  const handleStatusChange = (newStatus: 'active' | 'archived' | 'draft') => {
    updateScenario.mutate(
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

  if (error || !scenario) {
    return (
      <Box p={2}>
        <Alert severity="error">Error loading scenario</Alert>
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
        onClick={() => navigate('/scenarios')}
        sx={{ mb: 3 }}
      >
        Back to Scenarios
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">{scenario.title}</Typography>
          <Chip
            label={scenario.status}
            color={getStatusColor(scenario.status)}
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography color="textSecondary" paragraph>
              {scenario.description}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Scenario Information
            </Typography>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Project ID: {scenario.id}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Created: {new Date(scenario.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Updated: {new Date(scenario.updatedAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Owner: {scenario.ownerId}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStatusChange('active')}
                disabled={scenario.status === 'active'}
              >
                Activate
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleStatusChange('draft')}
                disabled={scenario.status === 'draft'}
              >
                Move to Draft
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleStatusChange('archived')}
                disabled={scenario.status === 'archived'}
              >
                Archive
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}; 
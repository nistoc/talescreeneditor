import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useScenario, useUpdateScenario } from '../api/scenarios';
import { ScenarioDetails } from '../components/ScenarioDetails';
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
import { FocusModeMenu } from '../components/FocusModeMenu';

export const ScenarioPage: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  if (!scenarioId) {
    throw new Error('Scenario ID is required');
  }
  const navigate = useNavigate();
  const location = useLocation();
  const { data: scenario, isLoading, error } = useScenario(scenarioId);
  const updateScenario = useUpdateScenario(scenarioId);
  const isFocusMode = new URLSearchParams(location.search).get('focus') === 'true';

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
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        {isFocusMode && <FocusModeMenu />}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/scenarios')}
        >
          Back to Scenarios
        </Button>
        {isFocusMode && (
          <Typography variant="h5" component="div">
            {scenario.title}
          </Typography>
        )}
      </Box>

      <Paper sx={{ p: 3 }}>
        {!isFocusMode && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">{scenario.title}</Typography>
            <Chip
              label={scenario.status}
              color={getStatusColor(scenario.status)}
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ScenarioDetails scenario={scenario} />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/scenarios/${scenarioId}/editor`)}
              >
                Edit Scenario
              </Button>
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
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScenario } from '../api/scenarios';
import { ScenarioDetails } from '../components/ScenarioDetails';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const ScenarioEditorPage: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  if (!scenarioId) {
    throw new Error('Scenario ID is required');
  }
  const navigate = useNavigate();
  const { data: scenario, isLoading, error } = useScenario(scenarioId);

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

  return (
    <Box p={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/scenarios/${scenarioId}`)}
        sx={{ mb: 3 }}
      >
        Back to Scenario
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Edit Scenario: {scenario.title}
        </Typography>

        <ScenarioDetails scenario={scenario} />
      </Paper>
    </Box>
  );
}; 
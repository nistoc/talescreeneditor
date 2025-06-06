import React, { useState } from 'react';
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
  ButtonGroup,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { EditorTab } from '../components/editortabs/EditorTab';
import { CharactersTab } from '../components/editortabs/CharactersTab';
import { JsonTab } from '../components/editortabs/JsonTab';
import { RootsTab } from '../components/editortabs/RootsTab';

type TabType = 'editor' | 'characters' | 'json' | 'roots';

export const ScenarioEditorPage: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  if (!scenarioId) {
    throw new Error('Scenario ID is required');
  }
  const navigate = useNavigate();
  const { data: scenario, isLoading, error } = useScenario(scenarioId);
  const [activeTab, setActiveTab] = useState<TabType>('editor');

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return <EditorTab />;
      case 'characters':
        return <CharactersTab />;
      case 'json':
        return <JsonTab />;
      case 'roots':
        return <RootsTab />;
      default:
        return <EditorTab />;
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/scenarios/${scenarioId}`)}
        >
          Back to Scenario
        </Button>
        <ButtonGroup variant="contained">
          <Button
            onClick={() => setActiveTab('editor')}
            disabled={activeTab === 'editor'}
          >
            Editor
          </Button>
          <Button
            onClick={() => setActiveTab('characters')}
            disabled={activeTab === 'characters'}
          >
            Characters
          </Button>
          <Button
            onClick={() => setActiveTab('json')}
            disabled={activeTab === 'json'}
          >
            Json View
          </Button>
          <Button
            onClick={() => setActiveTab('roots')}
            disabled={activeTab === 'roots'}
          >
            Roots
          </Button>
        </ButtonGroup>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Edit Scenario: {scenario.title}
        </Typography>

        {renderTabContent()}
      </Paper>
    </Box>
  );
}; 
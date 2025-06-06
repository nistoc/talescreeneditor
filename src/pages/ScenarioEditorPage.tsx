import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useScenario } from '../api/scenarios';
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
  const location = useLocation();
  const { data: scenario, isLoading, error } = useScenario(scenarioId);
  
  // Get initial tab from URL hash or default to 'editor'
  const getInitialTab = (): TabType => {
    const hash = location.hash.replace('#', '');
    return ['editor', 'characters', 'json', 'roots'].includes(hash) ? hash as TabType : 'editor';
  };
  
  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());

  // Update URL hash when tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

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
    <Box p={3} sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
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

      <Paper sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="div">
            Edit Scenario: {scenario.title}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {renderTabContent()}
        </Box>
      </Paper>
    </Box>
  );
}; 
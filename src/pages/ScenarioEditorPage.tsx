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
import { FocusModeMenu } from '../components/FocusModeMenu';
import { useFocusMode } from '../contexts/FocusModeContext';

type TabType = 'editor' | 'characters' | 'json' | 'roots';

export const ScenarioEditorPage: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  if (!scenarioId) {
    throw new Error('Scenario ID is required');
  }
  const navigate = useNavigate();
  const location = useLocation();
  const { data: scenario, isLoading, error } = useScenario(scenarioId);
  const { isFocusMode } = useFocusMode();

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
    <Box p={3} sx={{ height: isFocusMode ? 'calc(100vh - 0px)' : 'calc(100vh - 149px)', display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          {isFocusMode && <FocusModeMenu />}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/scenarios/${scenarioId}`)}
          >
            Back to Scenario
          </Button>
          {isFocusMode && (
            <Typography variant="h5" component="div">
              {scenario.title}
            </Typography>
          )}
        </Box>
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
        {!isFocusMode && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="div">
              Edit Scenario: {scenario.title}
            </Typography>
          </Box>
        )}

        {renderTabContent()}
      </Paper>
    </Box>
  );
}; 
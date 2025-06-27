import React, { useCallback, useState, useEffect } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useScenarioJson, useUpdateScenarioJson } from '../../api/scenarios.json';
import { JsonEditor } from '../JsonEditor';

export const JsonTab: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const { data: scenarioJson, isLoading, error } = useScenarioJson(scenarioId || '');
  const updateScenarioJson = useUpdateScenarioJson(scenarioId || '');
  const [localJson, setLocalJson] = useState<string | null>(null);

  // Update local state when server data changes
  useEffect(() => {
    if (scenarioJson) {
      setLocalJson(scenarioJson);
    }
  }, [scenarioJson]);

  const handleDownloadJson = useCallback(() => {
    if (!localJson) return;
    
    const blob = new Blob([localJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenario-${scenarioId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [localJson, scenarioId]);

  const handleUpdateJson = useCallback(async () => {
    if (!localJson) return;
    try {
      await updateScenarioJson.mutateAsync(localJson);
    } catch (error) {
      console.error('Error updating JSON:', error);
    }
  }, [updateScenarioJson, localJson]);

  const handleEditorChange = useCallback((newJson: string) => {
    setLocalJson(newJson);
  }, []);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading JSON data</Typography>;
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={handleDownloadJson}
          disabled={!localJson}
        >
          Download JSON
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateJson}
          disabled={!localJson || updateScenarioJson.isPending}
        >
          Update JSON
        </Button>
      </Stack>
      
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <JsonEditor
          value={localJson}
          onChange={handleEditorChange}
          readOnly={false}
        />
      </Box>
    </Box>
  );
}; 
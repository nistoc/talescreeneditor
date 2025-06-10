import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  IconButton,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  CircularProgress,
  Alert,
  ClickAwayListener,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useUpdateScenario, useScenario } from '../../api/scenarios';
import { useParams } from 'react-router-dom';

// Available genres and labels (you might want to move these to a separate constants file)
const AVAILABLE_GENRES = [
  'thriller',
  'romance',
  'mystery',
  'adventure',
  'fantasy',
  'sci-fi',
  'horror',
  'comedy',
  'drama',
];

const AVAILABLE_LABELS = [
  'promo',
  'new',
  'featured',
  'popular',
  'exclusive',
  'limited',
];

export const IntroTab: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  if (!scenarioId) {
    throw new Error('Scenario ID is required');
  }

  const { data: scenario, isLoading, error } = useScenario(scenarioId);
  const updateScenario = useUpdateScenario(scenarioId);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // Update local state when scenario data changes
  useEffect(() => {
    if (scenario) {
      setSelectedGenres(scenario.genres || []);
      setSelectedLabels(scenario.labels || []);
    }
  }, [scenario]);

  const handleEditClick = (field: string, value: any) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleCancelEdit = useCallback(() => {
    setEditingField(null);
    if (scenario) {
      setSelectedGenres(scenario.genres || []);
      setSelectedLabels(scenario.labels || []);
    }
  }, [scenario]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCancelEdit();
    }
  }, [handleCancelEdit]);

  useEffect(() => {
    if (editingField) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [editingField, handleKeyDown]);

  const handleSave = () => {
    if (editingField) {
      updateScenario.mutate(
        { [editingField]: editValue },
        {
          onSuccess: () => {
            setEditingField(null);
          },
        }
      );
    }
  };

  const handleGenresSave = () => {
    updateScenario.mutate(
      { genres: selectedGenres },
      {
        onSuccess: () => {
          setEditingField(null);
        },
      }
    );
  };

  const handleLabelsSave = () => {
    updateScenario.mutate(
      { labels: selectedLabels },
      {
        onSuccess: () => {
          setEditingField(null);
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

  const renderEditableField = (label: string, field: string, value: any, multiline = false) => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: 1, 
        flexDirection: { xs: 'column', sm: 'row' },
        p: 1,
        borderRadius: 1,
        transition: 'all 0.2s ease',
        border: editingField === field ? '1px solid' : 'none',
        borderColor: 'primary.main',
        backgroundColor: editingField === field ? 'action.selected' : 'inherit',
        '&:hover': {
          backgroundColor: editingField === field ? 'action.selected' : 'action.hover'
        }
      }}
    >
      <Typography variant="subtitle2" sx={{ 
        flex: { xs: 'none', sm: '0 0 120px' }, 
        minWidth: { xs: '100%', sm: '120px' },
        fontSize: '0.875rem',
        color: 'text.secondary'
      }}>
        {label}:
      </Typography>
      <Box sx={{ flex: { xs: 'none', sm: 1 }, width: { xs: '100%', sm: 'auto' } }}>
        {editingField === field ? (
          <ClickAwayListener onClickAway={handleCancelEdit}>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                multiline={multiline}
                rows={multiline ? 4 : 1}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                size="small"
                autoFocus
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                <Button onClick={handleSave} variant="contained" size="small">
                  Save
                </Button>
                <Button onClick={handleCancelEdit} variant="outlined" size="small">
                  Cancel
                </Button>
              </Box>
            </Box>
          </ClickAwayListener>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {value || '-'}
            </Typography>
            <Tooltip title="Edit">
              <IconButton 
                size="small" 
                onClick={() => handleEditClick(field, value)}
                color={editingField === field ? 'primary' : 'default'}
                sx={{ 
                  opacity: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );

  const renderMultiSelectField = (
    label: string,
    field: string,
    value: string[],
    options: string[],
    selectedValue: string[],
    setSelectedValue: (value: string[]) => void,
    onSave: () => void
  ) => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: 1, 
        flexDirection: { xs: 'column', sm: 'row' },
        p: 1,
        borderRadius: 1,
        transition: 'all 0.2s ease',
        border: editingField === field ? '1px solid' : 'none',
        borderColor: 'primary.main',
        backgroundColor: editingField === field ? 'action.selected' : 'inherit',
        '&:hover': {
          backgroundColor: editingField === field ? 'action.selected' : 'action.hover'
        }
      }}
    >
      <Typography variant="subtitle2" sx={{ 
        flex: { xs: 'none', sm: '0 0 120px' }, 
        minWidth: { xs: '100%', sm: '120px' },
        fontSize: '0.875rem',
        color: 'text.secondary'
      }}>
        {label}:
      </Typography>
      <Box sx={{ flex: { xs: 'none', sm: 1 }, width: { xs: '100%', sm: 'auto' } }}>
        {editingField === field ? (
          <ClickAwayListener onClickAway={handleCancelEdit}>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select
                  multiple
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value as string[])}
                  input={<OutlinedInput label={label} />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                <Button onClick={onSave} variant="contained" size="small">
                  Save
                </Button>
                <Button onClick={handleCancelEdit} variant="outlined" size="small">
                  Cancel
                </Button>
              </Box>
            </Box>
          </ClickAwayListener>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 1 }}>
              {value?.map((item) => (
                <Chip key={item} label={item} size="small" />
              ))}
            </Box>
            <Tooltip title="Edit">
              <IconButton 
                size="small" 
                onClick={() => handleEditClick(field, value)}
                color={editingField === field ? 'primary' : 'default'}
                sx={{ 
                  opacity: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Typography variant="h6" gutterBottom>
        Scenario Details
      </Typography>

      <Grid container spacing={{ xs: 1, sm: 3 }}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Basic Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderEditableField('Title', 'title', scenario.title)}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Typography variant="subtitle2" sx={{ flex: { xs: 'none', sm: 1 }, minWidth: { xs: '100%', sm: 'auto' } }}>
                  Status:
                </Typography>
                <Typography variant="body2" sx={{ flex: { xs: 'none', sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
                  {scenario.status}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Typography variant="subtitle2" sx={{ flex: { xs: 'none', sm: 1 }, minWidth: { xs: '100%', sm: 'auto' } }}>
                  ID:
                </Typography>
                <Typography variant="body2" sx={{ flex: { xs: 'none', sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
                  {scenario.id}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Typography variant="subtitle2" sx={{ flex: { xs: 'none', sm: 1 }, minWidth: { xs: '100%', sm: 'auto' } }}>
                  Owner ID:
                </Typography>
                <Typography variant="body2" sx={{ flex: { xs: 'none', sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
                  {scenario.ownerId}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Dates and Structure */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Dates and Structure
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Typography variant="subtitle2" sx={{ flex: { xs: 'none', sm: 1 }, minWidth: { xs: '100%', sm: 'auto' } }}>
                  Created Date:
                </Typography>
                <Typography variant="body2" sx={{ flex: { xs: 'none', sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
                  {new Date(scenario.createdDate || '').toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Typography variant="subtitle2" sx={{ flex: { xs: 'none', sm: 1 }, minWidth: { xs: '100%', sm: 'auto' } }}>
                  Updated At:
                </Typography>
                <Typography variant="body2" sx={{ flex: { xs: 'none', sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
                  {new Date(scenario.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
              {renderEditableField('First Screen ID', 'firstScreenId', scenario.firstScreenId)}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Typography variant="subtitle2" sx={{ flex: { xs: 'none', sm: 1 }, minWidth: { xs: '100%', sm: 'auto' } }}>
                  Max Branch Length:
                </Typography>
                <Typography variant="body2" sx={{ flex: { xs: 'none', sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
                  {scenario.maxBranchLength}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Content */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Content
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderEditableField('Animated Cover', 'animatedCover', scenario.animatedCover)}
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                gap: 3,
                '& > div': {
                  flex: 1,
                  minWidth: 0
                }
              }}>
                {/* Male Intro */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}>
                    Male Intro
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {renderEditableField('Content', 'intro.mal.content', scenario.intro?.mal.content, true)}
                    {renderEditableField('Image', 'intro.mal.image', scenario.intro?.mal.image)}
                  </Box>
                </Paper>

                {/* Female Intro */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}>
                    Female Intro
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {renderEditableField('Content', 'intro.fem.content', scenario.intro?.fem.content, true)}
                    {renderEditableField('Image', 'intro.fem.image', scenario.intro?.fem.image)}
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Metadata */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Metadata
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderMultiSelectField(
                'Genres',
                'genres',
                scenario.genres || [],
                AVAILABLE_GENRES,
                selectedGenres,
                setSelectedGenres,
                handleGenresSave
              )}
              {renderMultiSelectField(
                'Labels',
                'labels',
                scenario.labels || [],
                AVAILABLE_LABELS,
                selectedLabels,
                setSelectedLabels,
                handleLabelsSave
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 
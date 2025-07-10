import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
} from '@mui/material';
import { Scenario } from '../types/api.scenarios';

interface ScenarioDetailsProps {
  scenario: Scenario;
}

export const ScenarioDetails: React.FC<ScenarioDetailsProps> = ({ scenario }) => {
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
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Scenario Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">ID</Typography>
          <Typography variant="body1">{scenario.id}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">Title</Typography>
          <Typography variant="body1">{scenario.title}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">Status</Typography>
          <Chip
            label={scenario.status}
            color={getStatusColor(scenario.status)}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">Owner ID</Typography>
          <Typography variant="body1">{scenario.ownerId}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">Updated At</Typography>
          <Typography variant="body1">
            {new Date(scenario.updatedAt).toLocaleString()}
          </Typography>
        </Grid>
        {scenario.price && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Price</Typography>
            <Typography variant="body1">
              {scenario.price.value} {scenario.price.type}
            </Typography>
          </Grid>
        )}
        {scenario.genres && scenario.genres.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">Genres</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {scenario.genres.map((genre) => (
                <Chip key={genre} label={genre} size="small" />
              ))}
            </Box>
          </Grid>
        )}
        {scenario.labels && scenario.labels.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">Labels</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {scenario.labels.map((label) => (
                <Chip key={label} label={label} size="small" />
              ))}
            </Box>
          </Grid>
        )}
        {scenario.createdDate && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Created Date</Typography>
            <Typography variant="body1">
              {new Date(scenario.createdDate).toLocaleDateString()}
            </Typography>
          </Grid>
        )}
        {scenario.intro && (
          <>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">Male Intro</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {scenario.intro.mal.content || 'No male intro available'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">Female Intro</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {scenario.intro.fem.content || 'No female intro available'}
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}; 
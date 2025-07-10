import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { CharacterFormData } from './types/character';

interface CharacterEditModalProps {
  open: boolean;
  onClose: () => void;
  formData: CharacterFormData;
  onFormChange: (field: keyof CharacterFormData) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => void;
  onSave: () => void;
}

export const CharacterEditModal: React.FC<CharacterEditModalProps> = ({
  open,
  onClose,
  formData,
  onFormChange,
  onSave,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Edit Character</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
          mt: 1,
          width: '100%'
        }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={onFormChange('name')}
            fullWidth
            required
          />
          <TextField
            select
            label="Type"
            value={formData.type}
            onChange={onFormChange('type')}
            fullWidth
            required
          >
            <MenuItem value="player">Player</MenuItem>
            <MenuItem value="npc">NPC</MenuItem>
          </TextField>
          <TextField
            select
            label="Gender"
            value={formData.gender}
            onChange={onFormChange('gender')}
            fullWidth
            required
          >
            <MenuItem value="mal">Male</MenuItem>
            <MenuItem value="fem">Female</MenuItem>
          </TextField>
          <TextField
            label="Image"
            value={formData.image}
            onChange={onFormChange('image')}
            fullWidth
          />
          <TextField
            label="Notes"
            value={formData.notes}
            onChange={onFormChange('notes')}
            fullWidth
            multiline
            rows={4}
            sx={{ gridColumn: '1 / -1' }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onSave} 
          variant="contained" 
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { Character } from '../types/api.scenarios';

interface CharacterDeleteModalProps {
  open: boolean;
  onClose: () => void;
  character: Character | null;
  onConfirm: () => void;
}

export const CharacterDeleteModal: React.FC<CharacterDeleteModalProps> = ({
  open,
  onClose,
  character,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Delete Character</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete character "{character?.name}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 
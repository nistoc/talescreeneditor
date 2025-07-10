import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import { Scenario } from '../types/api.scenarios';
import { useCreateScenario } from '../api/scenarios';

interface CreateScenarioModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateScenarioModal: React.FC<CreateScenarioModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = React.useState<Partial<Scenario>>({
    title: '',
    status: 'draft',
    price: {
      type: 'credits',
      value: 0
    },
    intro: {
      mal: { content: '', image: '' },
      fem: { content: '', image: '' }
    },
    genres: [],
    labels: []
  });

  const createScenario = useCreateScenario();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createScenario.mutate(formData as Omit<Scenario, 'id' | 'updatedAt'>, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Scenario</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'active' | 'archived' })}
                required
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price (credits)"
                value={formData.price?.value || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  price: {
                    type: 'credits',
                    value: Number(e.target.value)
                  }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Male Intro Content"
                value={formData.intro?.mal.content || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  intro: {
                    mal: {
                      content: e.target.value,
                      image: formData.intro?.mal?.image || ''
                    },
                    fem: {
                      content: formData.intro?.fem?.content || '',
                      image: formData.intro?.fem?.image || ''
                    }
                  }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Female Intro Content"
                value={formData.intro?.fem.content || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  intro: {
                    mal: {
                      content: formData.intro?.mal?.content || '',
                      image: formData.intro?.mal?.image || ''
                    },
                    fem: {
                      content: e.target.value,
                      image: formData.intro?.fem?.image || ''
                    }
                  }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 
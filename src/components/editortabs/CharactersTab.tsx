import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useScenario } from '../../api/scenarios';
import { useUpdateCharacterOrder, useUpdateCharacter, useDeleteCharacter, useAddCharacter } from '../../api/scenarios.characters';
import { Character } from '../../types/api.scenarios';

interface CharacterFormData {
  name: string;
  type: 'player' | 'npc';
  gender: 'mal' | 'fem';
  image: string;
  notes: string;
}

const defaultCharacterForm: CharacterFormData = {
  name: '',
  type: 'npc',
  gender: 'mal',
  image: '',
  notes: '',
};

interface SortableCharacterItemProps {
  character: Character;
  index: number;
  onEdit: (character: Character, index: number) => void;
  onDelete: (characterId: string) => void;
}

const SortableCharacterItem: React.FC<SortableCharacterItemProps> = ({ character, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: character.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          transition: 'background-color 0.2s ease',
        }
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
        <Box
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            }
          }}
          style={style}
        >
          <ListItemAvatar>
            <Avatar src={character.image} alt={character.name} />
          </ListItemAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <ListItemText primary={character.name} />
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip
                size="small"
                label={character.type}
                color={character.type === 'player' ? 'primary' : 'default'}
              />
              <Chip
                size="small"
                label={character.gender}
                color={character.gender === 'mal' ? 'info' : 'secondary'}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => onEdit(character, index)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => onDelete(character.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </ListItem>
  );
};

export const CharactersTab: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  if (!scenarioId) {
    throw new Error('Scenario ID is required');
  }

  const { data: scenario } = useScenario(scenarioId);
  const updateCharacterOrder = useUpdateCharacterOrder(scenarioId);
  const updateCharacter = useUpdateCharacter(scenarioId);
  const deleteCharacter = useDeleteCharacter(scenarioId);
  const addCharacter = useAddCharacter(scenarioId);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCharacterIndex, setEditingCharacterIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<CharacterFormData>(defaultCharacterForm);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !scenario) return;

    if (active.id !== over.id) {
      const oldIndex = scenario.characters.findIndex((char) => char.id === active.id);
      const newIndex = scenario.characters.findIndex((char) => char.id === over.id);

      const newOrder = arrayMove(scenario.characters, oldIndex, newIndex).map(char => char.id);
      updateCharacterOrder.mutate(newOrder);
    }
  };

  const handleAddCharacter = () => {
    addCharacter.mutate(formData, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setFormData(defaultCharacterForm);
      },
    });
  };

  const handleEditCharacter = () => {
    if (editingCharacterIndex === null || !scenario) return;

    updateCharacter.mutate(
      { index: editingCharacterIndex, character: formData },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditingCharacterIndex(null);
          setFormData(defaultCharacterForm);
        },
      }
    );
  };

  const handleDeleteCharacter = (characterId: string) => {
    const characterToDelete = scenario?.characters.find(char => char.id === characterId);
    if (characterToDelete && window.confirm(`Are you sure you want to delete character "${characterToDelete.name}"?`)) {
      deleteCharacter.mutate(characterId);
    }
  };

  const openEditDialog = (character: Character, index: number) => {
    setFormData({
      name: character.name,
      type: character.type,
      gender: character.gender,
      image: character.image,
      notes: character.notes,
    });
    setEditingCharacterIndex(index);
    setIsEditDialogOpen(true);
  };

  const handleFormChange = (field: keyof CharacterFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  if (!scenario) return null;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="div">Characters</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Character
        </Button>
      </Box>

      <Paper>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={scenario.characters.map(char => char.id)}
            strategy={verticalListSortingStrategy}
          >
            <List>
              {scenario.characters.map((character, index) => (
                <SortableCharacterItem
                  key={character.id}
                  character={character}
                  index={index}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteCharacter}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </Paper>

      {/* Add Character Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add New Character</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleFormChange('name')}
              fullWidth
            />
            <TextField
              select
              label="Type"
              value={formData.type}
              onChange={handleFormChange('type')}
              fullWidth
            >
              <MenuItem value="player">Player</MenuItem>
              <MenuItem value="npc">NPC</MenuItem>
            </TextField>
            <TextField
              select
              label="Gender"
              value={formData.gender}
              onChange={handleFormChange('gender')}
              fullWidth
            >
              <MenuItem value="mal">Male</MenuItem>
              <MenuItem value="fem">Female</MenuItem>
            </TextField>
            <TextField
              label="Image URL"
              value={formData.image}
              onChange={handleFormChange('image')}
              fullWidth
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleFormChange('notes')}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCharacter} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Character Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Character</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleFormChange('name')}
              fullWidth
            />
            <TextField
              select
              label="Type"
              value={formData.type}
              onChange={handleFormChange('type')}
              fullWidth
            >
              <MenuItem value="player">Player</MenuItem>
              <MenuItem value="npc">NPC</MenuItem>
            </TextField>
            <TextField
              select
              label="Gender"
              value={formData.gender}
              onChange={handleFormChange('gender')}
              fullWidth
            >
              <MenuItem value="mal">Male</MenuItem>
              <MenuItem value="fem">Female</MenuItem>
            </TextField>
            <TextField
              label="Image URL"
              value={formData.image}
              onChange={handleFormChange('image')}
              fullWidth
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleFormChange('notes')}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditCharacter} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 
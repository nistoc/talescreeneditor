import React, { useState, useEffect } from 'react';
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
import { getScenarioImageUrl } from '../../services/imageUtils';

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
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadImage() {
      if (character.image && scenarioId) {
        const url = await getScenarioImageUrl(scenarioId, character.image);
        setImageUrl(url);
      } else {
        setImageUrl(null);
      }
    }
    loadImage();
  }, [character.image, scenarioId]);

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
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        width: '100%',
        maxWidth: 200,
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: 2,
        }
      }}
      style={style}
    >
      <Box sx={{ 
        width: '100%',
        aspectRatio: '1',
        position: 'relative',
        bgcolor: 'action.hover'
      }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={character.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'text.secondary'
          }}>
            {character.name[0]}
          </Box>
        )}
        <Box sx={{ 
          position: 'absolute',
          top: 5,
          right: 5,
          display: 'flex',
          gap: 0.5,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 1,
          p: 0.5
        }}>
          <IconButton 
            onMouseUp={(e) => {
              e.stopPropagation();
              onEdit(character, index);
            }} 
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            onMouseUp={(e) => {
              e.stopPropagation();
              onDelete(character.id);
            }} 
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ p: '5px 5px', minHeight: 0 }}>
        <Typography variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
          {character.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
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
        {character.notes && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{
              display: 'block',
              mt: 0.5,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {character.notes}
          </Typography>
        )}
      </Box>
    </Paper>
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
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
    const character = scenario?.characters.find(char => char.id === characterId);
    if (character) {
      setCharacterToDelete(character);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (characterToDelete) {
      deleteCharacter.mutate(characterToDelete.id);
      setIsDeleteDialogOpen(false);
      setCharacterToDelete(null);
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
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Characters</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setFormData(defaultCharacterForm);
            setIsAddDialogOpen(true);
          }}
        >
          Add Character
        </Button>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={scenario?.characters.map(char => char.id) || []}
          strategy={verticalListSortingStrategy}
        >
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 2,
            p: 1,
            '& > *': {
              height: 'fit-content'
            }
          }}>
            {scenario?.characters.map((character, index) => (
              <SortableCharacterItem
                key={character.id}
                character={character}
                index={index}
                onEdit={openEditDialog}
                onDelete={handleDeleteCharacter}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      {/* Add Character Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Character</DialogTitle>
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
              onChange={handleFormChange('name')}
              fullWidth
              required
            />
            <TextField
              select
              label="Type"
              value={formData.type}
              onChange={handleFormChange('type')}
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
              onChange={handleFormChange('gender')}
              fullWidth
              required
            >
              <MenuItem value="mal">Male</MenuItem>
              <MenuItem value="fem">Female</MenuItem>
            </TextField>
            <TextField
              label="Image"
              value={formData.image}
              onChange={handleFormChange('image')}
              fullWidth
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleFormChange('notes')}
              fullWidth
              multiline
              rows={4}
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddCharacter} 
            variant="contained" 
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Character Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isAddDialogOpen ? 'Add Character' : 'Edit Character'}
        </DialogTitle>
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
              onChange={handleFormChange('name')}
              fullWidth
              required
            />
            <TextField
              select
              label="Type"
              value={formData.type}
              onChange={handleFormChange('type')}
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
              onChange={handleFormChange('gender')}
              fullWidth
              required
            >
              <MenuItem value="mal">Male</MenuItem>
              <MenuItem value="fem">Female</MenuItem>
            </TextField>
            <TextField
              label="Image"
              value={formData.image}
              onChange={handleFormChange('image')}
              fullWidth
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleFormChange('notes')}
              fullWidth
              multiline
              rows={4}
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditCharacter} 
            variant="contained" 
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCharacterToDelete(null);
        }}
        keepMounted={false}
        disableEnforceFocus
      >
        <DialogTitle>Delete Character</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete character "{characterToDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsDeleteDialogOpen(false);
            setCharacterToDelete(null);
          }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 
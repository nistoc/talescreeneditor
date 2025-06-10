import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
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
import { CharacterFormData, defaultCharacterForm } from '../../modals/types/character';
import { CharacterAddModal } from '../../modals/CharacterAddModal';
import { CharacterEditModal } from '../../modals/CharacterEditModal';
import { CharacterDeleteModal } from '../../modals/CharacterDeleteModal';

interface SortableCharacterItemProps {
  character: Character;
  index: number;
  onEdit: (character: Character, index: number) => void;
  onDelete: (characterId: string) => void;
}

const SortableCharacterItem: React.FC<SortableCharacterItemProps> = ({ character, index, onEdit, onDelete }) => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  React.useEffect(() => {
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
      <Box sx={{m: '10px', minHeight: 0 }}>
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
      [field]: event.target.value as CharacterFormData[keyof CharacterFormData],
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

      <CharacterAddModal
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        formData={formData}
        onFormChange={handleFormChange}
        onAdd={handleAddCharacter}
      />

      <CharacterEditModal
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        formData={formData}
        onFormChange={handleFormChange}
        onSave={handleEditCharacter}
      />

      <CharacterDeleteModal
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCharacterToDelete(null);
        }}
        character={characterToDelete}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}; 
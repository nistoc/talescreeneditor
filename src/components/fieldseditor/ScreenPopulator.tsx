import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Button, IconButton, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Screen, Character, ChoiceOption } from '../../types/api.scenarios';

interface ScreenPopulatorProps {
    screens: Screen[];
    screen: Screen;
    parentScreen?: Screen;
    characters: Character[];
}

const allScreenTypeFieldsSets: Record<string, Set<string>> = {
    narrative: new Set(['id', 'parentId', 'progress', 'image', 'next', 'notes', 'type', 'content', 'screens']),
    dialog: new Set(['id', 'parentId', 'progress', 'image', 'next', 'notes', 'type', 'content', 'actor', 'screens']),
    choice: new Set(['id', 'parentId', 'progress', 'image', 'next', 'notes', 'type', 'content', 'actor', 'availableFor', 'options']),
    scene: new Set(['id', 'parentId', 'progress', 'image', 'next', 'notes', 'type', 'content', 'title', 'screens']),
    final: new Set(['id', 'parentId', 'progress', 'image', 'next', 'notes', 'type', 'content']),
    cutscene: new Set(['id', 'parentId', 'progress', 'image', 'next', 'notes', 'type'])
};

const minimalRequiredFields: Record<string, Set<string>> = {
    scene: new Set(['title', 'content']),
    narrative: new Set(['content']),
    final: new Set(['content']),
    dialog: new Set(['content', 'actor']),
    choice: new Set(['content', 'actor', 'availableFor', 'options']),
    cutscene: new Set([])
};


export const ScreenPopulator: React.FC<ScreenPopulatorProps> = ({
    screens,
    screen,
    parentScreen,
    characters,
}) => {
    const [formData, setFormData] = useState<Partial<Screen>>(screen);
    const [possibleScreenTypes, setPossibleScreenTypes] = useState<string[]>([]);
    const [showIsFinalToggle, setShowIsFinalToggle] = useState(false);
    const [isFinal, setIsFinal] = useState(false);

    useEffect(() => {
        const filledKeys = new Set(
            Object.keys(formData).filter(key => {
                const value = (formData as any)[key];
                if (value === undefined || value === null) return false;
                if (typeof value === 'string' && value.trim() === '') return false;
                if (Array.isArray(value) && value.length === 0) return false;
                if (typeof value === 'object' && !Array.isArray(value) && value !== null && Object.keys(value).length === 0) return false;
                return true;
            })
        );

        const screenTypes = Object.keys(allScreenTypeFieldsSets);

        let possible = screenTypes.filter(type => {
            const requiredFields = minimalRequiredFields[type];
            const allTypeFields = allScreenTypeFieldsSets[type];

            for (const req of Array.from(requiredFields)) {
                if (!filledKeys.has(req)) {
                    return false;
                }
            }

            for (const key of Array.from(filledKeys)) {
                if (!allTypeFields.has(key)) {
                    return false;
                }
            }
            
            return true;
        });

        const isAmbiguous = possible.length === 2 && possible.includes('narrative') && possible.includes('final');
        setShowIsFinalToggle(isAmbiguous);

        if (isAmbiguous) {
            possible = isFinal ? ['final'] : ['narrative'];
        }

        setPossibleScreenTypes(possible);
    }, [formData, isFinal]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name!]: value }));
    }

    const handleActorChange = (event: any) => {
        const playerId = event.target.value;
        if (playerId) {
            setFormData(prev => ({ ...prev, actor: { playerId } }));
        } else {
            const newFormData = {...formData } as any;
            delete newFormData.actor;
            setFormData(newFormData);
        }
    };

    const handleAddOptionsContainer = () => {
        setFormData(prev => ({ ...prev, options: [] }));
    };

    const handleAddNewOption = () => {
        const newOption: ChoiceOption = { id: '', text: '' };
        setFormData(prev => ({ ...prev, options: [...((prev as any).options || []), newOption] }));
    };

    const handleRemoveOption = (index: number) => {
        setFormData(prev => {
            const newOptions = [...((prev as any).options)];
            newOptions.splice(index, 1);
            if (newOptions.length === 0) {
                const newState = { ...prev };
                delete (newState as any).options;
                return newState;
            }
            return { ...prev, options: newOptions };
        });
    };
    
    const handleOptionChange = (index: number, field: 'text' | 'id', value: string) => {
        setFormData(prev => {
            const newOptions = [...((prev as any).options as ChoiceOption[] || [])];
            newOptions[index] = {...newOptions[index], [field]: value};
            return {...prev, options: newOptions };
        });
    };

    const currentType = possibleScreenTypes.length === 1 ? possibleScreenTypes[0] : 'Ambiguous';

    return (
        <Box component="form" noValidate autoComplete="off" sx={{ m: 1, p: 2, border: '1px dashed grey' }}>
            <Typography variant="h5" gutterBottom>
                Editing Screen: {screen.id}
            </Typography>
            <Box sx={{ p: 2, mb: 2, border: '1px solid #eee', background: '#f9f9f9' }}>
                <Typography variant="h6">Possible Screen Types</Typography>
                <Typography variant="body1">
                    {possibleScreenTypes.length > 0 ? possibleScreenTypes.join(', ') : 'No matching types found for the filled fields.'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    (Save is enabled when only one type is possible)
                </Typography>
            </Box>

            <Typography variant="h6">Base Fields</Typography>
            <TextField name="id" label="ID" value={formData.id || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField name="parentId" label="Parent ID" value={formData.parentId || ''} fullWidth margin="normal" disabled />
            <TextField name="progress" label="Progress" type="number" value={formData.progress || 0} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField name="image" label="Image URL" value={formData.image || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <FormControl fullWidth margin="normal">
                <InputLabel>Next Screen</InputLabel>
                <Select name="next" value={formData.next || ''} label="Next Screen" onChange={handleSelectChange}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    {screens.filter(s => s.id !== screen.id).map(s => <MenuItem key={s.id} value={s.id}>{s.id}</MenuItem>)}
                </Select>
            </FormControl>
            <TextField name="notes" label="Notes" value={formData.notes || ''} onChange={handleInputChange} fullWidth margin="normal" multiline />
            
            <hr style={{ margin: '20px 0' }}/>
            <Typography variant="h6">Type-Specific Fields</Typography>

            <TextField name="title" label="Title (for Scene)" value={(formData as any).title || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField name="content" label="Content (for Narrative, Dialog, etc.)" value={(formData as any).content || ''} onChange={handleInputChange} fullWidth margin="normal" multiline />
            {showIsFinalToggle && (
                <FormGroup>
                    <FormControlLabel 
                        control={<Checkbox checked={isFinal} onChange={(e) => setIsFinal(e.target.checked)} />} 
                        label="Is Final" 
                    />
                </FormGroup>
            )}
            
            <FormControl fullWidth margin="normal">
                <InputLabel>Actor (for Dialog, Choice)</InputLabel>
                <Select value={(formData as any).actor?.playerId || ''} label="Actor (for Dialog, Choice, Block)" onChange={handleActorChange}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    {characters.map(char => <MenuItem key={char.id} value={char.id}>{char.name}</MenuItem>)}
                </Select>
            </FormControl>
            
            <TextField name="availableFor" label="Available For (for Choice)" value={(formData as any).availableFor || ''} onChange={handleInputChange} fullWidth margin="normal" />
            
            <Box sx={{ mt: 2, p: 2, border: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Options (for Choice)</Typography>
                    {(formData as any).options === undefined && (
                        <IconButton onClick={handleAddOptionsContainer} color="primary" title="Add options section">
                            <AddIcon />
                        </IconButton>
                    )}
                </Box>

                {(formData as any).options?.map((option: ChoiceOption, index: number) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', border: '1px dashed grey', p: 1, mb: 1 }}>
                        <Box sx={{ flexGrow: 1, mr: 1 }}>
                            <TextField 
                                label={`Option ${index + 1} Text`}
                                value={option.text} 
                                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                fullWidth 
                                margin="dense" />
                            <TextField 
                                label={`Option ${index + 1} Next Screen ID`}
                                value={option.id}
                                onChange={(e) => handleOptionChange(index, 'id', e.target.value)}
                                fullWidth 
                                margin="dense" />
                        </Box>
                        <IconButton onClick={() => handleRemoveOption(index)} color="warning" title="Remove option">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
                
                {(formData as any).options !== undefined && (
                    <Button onClick={handleAddNewOption} startIcon={<AddIcon />} sx={{ mt: 1 }}>
                        Add New Option
                    </Button>
                )}
            </Box>
            
            <Button 
                variant="contained" 
                color="primary"
                disabled={possibleScreenTypes.length !== 1} 
                sx={{ mt: 2 }}
                onClick={() => console.log('Saving:', {...formData, type: currentType })}
            >
                Save
            </Button>
        </Box>
    );
};
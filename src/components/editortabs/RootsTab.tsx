import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Collapse, IconButton, Tooltip, TextField, InputAdornment } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useScenario } from '../../api/scenarios';
import { Screen } from '../../types/api.scenarios';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import UnfoldLess from '@mui/icons-material/UnfoldLess';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type ViewMode = 'rootOnly' | 'withChildren';

interface SearchResult {
  screenId: string;
  matchedFields: string[];
  parentIds: string[];
}

interface ScreenItemProps {
  screen: Screen;
  viewMode: ViewMode;
  level?: number;
  expanded?: boolean;
  searchResults?: SearchResult[];
  selectedSearchResult?: SearchResult;
  selectedScreenId?: string;
  scrolledScreenId?: string;
  onSelect?: (screenId: string) => void;
  searchQuery: string;
  onExpandParent?: (screenId: string) => void;
}

const ScreenItem: React.FC<ScreenItemProps> = ({
  screen,
  viewMode,
  level = 0,
  expanded = false,
  searchResults = [],
  selectedSearchResult,
  selectedScreenId,
  scrolledScreenId,
  onSelect,
  searchQuery,
  onExpandParent
}) => {
  const [open, setOpen] = useState(expanded);
  const hasChildren = 'screens' in screen && screen.screens.length > 0;
  const hasImage = screen.image && screen.image.trim() !== '';
  const isSelected = selectedScreenId === screen.id;
  const itemRef = useRef<HTMLLIElement>(null);
  const hasExpandedParents = useRef(false);

  useEffect(() => {
    setOpen(expanded);
  }, [expanded]);

  // Reset hasExpandedParents when scrolledScreenId changes
  useEffect(() => {
    hasExpandedParents.current = false;
  }, [scrolledScreenId]);

  useEffect(() => {
    if (scrolledScreenId === screen.id && itemRef.current && !hasExpandedParents.current) {
      // First expand all parent screens
      if (level > 0 && selectedSearchResult?.parentIds) {
        hasExpandedParents.current = true;
        selectedSearchResult.parentIds.forEach(parentId => {
          if (onExpandParent) {
            onExpandParent(parentId);
          }
        });
      }
      // Then scroll into view after a small delay to allow expansion
      setTimeout(() => {
        if (itemRef.current) {
          itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [scrolledScreenId, level, selectedSearchResult?.parentIds, onExpandParent, screen.id]);


  // Skip rendering if screen type is 'block'
  if (screen.type === 'block') {
    return null;
  }

  const handleClick = () => {
    if (onSelect) {
      onSelect(screen.id);
    }
  };

  const handleExpandClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (hasChildren) {
      setOpen(!open);
    }
  };

  const highlightText = (text: string | undefined, field: string) => {
    if (!text || !scrolledScreenId || !selectedSearchResult?.matchedFields.includes(field)) {
      return text;
    }

    const query = selectedSearchResult.matchedFields.includes(field) ? searchQuery : '';
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ?
            <span key={i} style={{ backgroundColor: 'yellow', padding: '0 2px' }}>{part}</span> :
            part
        )}
      </span>
    );
  };

  return (
    <>
      <ListItem
        ref={itemRef}
        onClick={handleClick}
        sx={{
          pl: level === 0 ? 2 : 4 + (level * 3),
          borderLeft: level > 0 ? '2px solid' : 'none',
          borderColor: 'divider',
          backgroundColor: isSelected ? 'primary.light' :
            (scrolledScreenId === screen.id ? 'warning.light' :
              (level > 0 ? 'action.hover' : 'inherit')),
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: isSelected ? 'primary.light' : 'action.hover'
          }
        }}
      >
        {(level === 0 || hasImage) && (
          <ListItemAvatar>
            <Avatar src={screen.image} alt={screen.type} />
          </ListItemAvatar>
        )}
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" component="span">
                {highlightText(screen.type, 'type')} - {highlightText(screen.id, 'id')}
              </Typography>
              {hasChildren && (
                <Typography variant="caption" color="text.secondary">
                  ({screen.screens.length} screens)
                </Typography>
              )}
            </Box>
          }
          secondary={
            <>
              {highlightText(screen.content, 'content')}
              {screen.notes && (
                <Typography variant="caption" display="block" color="text.secondary">
                  Notes: {highlightText(screen.notes, 'notes')}
                </Typography>
              )}
              {screen.next && (
                <Typography variant="caption" display="block" color="text.secondary">
                  Next: {highlightText(screen.next, 'next')}
                </Typography>
              )}
            </>
          }
        />
        {hasChildren && viewMode === 'withChildren' && (
          <IconButton
            size="small"
            onClick={handleExpandClick}
            sx={{
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>
      {hasChildren && viewMode === 'withChildren' && (
        <Collapse in={open} timeout={0} unmountOnExit>
          <List component="div" disablePadding>
            {screen.screens
              .filter(childScreen => childScreen.type !== 'block')
              .map((childScreen) => (
                <ScreenItem
                  key={childScreen.id}
                  screen={childScreen}
                  viewMode={viewMode}
                  level={level + 1}
                  expanded={expanded}
                  searchResults={searchResults}
                  selectedSearchResult={selectedSearchResult}
                  selectedScreenId={selectedScreenId}
                  scrolledScreenId={scrolledScreenId}
                  onSelect={onSelect}
                  searchQuery={searchQuery}
                  onExpandParent={onExpandParent}
                />
              ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export const RootsTab: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const { data: scenario } = useScenario(scenarioId || '');
  const [viewMode, setViewMode] = useState<ViewMode>('rootOnly');
  const [allExpanded, setAllExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState<number | null>(null);
  const [selectedScreenId, setSelectedScreenId] = useState<string | undefined>();
  const [scrolledScreenId, setScrolledScreenId] = useState<string | undefined>();
  const [expandedScreens, setExpandedScreens] = useState<Record<string, boolean>>({});

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
      if (newMode === 'rootOnly') {
        setAllExpanded(false);
      }
    }
  };

  const handleExpandAll = () => {
    setAllExpanded(true);
  };

  const handleCollapseAll = () => {
    setAllExpanded(false);
  };

  const searchInScreen = (screen: Screen, query: string, parentIds: string[] = []): SearchResult[] => {
    const results: SearchResult[] = [];
    const matchedFields: string[] = [];
    const queryLower = query.toLowerCase();

    // Check each field for matches
    if (screen.type?.toLowerCase().includes(queryLower)) matchedFields.push('type');
    if (screen.id?.toLowerCase().includes(queryLower)) matchedFields.push('id');
    if (screen.content?.toLowerCase().includes(queryLower)) matchedFields.push('content');
    if (screen.image?.toLowerCase().includes(queryLower)) matchedFields.push('image');
    if (screen.notes?.toLowerCase().includes(queryLower)) matchedFields.push('notes');
    if (screen.next?.toLowerCase().includes(queryLower)) matchedFields.push('next');

    // If any matches found, add to results
    if (matchedFields.length > 0) {
      results.push({
        screenId: screen.id,
        matchedFields,
        parentIds: [...parentIds]
      });
    }

    // Recursively search in child screens
    if ('screens' in screen && Array.isArray(screen.screens)) {
      screen.screens.forEach(childScreen => {
        if (childScreen && childScreen.type !== 'block') {
          results.push(...searchInScreen(childScreen, query, [...parentIds, screen.id]));
        }
      });
    }

    return results;
  };

  const handleSearchNavigation = (direction: 'up' | 'down') => {
    if (searchResults.length === 0 || selectedSearchIndex === null) return;

    const newIndex = direction === 'up'
      ? (selectedSearchIndex - 1 + searchResults.length) % searchResults.length
      : (selectedSearchIndex + 1) % searchResults.length;

    handleExpandScreenParent(searchResults[newIndex]);
    setSelectedSearchIndex(newIndex);
    setScrolledScreenId(searchResults[newIndex].screenId);
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && scenario) {
      const query = searchQuery.trim();
      if (query) {
        const results = scenario.screens.flatMap(screen => searchInScreen(screen, query));
        setSearchResults(results);
        if (results.length > 0) {
          handleExpandScreenParent(results[0]);
          setSelectedSearchIndex(0);
          setScrolledScreenId(results[0].screenId);
          // Switch to withChildren mode when search is performed
          setViewMode('withChildren');
        } else {
          setSelectedSearchIndex(null);
          setScrolledScreenId(undefined);
        }
      } else {
        setSearchResults([]);
        setSelectedSearchIndex(null);
        setScrolledScreenId(undefined);
      }
    }
  };

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSearchResults([]);
    setSelectedSearchIndex(null);
  };

  const handleScreenSelect = (screenId: string) => {
    setSelectedScreenId(screenId);
    const index = searchResults.findIndex(result => result.screenId === screenId);
    if (index !== -1) {
      setSelectedSearchIndex(index);
      setScrolledScreenId(screenId);
    }
  };

  const handleExpandScreenParent = (screen: SearchResult) => {
    if (screen.parentIds.length > 0) {
      screen.parentIds.forEach(parentId => {
        handleExpandParent(parentId);
      });
    }
  };

  const handleExpandParent = (screenId: string) => {
    setExpandedScreens(prev => {
      if (prev[screenId]) {
        return prev;
      }
      return { ...prev, [screenId]: true };
    });
  };

  if (!scenario) {
    return <Typography>Loading...</Typography>;
  }

  const selectedSearchResult = selectedSearchIndex !== null ? searchResults[selectedSearchIndex] : undefined;

  return (
    <Box p={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
        >
          <ToggleButton value="rootOnly" aria-label="root only view">
            Root Screens
          </ToggleButton>
          <ToggleButton value="withChildren" aria-label="with children view">
            With Children
          </ToggleButton>
        </ToggleButtonGroup>

        {viewMode === 'withChildren' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Expand All">
              <IconButton onClick={handleExpandAll} size="small">
                <UnfoldMore />
              </IconButton>
            </Tooltip>
            <Tooltip title="Collapse All">
              <IconButton onClick={handleCollapseAll} size="small">
                <UnfoldLess />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <Box sx={{ flex: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {searchResults.length > 0 && selectedSearchIndex !== null && (
            <Typography variant="body2" color="text.secondary">
              {selectedSearchIndex + 1}/{searchResults.length}
            </Typography>
          )}
          <TextField
            size="small"
            placeholder="Search in screens..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            onKeyDown={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleSearchNavigation('up')}
                    disabled={searchResults.length === 0 || selectedSearchIndex === null}
                  >
                    <KeyboardArrowUpIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleSearchNavigation('down')}
                    disabled={searchResults.length === 0 || selectedSearchIndex === null}
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <List sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto' }}>
          {scenario.screens
            .filter(screen => screen.type !== 'block')
            .map((screen) => (
              <ScreenItem
                key={screen.id}
                screen={screen}
                viewMode={viewMode}
                expanded={expandedScreens[screen.id] || allExpanded}
                searchResults={searchResults}
                selectedSearchResult={selectedSearchResult}
                selectedScreenId={selectedScreenId}
                scrolledScreenId={scrolledScreenId}
                onSelect={handleScreenSelect}
                searchQuery={searchQuery}
                onExpandParent={handleExpandParent}
              />
            ))}
        </List>
      </Box>
    </Box>
  );
}; 
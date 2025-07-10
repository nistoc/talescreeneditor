import React from 'react';
import { Box } from '@mui/material';
import Editor from '@monaco-editor/react';

interface JsonEditorProps {
  value: string | null;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange, readOnly = false }) => {
  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    try {
      // Validate JSON format
      JSON.parse(value);
      onChange(value);
    } catch (error) {
      // Invalid JSON, don't update
      console.error('Invalid JSON:', error);
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1
    }}>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value || ''}
        onChange={handleEditorChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          folding: true,
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
        }}
      />
    </Box>
  );
}; 
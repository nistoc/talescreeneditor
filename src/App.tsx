import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';

const App: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tales Screen Editor
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Tales Screen Editor
        </Typography>
        <Typography variant="body1">
          This is your new React application with TypeScript and Material UI.
        </Typography>
      </Container>
    </Box>
  );
};

export default App; 
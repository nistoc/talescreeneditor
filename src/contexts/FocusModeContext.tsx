import React, { createContext, useContext, useState, useEffect } from 'react';

interface FocusModeContextType {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export const FocusModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFocusMode, setIsFocusMode] = useState(() => {
    const savedFocusMode = localStorage.getItem('focusMode');
    return savedFocusMode === 'true';
  });

  useEffect(() => {
    localStorage.setItem('focusMode', isFocusMode.toString());
  }, [isFocusMode]);

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
  };

  return (
    <FocusModeContext.Provider value={{ isFocusMode, toggleFocusMode }}>
      {children}
    </FocusModeContext.Provider>
  );
};

export const useFocusMode = () => {
  const context = useContext(FocusModeContext);
  if (context === undefined) {
    throw new Error('useFocusMode must be used within a FocusModeProvider');
  }
  return context;
}; 
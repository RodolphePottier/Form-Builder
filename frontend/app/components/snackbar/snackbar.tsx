'use client'
import React, { useState, useCallback, createContext, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

export type Severity = 'error' | 'warning' | 'info' | 'success';

export interface SnackbarContextType {
  showAlert: (message: string, severity: Severity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<Severity>('info');

  const showAlert = useCallback((message: string, severity: Severity = 'info') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  }, []);

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleAlertClose = (event: React.SyntheticEvent | Event) => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleAlertClose} severity={severity as AlertProps['severity']}>
          {message}
        </MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;

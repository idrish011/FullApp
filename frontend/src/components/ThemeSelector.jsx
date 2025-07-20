import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector = () => {
  const { currentTheme, changeTheme, getAvailableThemes } = useTheme();
  const themes = getAvailableThemes();

  return (
    <FormControl size="small" sx={{ minWidth: 120, ml: 2 }}>
      <InputLabel id="theme-selector-label">Theme</InputLabel>
      <Select
        labelId="theme-selector-label"
        value={currentTheme}
        label="Theme"
        onChange={e => changeTheme(e.target.value)}
      >
        {themes.map(theme => (
          <MenuItem key={theme.key} value={theme.key}>{theme.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ThemeSelector; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { purple, deepPurple, blue, pink, grey } from '@mui/material/colors';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme definitions
const themes = {
  default: {
    name: 'Default',
    palette: {
      mode: 'light',
      primary: {
        main: blue[700],
        light: blue[300],
        dark: blue[900],
      },
      secondary: {
        main: pink[500],
        light: pink[300],
        dark: pink[700],
      },
      background: {
        default: '#fafafa',
        paper: '#fff',
        gradient: 'linear-gradient(135deg, #fafafa 0%, #e3e3e3 100%)',
      },
      text: {
        primary: grey[900],
        secondary: grey[700],
      },
      navbar: {
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        text: '#fff',
      },
      card: {
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid #e0e0e0',
      },
      stats: {
        students: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        grades: 'linear-gradient(135deg, #ec407a 0%, #f8bbd0 100%)',
        attendance: 'linear-gradient(135deg, #43a047 0%, #a5d6a7 100%)',
        grading: 'linear-gradient(135deg, #ffa726 0%, #ffd54f 100%)',
      },
      header: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
    },
  },
  light: {
    name: 'Light',
    palette: {
      mode: 'light',
      primary: {
        main: purple[500],
        light: purple[300],
        dark: purple[700],
      },
      secondary: {
        main: deepPurple[500],
        light: deepPurple[300],
        dark: deepPurple[700],
      },
      background: {
        default: '#f5f7fa',
        paper: '#ffffff',
        gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      },
      text: {
        primary: '#2c3e50',
        secondary: '#7f8c8d',
      },
      navbar: {
        background: 'linear-gradient(135deg, #7b1fa2 0%, #512da8 100%)',
        text: '#ffffff',
      },
      card: {
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(255,255,255,0.2)',
      },
      stats: {
        students: 'linear-gradient(135deg, #7b1fa2 0%, #512da8 100%)',
        grades: 'linear-gradient(135deg, #8e24aa 0%, #d1c4e9 100%)',
        attendance: 'linear-gradient(135deg, #9575cd 0%, #7e57c2 100%)',
        grading: 'linear-gradient(135deg, #ba68c8 0%, #f3e5f5 100%)',
      },
      header: 'linear-gradient(135deg, #7b1fa2 0%, #512da8 100%)',
    },
  },
  dark: {
    name: 'Dark',
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
        light: '#63a4ff',
        dark: '#004ba0',
      },
      secondary: {
        main: '#f48fb1',
        light: '#f8bbd9',
        dark: '#c2185b',
      },
      background: {
        default: '#101624',
        paper: '#181e2a',
        gradient: 'linear-gradient(135deg, #101624 0%, #232946 100%)',
      },
      text: {
        primary: '#f4f6fa',
        secondary: '#b0b8c1',
      },
      navbar: {
        background: 'linear-gradient(135deg, #232946 0%, #101624 100%)',
        text: '#f4f6fa',
      },
      card: {
        background: 'rgba(24,30,42,0.98)',
        border: '1px solid rgba(255,255,255,0.08)',
      },
      stats: {
        students: 'linear-gradient(135deg, #232946 0%, #1976d2 100%)',
        grades: 'linear-gradient(135deg, #004ba0 0%, #f48fb1 100%)',
        attendance: 'linear-gradient(135deg, #181e2a 0%, #63a4ff 100%)',
        grading: 'linear-gradient(135deg, #232946 0%, #c2185b 100%)',
      },
      header: 'linear-gradient(135deg, #232946 0%, #1976d2 100%)',
    },
  },
  professional: {
    name: 'Professional',
    palette: {
      mode: 'light',
      primary: {
        main: '#22304a',
        light: '#344563',
        dark: '#101624',
      },
      secondary: {
        main: '#e74c3c',
        light: '#ffb4a2',
        dark: '#c0392b',
      },
      background: {
        default: '#f4f6fa',
        paper: '#ffffff',
        gradient: 'linear-gradient(135deg, #f4f6fa 0%, #dbe2ef 100%)',
      },
      text: {
        primary: '#22304a',
        secondary: '#5c6b82',
      },
      navbar: {
        background: 'linear-gradient(135deg, #22304a 0%, #344563 100%)',
        text: '#ffffff',
      },
      card: {
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid #e0e6ed',
      },
      stats: {
        students: 'linear-gradient(135deg, #22304a 0%, #344563 100%)',
        grades: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
        attendance: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
        grading: 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)',
      },
      header: 'linear-gradient(135deg, #22304a 0%, #344563 100%)',
    },
  },
  ocean: {
    name: 'Ocean',
    palette: {
      mode: 'light',
      primary: {
        main: '#006994',
        light: '#0099cc',
        dark: '#004d73',
      },
      secondary: {
        main: '#00b4d8',
        light: '#48cae4',
        dark: '#0096c7',
      },
      background: {
        default: '#f0f8ff',
        paper: '#ffffff',
        gradient: 'linear-gradient(135deg, #f0f8ff 0%, #caf0f8 100%)',
      },
      text: {
        primary: '#023e8a',
        secondary: '#0077b6',
      },
      navbar: {
        background: 'linear-gradient(135deg, #006994 0%, #023e8a 100%)',
        text: '#ffffff',
      },
      card: {
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(255,255,255,0.2)',
      },
      stats: {
        students: 'linear-gradient(135deg, #006994 0%, #023e8a 100%)',
        grades: 'linear-gradient(135deg, #00b4d8 0%, #0096c7 100%)',
        attendance: 'linear-gradient(135deg, #48cae4 0%, #90e0ef 100%)',
        grading: 'linear-gradient(135deg, #ade8f4 0%, #caf0f8 100%)',
      },
      header: 'linear-gradient(135deg, #006994 0%, #023e8a 100%)',
    },
  },
  sunset: {
    name: 'Sunset',
    palette: {
      mode: 'light',
      primary: {
        main: '#ff6b35',
        light: '#ff8a65',
        dark: '#e64a19',
      },
      secondary: {
        main: '#ff9f1c',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      background: {
        default: '#fff8e1',
        paper: '#ffffff',
        gradient: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
      },
      text: {
        primary: '#bf360c',
        secondary: '#d84315',
      },
      navbar: {
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff9f1c 100%)',
        text: '#ffffff',
      },
      card: {
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(255,255,255,0.2)',
      },
      stats: {
        students: 'linear-gradient(135deg, #ff6b35 0%, #ff9f1c 100%)',
        grades: 'linear-gradient(135deg, #ff8a65 0%, #ffb74d 100%)',
        attendance: 'linear-gradient(135deg, #ffcc02 0%, #ff9f1c 100%)',
        grading: 'linear-gradient(135deg, #ff6b35 0%, #e64a19 100%)',
      },
      header: 'linear-gradient(135deg, #ff6b35 0%, #ff9f1c 100%)',
    },
  },
};

const getMuiTheme = (palette) => createTheme({
  palette,
  components: {
    MuiCard: {
      variants: [
        {
          props: { variant: 'dashboardCard' },
          style: ({ theme, ownerState }) => {
            const colorKey = ownerState?.color || 'students';
            const background = theme.palette.stats[colorKey] || theme.palette.stats.students;
            return {
              background,
              color: '#fff',
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: theme.shadows[3],
              padding: theme.spacing(3),
              border: '1px solid rgba(0,0,0,0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.04)',
                boxShadow: theme.shadows[8],
                filter: 'brightness(1.05)',
              },
            };
          },
        },
      ],
    },
  },
});

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'default';
  });

  const themeConfig = themes[currentTheme];

  let muiTheme;
  muiTheme = createTheme({
    palette: {
      ...themeConfig.palette,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
        fontSize: '2rem',
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: themeConfig.palette.navbar.background,
            color: themeConfig.palette.navbar.text,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: themeConfig.palette.card.background,
            border: themeConfig.palette.card.border,
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: themeConfig.palette.card.background,
            border: themeConfig.palette.card.border,
            backdropFilter: 'blur(10px)',
          },
        },
        variants: [
          {
            props: { variant: 'dashboardHeader' },
            style: {
              padding: 16, // theme.spacing(2)
              borderRadius: 16, // theme.shape.borderRadius * 2
            },
          },
        ],
      },
    },
  });

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('selectedTheme', themeName);
    }
  };

  const getAvailableThemes = () => {
    return Object.keys(themes).map(key => ({
      key,
      ...themes[key]
    }));
  };

  const value = {
    currentTheme,
    themeConfig,
    changeTheme,
    getAvailableThemes,
    themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 
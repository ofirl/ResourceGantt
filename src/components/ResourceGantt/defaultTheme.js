import { createMuiTheme } from '@material-ui/core/styles';

const defaultTheme = {
  palette: {
    primary: { main: '#ff00ff' },
    secondary: { main: '#ff0000' },
  },
  status: {
    danger: 'orange',
  },
  // spacing: (level) => (level * 8) + 'px'
};

export default createMuiTheme(defaultTheme);
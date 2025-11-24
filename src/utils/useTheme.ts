import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Colors } from '../constants/theme';

export const useTheme = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = isDarkMode ? Colors.dark : Colors.light;
  
  return { colors, isDarkMode };
};

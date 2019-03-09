import React from 'react';
import UserContext from './UserContext';

export default function useTheme() {
  return React.useContext(UserContext);
}

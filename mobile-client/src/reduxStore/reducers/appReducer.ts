import { Reducer } from 'redux';

type AppState = {
  initialLoad: boolean;
  socketState: any | null;
  currentScreen: string;
  userConnected: boolean;
  badgeCount: number;
};

const INITIAL_STATE: AppState = {
  initialLoad: true,
  socketState: null,
  currentScreen: '',
  userConnected: false,
  badgeCount: 0
};

export const appReducer: Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'set_is_initial_load':
      return { ...state, initialLoad: action.payload };
    case 'set_socket':
      return { ...state, socketState: action.payload };
    case 'get_current_screen':
      return { ...state, currentScreen: action.payload };
    case 'set_user_connected':
      return { ...state, userConnected: action.payload };
    case 'set_badge_count':
      return { ...state, badgeCount: action.payload };
    default: 
      return state;
  }
};

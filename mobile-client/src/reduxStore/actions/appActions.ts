type AppState = {
  initialLoad: boolean;
  socketState: any | null;
  currentScreen: string | '';
  userConnected: boolean;
};

type AppAction = 
  | { type: 'set_is_initial_load'; payload: boolean }
  | { type: 'set_socket'; payload: any }
  | { type: 'set_user_connected'; payload: boolean };

const setIsInitialLoad = (status: boolean) => ({ type: 'set_is_initial_load', payload: status });

const setSocketState = (socketState: any) => ({ type: 'set_socket', payload: socketState });

const getCurrentScreen = (currentScreen: string) => ({ type: 'get_current_screen', payload: currentScreen });

const setUserConnectionState = (state: boolean) => ({ type: 'set_user_connected', payload: state });

export default {
  setIsInitialLoad,
  setSocketState,
  getCurrentScreen,
  setUserConnectionState
};
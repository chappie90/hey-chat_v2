import React, { createContext, useReducer } from 'react';

export default (reducer: any, actions: any, defaultValue: any) => {
  const Context = createContext({});

  const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
}

// function combineReducers(reducers) {
//   return (state = {}, action) => {
//       const newState = {};
//       for (let key in reducers) {
//           newState[key] = reducers[key](state[key], action);
//       }
//       return newState;
//   };
// }
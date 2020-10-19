import { createStore, combineReducers, Store } from 'redux';
import { decrement, increment, setSearchText } from './action';
import { AppState } from './types';

type Actions = ReturnType<typeof increment> | ReturnType<typeof decrement> | ReturnType<typeof setSearchText>;

const initialAppState: AppState = {
  count: 0,
  searchText: "",
};

const rootReducer = (state: AppState = initialAppState, action: Actions) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      };
    case 'SET_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.payload
      };
    default:
      neverReached(action);
  }
  return state;
};

const neverReached = (never: never) => {};

//Utility-funksjon for å kombinere flere reducere
// const rootReducer = combineReducers<AppState>({
//   count: countReducer,
// });

function configureStore(): Store<AppState> {
  return createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  );
}

//Oppretter en store
export const store = configureStore();

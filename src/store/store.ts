import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers/root-reducer';

const configureStore = (initialState?: object) => {
    return createStore(rootReducer, initialState!, composeWithDevTools(applyMiddleware(thunk)));
};

const store = configureStore();

export default store;

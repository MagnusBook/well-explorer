import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers/root-reducer';

const composeEnhancers = process.env.NODE_ENV === 'development' ? (window as any)
    .__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const configureStore = (initialState?: object) => {
    return createStore(rootReducer, initialState!, composeEnhancers(applyMiddleware(thunk)));
};

const store = configureStore();

export default store;

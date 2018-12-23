import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store/store';

(window as any).__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root') as HTMLElement);
registerServiceWorker();

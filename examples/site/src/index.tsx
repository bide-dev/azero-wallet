import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { Root } from './Root';

const root = ReactDOM.createRoot(
  // eslint-disable-next-line no-restricted-globals
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Root>
      <App />
    </Root>
  </React.StrictMode>,
);

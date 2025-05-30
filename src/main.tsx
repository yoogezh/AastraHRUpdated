import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 👇 Add these lines
import { Provider } from 'react-redux';
import store from './store/Store';
// Make sure the path is correct to your Redux store

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);

 
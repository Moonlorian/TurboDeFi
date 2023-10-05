import './styles/globals.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';
import './assets/sass/theme.scss';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);
root.render(<App />);

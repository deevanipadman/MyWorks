import './styles.css';
import { ThreeMain } from './three/Main';

const container = document.getElementById('app') || document.body;

// Create and attach the ThreeMain instance
const app = new ThreeMain(container as HTMLElement);

// expose for debugging
(window as any).threeApp = app;

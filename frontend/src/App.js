import {Auth} from './components/Auth';
import {Food} from './components/Food';
import {Example} from './components/Practice';

import './style.css';

function App() {
  return (
    <div className="App">
      <div className="component-left">
        <Auth />
      </div>
      <div className="component-right">
        <Food />
      </div>
    </div>
  );
}

export default App;
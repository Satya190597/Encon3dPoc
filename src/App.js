import logo from './logo.svg';
import Platform from './component/platform/platform';
import Hub from './component/platform/hub';
import Blade from './component/platform/blade';
import './App.css';
import ClampRender from './component/platform/renderClamp';
import TestPlatform from './component/platform/test-platform/testPlatform';
import { isTestEnv } from './component/platform/util/util';

function App() {
  
  return (
    <div className="App" id="App">
      {!isTestEnv() && <Hub /> }
      {isTestEnv() && <TestPlatform />}
    </div>
  );
}

export default App;

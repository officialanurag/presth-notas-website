import React from 'react';
import './App.css';

import Notepad from './components/Notepad/Notepad.component';
import Menu from './components/Menu/Menu.component';

function App() {
  return (
    <React.Fragment>
      <Menu />
      <Notepad />
    </React.Fragment>
  );
}

export default App;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import GridCountup from './components/GridCountup';

function App() {
  return (
    <div className="app">
      <GridCountup />
    </div>
  );
}

export default App;

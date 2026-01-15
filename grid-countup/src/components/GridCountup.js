import React, { useState, useEffect, useRef, useCallback } from 'react';
import './GridCountup.css';

function GridCountup() {
  const [columns, setColumns] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const containerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef(null);

  // Calculate number of columns based on viewport width
  const calculateColumns = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const squareSize = 144; // 144px = 2 inches at 72 DPI
      const cols = Math.max(1, Math.floor(containerWidth / squareSize));
      setColumns(cols);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    calculateColumns();
    window.addEventListener('resize', calculateColumns);
    return () => window.removeEventListener('resize', calculateColumns);
  }, [calculateColumns]);

  // Update elapsed time every second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Calculate total number of squares to display
  const totalSquares = elapsedSeconds + 1;

  // Generate grid squares dynamically
  const squares = [];
  for (let i = 0; i < totalSquares; i++) {
    squares.push(
      <div key={i} className="grid-square filled">
        {i}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="grid-container">
      {squares}
    </div>
  );
}

export default GridCountup;

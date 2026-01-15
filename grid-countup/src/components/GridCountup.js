import React, { useState, useEffect, useRef, useCallback } from 'react';
import './GridCountup.css';

function GridCountup() {
  const [columns, setColumns] = useState(1);
  const [squareSize, setSquareSize] = useState(144);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const containerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef(null);

  // Calculate number of columns and square size based on viewport width
  const calculateColumns = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const targetSquareSize = 144; // Target size: 144px = 2 inches at 72 DPI
      const cols = Math.max(1, Math.floor(containerWidth / targetSquareSize));
      const actualSquareSize = containerWidth / cols;
      setColumns(cols);
      setSquareSize(actualSquareSize);
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
      <div
        key={i}
        className="grid-square filled"
        style={{
          width: `${squareSize}px`,
          height: `${squareSize}px`
        }}
      >
        {i}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="grid-container"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${squareSize}px)`
      }}
    >
      {squares}
    </div>
  );
}

export default GridCountup;

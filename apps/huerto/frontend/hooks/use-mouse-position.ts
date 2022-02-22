import { useState, useEffect } from 'react';
import { createEventsListener } from '../tools';

export const useMousePosition = () => {
  const [position, setPosition] = useState({
    clientX: 0,
    clientY: 0,
  });

  useEffect(
    () =>
      createEventsListener(['mousemove', 'mouseenter'], event => {
        const { clientX, clientY } = event;

        setPosition({
          clientX,
          clientY,
        });
      }),
    [],
  );

  return position;
};

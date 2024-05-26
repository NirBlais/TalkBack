import React, { useState, useEffect } from 'react';

const Countdown = () => {
  const [time, setTime] = useState(120); // 2 minutes in seconds
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <h1>Countdown: {formatTime(time)}</h1>
    </div>
  );
};

export default Countdown;
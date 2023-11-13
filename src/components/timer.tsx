/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';

interface TimerProps {
  duration: number;
  onTimerComplete: () => void;
}

const Timer = ({duration, onTimerComplete}: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prevSeconds => prevSeconds - 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else {
      onTimerComplete();
    }
  }, [timeRemaining, onTimerComplete]);

  return timeRemaining > 0 ? (
    <Text
      style={{
        marginTop: 2,
        fontSize: 14,
        marginBottom: 5,
        fontWeight: '700',
        color: 'gray',
      }}>
      *Time Remaining: {timeRemaining}
    </Text>
  ) : null;
};

export default Timer;

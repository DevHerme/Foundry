import React, { useState } from 'react';
import Message from './Components/Message';

const Counter = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1); // Updates state, triggers re-render
  };

  console.log('Counter component re-rendered'); // Logs every re-render

  return (
    <div>
<<<<<<< HEAD
      <button onClick={handleClick}> asdfTesting</button>
=======
      <button onClick={handleClick}>asasdfsdfasdf</button>
>>>>>>> beta
      <p>Count: {count}</p>
    </div>
  );
};

const StaticMessage = () => {
  console.log('StaticMessage component re-rendered'); // Logs every time this re-renders
  return <p>This  doesn’t change!</p>;
};

const App = () => {
  return (
    <div>
      <h1>React Re-rendasdfering TestExample</h1>
      <Counter />
      <StaticMessage />
      <Message />
    </div>
  );
};

export default App;
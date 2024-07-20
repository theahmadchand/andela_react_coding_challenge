import React, { useState } from 'react';

const Counter = ({ initialValue }) => {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="counter-container">
      <button
        type="button"
        data-testid="increment-qty"
        className="increment"
        onClick={() => setCount(count + 1)}
      >
        +
      </button>
      <span data-testid="item-qty" className="counter">
        {count}
      </span>
      <button
        type="button"
        data-testid="decrement-qty"
        className="decrement"
        onClick={() => setCount(Math.max(0, count - 1))}
      >
        -
      </button>
    </div>
  );
};

export default Counter;

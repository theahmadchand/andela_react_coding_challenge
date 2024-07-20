import React from 'react';
import Counter from './Counter';
import { useFetchData } from './useFetchData';

const Inventory = ({ url }) => {
  const { items } = useFetchData(url);

  return (
    <div className="inventory">
      <div className="header">
        <span>Product</span>
        <span>Quantity</span>
      </div>
      <ul data-testid="items">
        {items.map((e) => (
          <li key={e.id}>
            <span data-testid="item-name">{e.name}</span>
            <Counter initialValue={e.quantity} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;

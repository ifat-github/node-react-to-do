import React, { useState } from "react";
import Checkbox from "./Checkbox";

const Item = ({ item }) => {
  const [isChecked, setIsChecked] = useState(item.isDone);

  const handleCheck = async (checked) => {
    setIsChecked(!checked);

    const updatedItem = {isDone: true }

    await fetch(`http://localhost:3000/todos/${item._id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedItem)
    });
  };

  return (
    <li>
      <label>
        {isChecked ? (
          <Checkbox type="checkbox" checked={isChecked} data-testid={`all-done-checkbox-${item._id}`} readOnly />
        ) : (
          <Checkbox type="checkbox" checked={isChecked} data-testid={`all-notdone-checkbox-${item._id}`} onChange={() => handleCheck(isChecked)} />
        )}
        {item.title}
      </label>
    </li>
  );
};

export default Item;

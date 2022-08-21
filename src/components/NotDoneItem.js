import React, { useState } from "react";

const NotDoneItem = ({ item, func, mode }) => {
  const [isChecked, setIsChecked] = useState(item.isDone);

  const handleCheck = async (checked) => {
    setIsChecked(!checked);
    if (mode === "all") {
      func('Item marked as done.');
      const updatedItem = { isDone: true }

      await fetch(`http://localhost:3000/todos/${item._id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
      });
    }
  };

  return (
    <li data-testid={`notdone-${item._id}`} onClick={() => handleCheck(isChecked)}>
      <label>
        {item.title}
      </label>
    </li>
  );
};

export default NotDoneItem;

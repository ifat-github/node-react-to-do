import React, { useState } from 'react';
import Checkbox from './Checkbox';

const DoneItem = ({ item, batchingFunc }) => {
  const [isBatchChecked, setIsBatchChecked] = useState(false);

  const handleCheck = (isChecked) => {
    batchingFunc(item);
    setIsBatchChecked(!isChecked);
  };

  return (
    <li>
      <label>
        <Checkbox
          type="checkbox"
          data-testid={`done-checkbox-${item._id}`}
          checked={isBatchChecked}
          onChange={() => handleCheck(isBatchChecked)}
        />
        {item.title}
      </label>
    </li>
  );
};

export default DoneItem;

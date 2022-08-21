import React, { useState } from 'react';
import Checkbox from './Checkbox';

const DoneItem = ({ item, batchingFunc, mode }) => {
  const [isBatchChecked, setIsBatchChecked] = useState(false);

  const handleCheck = (isChecked) => {
    batchingFunc(item);
    setIsBatchChecked(!isChecked);
  };

  return (
    <li>
      <label>
        <s>
          {
            mode === "all" ?
              ''
              : <Checkbox
                type="checkbox"
                data-testid={`done-${item._id}`}
                checked={isBatchChecked}
                onChange={() => handleCheck(isBatchChecked)}
              />
          }
          {item.title}
        </s>
      </label>
    </li>
  );
};

export default DoneItem;

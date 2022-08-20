import React from 'react';
import Checkbox from './Checkbox';

const NotDoneItem = ({ item }) => {
  return (
    <li>
      <label>
        <Checkbox type="checkbox" checked={false} readOnly />
        {item.title}
      </label>
    </li>
  );
};

export default NotDoneItem;

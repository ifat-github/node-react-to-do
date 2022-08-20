import React, { useState } from 'react';

const NotDoneItem = ({ item }) => {
  return (
    <li>
      <label>
        <input type="checkbox" checked={false} readOnly />
        {item.title}
      </label>
    </li>
  );
};

export default NotDoneItem;

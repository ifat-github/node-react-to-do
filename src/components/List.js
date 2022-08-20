import React, { useState, useEffect } from 'react';
import Item from './Item';
import NotDoneItem from './NotDoneItem';
import DoneItem from './DoneItem';
import { Container } from './styles/Container.styled';

const List = ({ mode }) => {
  const batchToNotDone = [];
  const [searchValue, setSearchValue] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [alert, setAlert] = useState(false);
  const [itemInput, setItemInput] = useState('');

  useEffect(() => {
    const getItems = async () => {
      const data = await fetch('http://localhost:3000/todos');
      const json = await data.json();
      setAllItems(json);
    };

    getItems().catch(console.error);
  }, [alert, mode]);

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(false);
      }, 1000)
    }
  }, [alert])

  const createToDo = async () => {
    const newToDo = { title: itemInput, isDone: false };

    try {
      const res = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newToDo)
      });

      if (res.status === 200) {
        setItemInput('');
        setAlert(true);
      }
    } catch(e) {
      console.log(e);
    }
  };

  const batch = (id) => {
    batchToNotDone.push(id);
  };

  const markNotDone = (items) => {
    if (items.length > 1) {
      items.map((item) =>
        fetch(`http://localhost:3000/todos/${item._id}`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isDone: false })
        })
      );
      setAlert(true);
    }
  };

  return (
    <>
    <Container>
      {mode === 'all' ? (
        <div>
          <label data-testid="create">
            Create a new ToDo item:
            <input type="text" onChange={event => setItemInput(event.target.value)} value={itemInput}></input>
            <button onClick={() => createToDo()}>Save</button>
          </label>
        </div>
      ) : (
        ''
      )}
      <div>
        <label data-testid="search">
          Search a ToDo item:
          <input data-testid="search-value" type="text" onChange={event => setSearchValue(event.target.value)}></input>
        </label>
      </div>
      <div>
        <ul>
          {searchValue
            ? allItems
                .filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
                .map((item) => <Item key={item._id} item={item} />)
            : mode === 'all'
            ? allItems.map((item) => <Item key={item._id} item={item} />)
            : mode === 'done'
            ? allItems
                .filter((item) => item.isDone)
                .map((item) => <DoneItem key={item._id} item={item} batchingFunc={batch} />)
            : allItems
                .filter((item) => !item.isDone)
                .map((item) => <NotDoneItem key={item._id} item={item} />)}
        </ul>
      </div>
      {mode === 'done' ? (
        <div>
          <button data-testid="mark-not-done" onClick={() => markNotDone(batchToNotDone)}>Move to Not-Done</button>
        </div>
      ) : (
        ''
      )}
      </Container>
    </>
  );
};

export default List;

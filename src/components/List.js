import React, { useState, useEffect } from 'react';
import Item from './Item';
import NotDoneItem from './NotDoneItem';
import DoneItem from './DoneItem';
import styled from 'styled-components';
import { colors } from '../styles/styles';

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

  const markNotDone = async (items) => {
    if (items.length > 1) {
      const dataById = items.map(async (item) =>
      {
        try {
          await fetch(`http://localhost:3000/todos/${item._id}`, {
            method: 'PATCH',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isDone: false })
          })
        } catch (e) {
          console.log('Something went wrong.');
        }
      });
      await Promise.all(dataById);
      console.log("unmark");
      setAlert(true);
    }
  };

  return (
    <Container>
      
        <Label data-testid="search">
          <Input data-testid="search-value" type="text" onChange={event => setSearchValue(event.target.value)} placeholder={searchValue || 'Search a task (in "All")' }></Input>
        </Label>
      <Items>
        <UL style={{ listStyle: "none" }}>
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
        </UL>
      </Items>
      {mode === 'done' ? (
          <Button data-testid="mark-not-done" onClick={() => markNotDone(batchToNotDone)}>Move selected items to Not-Done</Button>
      ) : (
        ''
      )}
      {mode === 'all' ? (
          <Label data-testid="create">
            <Input type="text" onChange={event => setItemInput(event.target.value)} placeholder={itemInput || 'Add a task' }></Input>
            <Button onClick={() => createToDo()}>Save</Button>
          </Label>
      ) : (
        ''
      )}
    </Container>
  );
};

const Label = styled.label`
  font-size: 18px;
  display: flex;
  align-items: center;
  padding: 4px 0;
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  color: #fff;
  border: none;
  padding: 10px 24px;
  margin: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Items = styled.div`
  background-color: rgba(255, 255, 255, 10%);
  border-radius: 15px;
  padding: 45px 24px;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Button = styled.button`
  background: ${colors.primary};
  border: none;
  border-radius: 15px;
  color: #000;
  height: 46px;
  padding-left: 30px;
  padding-right: 30px;
`

const UL = styled.ul`
  padding: 0 30px;
`

export default List;

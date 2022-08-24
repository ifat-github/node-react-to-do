import React, { useState, useEffect, useCallback } from 'react';
import NotDoneItem from './NotDoneItem';
import DoneItem from './DoneItem';
import styled from 'styled-components';
import { colors } from '../styles/styles';

const List = ({ mode }) => {
  const [allItems, setAllItems] = useState([]);
  const [alert, setAlert] = useState('');
  const [itemInput, setItemInput] = useState('');
  const [emptyState, setEmptyState] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [batchToNotDone, setBatchToNotDone] = useState([]);

  const createToDo = useCallback(async () => {
    const newToDo = { title: itemInput, isDone: false };

    if (itemInput !== '') {
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
          const newItemJson = await res.json();
          const allItemsCopy = [...allItems, newItemJson];
          setAllItems(allItemsCopy);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [allItems, itemInput]);

  useEffect(() => {
    const getItems = async () => {
      const data = await fetch('http://localhost:3000/todos');
      const json = await data.json();
      const searchFilter =
        searchValue ?
          json.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
          : json;

      const modeFilter =
        mode === 'all'
          ? searchFilter
          : mode === 'done'
            ? searchFilter
              .filter((item) => item.isDone)
            : searchFilter
              .filter((item) => !item.isDone);
      setAllItems(modeFilter);
      modeFilter.length === 0 ? setEmptyState(true) : setEmptyState(false);
    };

    getItems().catch(console.error);
  }, [alert, mode, searchValue]);

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert('');
      }, 1000)
    }
  }, [alert])

  useEffect(() => {
    setBatchToNotDone([]);
    setSearchValue('');
  }, [mode]);


  const batch = (item) => {
    if (!batchToNotDone.includes(item)) {
      setBatchToNotDone(batchToNotDone => [...batchToNotDone, item]);
    } else {
      setBatchToNotDone(batchToNotDone.filter(stateItem => stateItem !== item));
    }
  };

  const markNotDone = async (items) => {
    if (items.length > 1) {
      const dataById = items.map(async (item) => {
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
      setAlert('Unmarked Succesfully.');
      setBatchToNotDone([]);
    }
  };

  return (
    <Container>
      {
        alert
      }
      {
        emptyState & !searchValue ? '' :
          <Label data-testid="search">
            <Input data-testid="search-value" type="text" onChange={event => setSearchValue(event.target.value)} placeholder={searchValue || 'Search a task'}></Input>
          </Label>
      }
      {
        emptyState ? <p>List is empty.</p> :
          <Items>
            <UL style={{ listStyle: "none" }}>
              {
                mode === 'all'
                  ? allItems.map((item) => item.isDone ? <DoneItem key={item._id} item={item} mode={mode} /> : <NotDoneItem key={item._id} item={item} func={setAlert} mode={mode} />)
                  : mode === 'done'
                    ? allItems
                      .map((item) => <DoneItem key={item._id} item={item} batchingFunc={batch} mode={mode} />)
                    : allItems
                      .map((item) => <NotDoneItem key={item._id} item={item} mode={mode} func={setAlert} />)
              }
            </UL>
          </Items>
      }
      {mode === 'done' && !emptyState ? (
        <Button data-testid="mark-not-done" onClick={() => markNotDone(batchToNotDone)} disabled={Boolean(batchToNotDone.length <= 1)} >Move selected items to Not-Done</Button>
      ) : (
        ''
      )}
      {mode === 'all' && !emptyState ? (
        <Label data-testid="create">
          <Input type="text" onChange={event => setItemInput(event.target.value)} placeholder={itemInput || 'Add a task'}></Input>
          <Button onClick={createToDo}>Save</Button>
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

  &:disabled {
    background: gray;
  }
`

const UL = styled.ul`
  padding: 0 30px;
`

export default List;

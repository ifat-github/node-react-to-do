import React from 'react';
import List from './components/List';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import ListIcon from './components/ListIcon';
import styled from 'styled-components';
import { colors, GlobalStyle } from './styles/styles';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
      <Layout>
      <ListIcon width={"50px"}/>
        <h1>To-Do List</h1>
        <Nav>
          <TabButton to="/all" className={({isActive}) => (isActive ? "active" : 'none')}>All</TabButton>
          <TabButton to="/done" className={({isActive}) => (isActive ? "active" : 'none')}>Done</TabButton>
          <TabButton to="/notdone" className={({isActive}) => (isActive ? "active" : 'none')}>Not-Done</TabButton>
        </Nav>
        <Routes>
          <Route path="/all" exact element={<List mode="all" />}></Route>
          <Route path="/done" exact element={<List mode="done" />}></Route>
          <Route path="/notdone" exact element={<List mode="notdone" />}></Route>
        </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
};

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px;
`;

const Nav = styled.nav`
  display: flex;
  margin-bottom: 45px;
`;

const TabButton = styled(NavLink)`
  width: 120px;
  height: 62px;
  background: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  text-decoration: none;
  align-items: center;

  &:first-child {
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }

  &:last-child {
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }

  &.active {
    background: ${colors.primary};
    color: #000;
  }
`;

export default App;

import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import { colors } from '../../assets/styles/GlobalStyles';


const Menu = ({
  uid,
  handleMenu,
  chooseMethod,
  askForDeleting,
  createBasicTerms
}) => {

  const handleButton = () => {
    chooseMethod(false);
    askForDeleting(false);
    handleMenu(false);
  }
  const handleMenuButton = (event) => {
    handleButton();
    event.target.blur();
  }

  const handleCreateButton = (event) => {
    handleButton();
    event.target.blur();
    createBasicTerms()
  }

  return (
    <Wrapper>
      <LinkAnchor
        onClick={handleMenuButton}
        to="/">
        home
      </LinkAnchor>

      <LinkAnchor
        onClick={handleMenuButton}
        to="/search/">
        search
      </LinkAnchor>

      <LinkAnchor
        onClick={handleCreateButton}
        to="/create/">
        create
      </LinkAnchor>

      <LinkAnchor
        onClick={handleMenuButton}
        to={`/profile/${uid}`}>
        profile
      </LinkAnchor>
    </Wrapper>
  )
};


const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  height: 20rem;
  margin-top: 20vh;

  @media (min-width: 768px) {
    flex-direction: row;
    height: auto;
    width: 25rem;
    margin-top: 0;
  }
`;

const LinkAnchor = styled(Link)`
  color: ${colors.white};
  text-decoration: none;
  font-size: 2rem;
  transition: transform .2s;

  &:hover, &:focus {
    transform: translateX(5px);
  }

  @media (min-width: 768px) {
    font-size: 1.4rem;

    &:hover, &:focus {
      transform: translateY(-2px);
    }
  }
`;


export default Menu

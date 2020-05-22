import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import menu from '../../assets/images/menu.svg';
import back from '../../assets/images/back.svg';


const Navbar = ({
  uid,
  location,
  goBack,
  cancelSesion,
  chooseMethod,
  askForDeleting,
  deleteSetChanges,
  closeChangePassword
}) => {

  const handleBackButton = () => {
    if (location === 'learn') {
      cancelSesion(true);

    } else if (location === 'profile') {
      closeChangePassword(false);

    } else if (location === 'set') {
      chooseMethod(false);
      goBack();

    } else if (location === 'create') {
      askForDeleting(false);
      goBack();

    } else if (location === 'edit') {
      deleteSetChanges();
      askForDeleting(false);
      goBack();

    } else {
      goBack()
    }
  }

  const handleMenuButton = () => {
    chooseMethod(false);
    askForDeleting(false)
  }

  return (
    <>
      { location &&
        <Nav>

          <BackButton
            tabIndex='2'
            visible={location === 'home' ? 0 : 1}
            onClick={handleBackButton}
          >
            <img src={back} alt='go back' />
          </BackButton>

          <Title>{ location }</Title>

          <Button
            tabIndex='2'
            visible={true.toString()}
            onClick={handleMenuButton}
            to={`/profile/${uid}`}
          >
            <img src={menu} alt='menu' />
          </Button>

        </Nav>
      }
    </>
  );
}


const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  height: 60px;
  padding: 0 7vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
`;

const BackButton = styled.button`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  padding: 0;
  visibility: ${props =>
    props.visible ? "visible" : "hidden"
  }
`;

const Button = styled(Link)`
  width: 24px;
  height: 24px;
  text-decoration: none;
  visibility: ${(props) => props.visible ? "visible" : "hidden" }
`;

const Title = styled.p`
  text-transform: uppercase;
  font-weight: 600;
  font-size: 18px;
  margin: 0
`;

export default Navbar;

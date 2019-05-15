import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signUp, signIn } from '../../store/actions/authActions';
import { Redirect } from 'react-router-dom';

import { Main, Button, colors } from '../../styled/GlobalStyles';
import styled from 'styled-components';


const SwitchWrapper = styled.div`
  height: 60px;
  display: flex;
  position: relative;
`;

const Switch = styled.button`
  background: none;
  border: none;
  font-family: 'Open Sans', sans-serif;
  color: ${colors.black};
  font-size: 16px;
  width: 50%
`;

const Border = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 2px;
  background: ${colors.blue};
  transform: ${props => props.toggle ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.4s ease-out
`;

const Form = styled.form`
  margin: 60px 0;
`;

const Wrapper = styled.div`
  position: relative;
  border-radius: 5px;
  box-shadow: 0 7px 15px -5px rgba(7, 22, 124, 0.2);
  margin: 40px 0;
`;

const Label = styled.label`
  position: absolute;
  top: -1.2rem;
  left: 0;
  font-size: 12px;
  color: ${colors.gray}
`;

const Input = styled.input`
  border-radius: 5px;
  border: none;
  padding: 1rem 1rem;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  font-family: 'Open Sans', sans-serif;
  color: ${colors.black}
`;


class Login extends Component {
  state = { toggle: true }

  handleClick = (toggle) => {
    this.setState({
      toggle: toggle
    })
  }

  render() {
    const { auth, signIn, signUp } = this.props;
    if (auth.uid) return <Redirect to={`/profile/${auth.uid}`} />;

    return (
      <Main>
        <SwitchWrapper>
          <Switch onClick={() => this.handleClick(true)}>sign in</Switch>
          <Switch onClick={() => this.handleClick(false)}>sign up</Switch>
          <Border toggle={this.state.toggle} />
        </SwitchWrapper>

          { this.state.toggle ?
            <SignInForm auth={ auth } signIn={ signIn } /> :
            <SignUpForm auth={ auth } signUp={ signUp } />
          }
      </Main>
    );
  }
}

class SignInForm extends Component {
  state = {
    email: "",
    password: ""
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.signIn(this.state)
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
      <Wrapper>
        <Label htmlFor="email">email</Label>
        <Input id="email" name="email" type="email" onChange={this.handleChange} required/>
      </Wrapper>
      <Wrapper>
        <Label htmlFor="password">password</Label>
        <Input id="password" name="password" type="password" onChange={this.handleChange} required/>
      </Wrapper>

      <Button>sign in</Button>
    </Form>
    );
  }
}

class SignUpForm extends Component {
  state = {
    email: "",
    username: "",
    password: "",
    confirm: ""
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.signUp(this.state)
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Wrapper>
          <Label htmlFor="email">email</Label>
          <Input id="email" name="email" type="email" onChange={this.handleChange} required/>
        </Wrapper>
        <Wrapper>
          <Label htmlFor="name">username</Label>
          <Input id="username" name="name" type="text" onChange={this.handleChange} required/>
        </Wrapper>
        <Wrapper>
          <Label htmlFor="password">password</Label>
          <Input id="password" name="password" type="password" onChange={this.handleChange} required/>
        </Wrapper>
        <Wrapper>
          <Label htmlFor="password">confirm</Label>
          <Input id="confirm" name="password" type="password" onChange={this.handleChange} required/>
        </Wrapper>

        <Button>sign up</Button>
      </Form>
    )
  }
}


const mapStateToProps = state => ({
  auth: state.firebase.auth,
  authError: state.auth.authError
});

export default connect(mapStateToProps, { signIn, signUp })(Login);

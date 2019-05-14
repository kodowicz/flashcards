import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { logOut } from '../../store/actions/authActions';
import { Link, Redirect } from 'react-router-dom';


class ViewProfile extends Component {

  handleClick = () => {
    this.props.logOut()
  }

  listOfSets = (sets) => {
    return sets.map((set, index) =>
      <SetWrapper key={ index }>
        <Link to={`/sets/${set.name}`}>
          <Topic>{ set.name }</Topic>
          <Info>{ set.terms.length } terms</Info>
        </Link>
      </SetWrapper>
    )
  }

  render() {
    const { userSets, user, auth } = this.props;

    if (!auth.uid) return <Redirect to="/signup" />;

    return (
      <Main>
        <Title>hello { user.username }</Title>

        <UserDetails user={ user }/>

        <Button onClick={this.handleClick}>log out</Button>

        <List>
          <Subtitle>your sets</Subtitle>
          { this.listOfSets(userSets) }
        </List>
      </Main>

    );
  }
}

const UserDetails = ({ user }) => (
  <List>
    <ListItem>
      <span>email</span>
      <span>{ user.email }</span>
    </ListItem>
    <ListItem>
      <span>username</span>
      <span>{ user.username }</span>
    </ListItem>
    <ListItem>
      <span>change password</span>
    </ListItem>
  </List>
)


const mapStateToProps = state => {
  const userId = state.firebase.auth.uid;
  const sets = state.firestore.ordered.sets;
  const userSets = sets ? sets.filter(set => set.authorId === userId) : [];

  return ({
    userSets: userSets,
    user: state.firebase.profile,
    auth: state.firebase.auth,
    authError: state.auth.authError
  })
}

export default compose(
  connect(mapStateToProps, { logOut }),
  firestoreConnect([
    { collection: 'sets' }
  ])
)(ViewProfile);
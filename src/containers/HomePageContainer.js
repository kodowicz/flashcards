import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { changeLocation, changeLastLocation } from '../store/actions/locationActions';
import HomePage from '../components/dashboard/HomePage';


const HomePageContainer = (props) => (
  <HomePage
    isLogged={props.isLogged}
    sets={props.sets}
    changeLocation={props.changeLocation}
    changeLastLocation={props.changeLastLocation}
  />
);

const mapStateToProps = state => {
  console.log(state.firestore.ordered);
  return({
  isLogged: state.firebase.auth.uid ? true : false,
  sets: state.firestore.ordered.sets
})}

export default compose(
  connect(mapStateToProps, { changeLocation, changeLastLocation }),
  firestoreConnect([
    { collection: 'sets' }
  ])
)(HomePageContainer);

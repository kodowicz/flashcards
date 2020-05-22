export const signIn = data => (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();

  firebase.auth().signInWithEmailAndPassword(
    data.email,
    data.password
  )
  .then(() => dispatch({ type: 'LOGIN_SUCCESS' }))
  .catch(error =>
    dispatch({
      type: 'LOGIN_ERROR',
      error
    })
  )
}

export const signUp = newUser => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();

  firebase.auth().createUserWithEmailAndPassword(
    newUser.email,
    newUser.password
  )
  .then((resp) => {
    return firestore.collection('users').doc(resp.user.uid).set({
      email: newUser.email,
      username: newUser.username,
      unsavedSet: "",
      notification: "",
      editedSet: ""
    })
  })
  .then(() => dispatch({ type: 'SIGNUP_SUCCESS' }))
  .catch(error =>
    dispatch({
      type: 'SIGNUP_ERROR',
      error
    })
  )
}

export const logOut = () => (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();

  firebase.auth().signOut()
  .then(() => {
    dispatch({
      type: 'LOGOUT_SUCCESS'
    })
  })

}

export const changePassword = (data) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;

  const credential = firebase.auth.EmailAuthProvider.credential(
    user.email,
    data.password
  );

  user.reauthenticateWithCredential(credential)
  .then(() => {
    firebase.auth().currentUser.updatePassword(data.newpassword);
    dispatch({
      type: 'CHANGE_PASSWORD',
      payload: false
    })
  })
  .catch(error => {
    dispatch({
      type: 'CHANGE_PASSWORD_ERROR'
    })
  })

}


export const cleanErrorNotification = () => ({
  type: 'CLEAN_UP'
})

export const signUpError = message => ({
  type: 'INVALID_DATA',
  message
})

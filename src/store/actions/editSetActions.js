export const editSetName = name => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const setId = getState().firestore.ordered.set[0].id;

  const docRef = firestore.doc(`sets/${setId}/`);

  docRef.update({
    name: name
  })
}

export const updateTerm = project => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const docId = getState().firestore.ordered.set[0].id;
  const subcollection = project.id;

  const docRef = firestore.doc(`sets/${docId}/terms/${subcollection}`);

  docRef.get().then(thisDoc => {
    if (thisDoc.exists) {
      docRef.update({
        term: project.term,
        definition: project.definition
      })
    }
  })
  .then(() => {
    dispatch({
      type: 'EDIT_SET'

    })
  }).catch(error => {
    dispatch({
      type: 'EDIT_SET_ERROR',
      error
    })
  })
}

export const addNewTerm = () => (dispatch, getState, { getFirestore })  => {
  const firestore = getFirestore();
  const setId = getState().firestore.ordered.set[0].id;

  const setRef = firestore.doc(`sets/${setId}`);
  const newDocRef = firestore.collection(`sets/${setId}/terms`).doc();
  const keyId = newDocRef.id;

  setRef.get().then(thisDoc => {
    let amount = thisDoc.data().amount;
    amount += 1;

    setRef.update({
      amount
    })
  })

  newDocRef.set({
    id: keyId,
    term: "",
    definition: "",
    time: new Date()
  })
  .then(() => {
    dispatch({
      type: 'ADD_NEW_TERM'
    })
  }).catch(error => {
    dispatch({
      type: 'ADD_NEW_TERM_ERROR',
      error
    })
  })
}

export const submitEditedSet = isSubmited => ({
  type: 'SUBMIT_EDIT_SET',
  isSubmited
})

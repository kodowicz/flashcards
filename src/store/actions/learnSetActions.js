export const createLearnSet = setid => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const uid = getState().firebase.auth.uid;

  const setRef = firestore.doc(`sets/${setid}`);
  const setTermsRef = firestore.collection(`sets/${setid}/terms`);
  const learnDetailsRef = firestore.doc(`users/${uid}/learn/${setid}/`);
  const learnSetRef = firestore.collection(`users/${uid}/learn/${setid}/flashcards`);


  learnSetRef.get().then(snap => {
    if (!snap.size) {

      setRef.get().then(doc => {
        const { amount, name } = doc.data();

        learnDetailsRef.set({
          name,
          amount,
          knowledge: 0,
          id: learnDetailsRef.id,
        })
      })

      setTermsRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          const { term, definition, time } = doc.data();
          const termRef = learnSetRef.doc();
          const id = termRef.id;

          termRef.set({
            id,
            term,
            definition,
            time
          })
        })
      })
    }
  }).then(() => {
    dispatch({
      type: 'CREATE_LEARN_SET'

    })
  }).catch(error => {
    dispatch({
      type: 'CREATE_LEARN_SET_ERROR',
      error
    })
  })
}

export const shuffleCard = term => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const uid = getState().firebase.auth.uid;
  const set = getState().setid;
  const time = new Date();

  const docRef = firestore.doc(`users/${uid}/learn/${set}/flashcards/${term.id}`);

  docRef.update({
    time
  })
  .then(() => {
    dispatch({
      type: 'SHUFFLE_CARD'
    })
  }).catch(error => {
    dispatch({
      type: 'SHUFFLE_CARD_ERROR',
      error
    })
  })
}

export const throwoutCard = term => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const uid = getState().firebase.auth.uid;
  const set = getState().setid;

  const docRef = firestore.doc(`users/${uid}/learn/${set}/flashcards/${term}`);

  docRef.delete()
  .then(() => {
    dispatch({
      type: 'THROWOUT_CARD'
    })
  }).catch(error => {
    dispatch({
      type: 'THROWOUT_CARD_ERROR',
      error
    })
  })
}

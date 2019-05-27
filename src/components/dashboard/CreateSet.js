import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { changeLocation, changeLastLocation } from '../../store/actions/locationActions';
import { setUnsavedName, addUnsavedTerm, addNewUnsavedTerm, submitSet } from '../../store/actions/setsActions';
import { Redirect } from 'react-router-dom';

import styled, { css } from 'styled-components';
import { Button, Main, BlockShadow, BasicInput, colors } from '../../assets/styles/GlobalStyles';


const SetName = styled.div`
  position: relative;
  margin: 100px 10px 60px;
`;

const NameLabel = styled.label`
  position: absolute;
  bottom: 5px;
  left: 0;
  font-size: 20px;
  color: ${colors.gray};
  transition: opacity 0.1s;

  ${props => props.isFilled && css `
    opacity: 0;
  `}
`;

const NameInput = styled(BasicInput)`
  padding: 5px 0;
  width: 100%;
  font-size: 20px;
  outline-color: ${colors.blue};

  &:focus + ${NameLabel} {
    opacity: 0;
  }
`;

const Border = styled.div`
  width: 100%;
  height: 1px;
  background: ${colors.gray};
  position: absolute;
  bottom: ${props => props.isBig ? '0' : '10px'};
  left: 0;
`;

const Form = styled.form`
  margin: 100px 0
`;

const AddButton = styled(Button)`
  margin: 50px auto
`;

const SubmitButton = styled(Button)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%
`;

const TermWrapper = styled(BlockShadow)`
  padding: 5px 20px 25px 20px;
  margin: 25px 0;
`;

const DefineTerm = styled.div`
  position: relative;
  padding: 5px 0 10px 0;
`;

const Label = styled.label`
  position: absolute;
  bottom: -5px;
  left: 0;
  color: ${colors.gray};
  font-size: 10px;
  text-transform: uppercase;
`;

const Input = styled(BasicInput)`
  width: 100%;
  border: none;
  padding: 5px 0;
  outline-color: ${colors.blue}

`;




class CreateSet extends Component {
  state = {
    setName: ""
  }

  componentDidMount() {
    this.props.changeLocation('create');
    this.props.changeLastLocation("/");
  }

  componentWillReceiveProps (newProps) {
    const { unsavedSetName, unsavedSetTerms } = this.props;

    if (unsavedSetName !== newProps.unsavedSetName) {
      this.setState({
        setName: newProps.unsavedSetName
      })
    }
  }

  setName = event => {
    this.setState({
      setName: event.target.value
    })
  }

  addTerm = event => {
    event.preventDefault();
    this.props.addNewUnsavedTerm();
  }

  submitName = () => {
    this.props.setUnsavedName(this.state.setName)
  }

  submitSet = event => {
    event.preventDefault();
    this.props.submitSet()
  }

  render() {
    const { auth, unsavedSetTerms, newSetKey, addUnsavedTerm } = this.props;
    const isFilled = this.state.setName ? true : false;
    console.log(unsavedSetTerms);
    if (!auth.uid) return <Redirect to="/signup" />;
    if (newSetKey) return <Redirect to={`/sets/${newSetKey}`} />

    return (
      <Main>
        <SetName>
          <NameInput value={this.state.setName} onChange={this.setName} onBlur={this.submitName} />
          <NameLabel isFilled={isFilled} htmlFor="name">Name your set</NameLabel>
          <Border isBig="true" />
        </SetName>

        <Form>
          { unsavedSetTerms !== undefined ?
            unsavedSetTerms.length !== 0 ?
              <>
                <UnsavedTerms
                  unsavedSetTerms={unsavedSetTerms}
                  addUnsavedTerm={addUnsavedTerm} />

              </>
              :
              <NewTerms addUnsavedTerm={addUnsavedTerm} />
            :
            <></>
          }
          <AddButton onClick={this.addTerm}>add term</AddButton>
          <SubmitButton onClick={this.submitSet}>done</SubmitButton>
        </Form>

      </Main>
    )
  }
}

const UnsavedTerms = ({ unsavedSetTerms, addUnsavedTerm }) => {
  return unsavedSetTerms.map(term =>
    <Term termDetails={term} key={term.id} addUnsavedTerm={addUnsavedTerm} />
  )
};

const NewTerms = ({ addUnsavedTerm }) => (
  <>
    <Term addUnsavedTerm={addUnsavedTerm} />
    <Term addUnsavedTerm={addUnsavedTerm} />
  </>
)

class Term extends Component {
  state = {
    term: "",
    definition: "",
    id: null
  }

  componentDidMount () {
    if (this.props.termDetails) {
      const { definition, term, id } = this.props.termDetails;
      this.setState({
        term,
        definition,
        id
      })
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    }, () => this.props.addUnsavedTerm(this.state));
  }

  handleFinish = () => {
    // this.props.addUnsavedTerm(this.state);
  }

  render() {
    return (
      <TermWrapper>
        <DefineTerm>
          <Input
            id="term"
            value={this.state.term}
            onChange={this.handleChange}
            onBlur={this.handleFinish}
          />
          <Label htmlFor="term">term</Label>
          <Border />
        </DefineTerm>
        <DefineTerm>
          <Input
            id="definition"
            value={this.state.definition}
            onChange={this.handleChange}
            onBlur={this.handleFinish}
          />
          <Label htmlFor="definition">definition</Label>
          <Border />
        </DefineTerm>
      </TermWrapper>
    );
  }
}



const mapStateToProps = state => {
  const users = state.firestore.ordered.users;
  let unsavedSetTerms = users ?               // why firebase doesn't connect with subcollection?
    users[0].unsaved === undefined ?
      users : users[0].unsaved
      :
      [];

  return ({
    auth: state.firebase.auth,
    location: state.location,
    lastLocation: state.lastLocation,
    unsavedSetName: state.firebase.profile.unsavedSet,
    unsavedSetTerms: unsavedSetTerms,
    isTermAdded: state.isTermAdded,
    newSetKey: state.newSetKey
  })
}

export default compose(
  connect(
    mapStateToProps,
    { setUnsavedName, addUnsavedTerm, addNewUnsavedTerm, submitSet, changeLocation, changeLastLocation }
  ),
  firestoreConnect(props => [
    {
      collection: 'users',
      doc: props.auth.uid,
      subcollections: [
        { collection: 'unsaved' }
      ]
    }
  ])
)(CreateSet);

import React, { Component } from 'react';
import styled from 'styled-components';

import { BlockElement, BasicInput, colors } from '../../assets/styles/GlobalStyles';
import remove from '../../assets/images/remove.svg';


class Term extends Component {
  state = {
    term: "",
    definition: "",
    id: null,
    firstTouch: null,
    lastTouch: null,
    currentTouch: null,
    isDeleted: false,
    isMoved: 0,
    termFocused: false,
    definitionFocused: false,
    termLabelVisible: false,
    definitionLabelVisible: false
  }

  componentDidMount () {
    const { termDetails } = this.props;

    if (termDetails) {
      const { definition, term, id } = termDetails;

      this.setState({
        term,
        definition,
        id,
        termLabelVisible: Boolean(term),
        definitionLabelVisible: Boolean(definition),
      })
    }
  }

  handleFocus = event => {
    this.setState({
      [`${event.target.id}Focused`]: true,
      [`${event.target.id}LabelVisible`]: true
    })
  }

  handleBlur = event => {
    const hasValue = event.target.value ? true : false;

    this.setState({
      [`${event.target.id}Focused`]: false,
      [`${event.target.id}LabelVisible`]: hasValue
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    }, () => this.props.updateTerm(this.state));
  }

  handleTouchStart = event => {
    this.setState({
      lastTouch: event.targetTouches[0].clientX,
      firstTouch: event.targetTouches[0].clientX
    })
  }

  handleTouchMove = event => {
    const currentTouch = event.targetTouches[0].clientX;

    this.setState(() => ({
      currentTouch
    }), () => {
      let isDeleted = null;
      let isMoved = 0;

      isMoved = -(this.state.firstTouch - this.state.currentTouch);

      if (this.state.lastTouch > this.state.currentTouch) {
        isDeleted = true;
        if (isMoved <= -80) {
          isMoved = -80
        } else if (isMoved > 0) {
          isMoved = 0
        }

      } else if (this.state.lastTouch < this.state.currentTouch) {
        isDeleted = false;
        if (isMoved >= 0) {
          isMoved = 0
          // TODO: moving back too fast
        } else if (isMoved < -80) {
          isMoved = -80
        }
      }

      this.setState({
        isDeleted,
        isMoved,
        lastTouch: currentTouch
      })
    })
  }

  handleTouchEnd = event => {
    if (this.state.isMoved < -40) {
      this.setState({
        isMoved: -80
      })
    } else {
      this.setState({
        isMoved: 0
      })
    }
  }

  removeElement = event => {
    event.preventDefault();
    this.props.removeTerm(this.state.id);
  }

  render() {
    const {
      term,
      definition,
      isMoved,
      termFocused,
      definitionFocused,
      termLabelVisible,
      definitionLabelVisible
    } = this.state;

    return (
      <Wrapper>
        <TermWrapper
          isMoved={isMoved}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
        >
          <DefineTerm>
            <Input
              id="term"
              value={term}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
            <Label
              isVisible={termLabelVisible}
              htmlFor="term"
            >
              term
            </Label>
            <Border focused={termFocused} />
          </DefineTerm>
          <DefineTerm>
            <Input
              id="definition"
              value={definition}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
            <Label
              isVisible={definitionLabelVisible}
              htmlFor="definition"
            >
              definition
            </Label>
            <Border focused={definitionFocused} />
          </DefineTerm>
        </TermWrapper>
        <DeleteButton
          isMoved={isMoved}
          onClick={this.removeElement}
        >
          <img src={remove} alt="remove" />
        </DeleteButton>
      </Wrapper>
    );
  }
}


const Wrapper = styled.div`
  display: grid;
  grid-template: 1fr / 1fr 80px;
`;

const TermWrapper = styled(BlockElement)`
  transform: ${props => `translateX(${props.isMoved}px)`};
  height: 9rem;
  display: grid;
  grid-template-columns: 80%;
  grid-template-rows: repeat(2, min-content);
  grid-row-gap: .5rem;
  place-content: center;
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  transition: transform 0.1s ease-out;
`;

const DefineTerm = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: ${(props) => props.isVisible && 'none'};
  font-size: ${(props) => props.htmlFor === 'term' ? '1.6rem' : '1.4rem'};
  color: ${colors.darkGray};
  position: absolute;
  bottom: 0px;
  left: 0;
  z-index: -1;
`;

const Input = styled(BasicInput)`
  font-size: ${(props) => props.id === 'term' ? '1.6rem' : '1.4rem'};
  color: ${(props) => props.id === 'term' ? `${colors.white}` : `${colors.lightGray}`};
  width: 100%;
  border: none;
  outline: none;
`;

const Border = styled.div`
  background: ${props => props.focused && `${colors.white}`};
  width: 100%;
  height: 1px;
  position: absolute;
  bottom: -2px;
  left: 0;

`;

const DeleteButton = styled.button`
  display: ${ props => props.isMoved ? 'block' : 'none' };
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  background: none;
  border: none;
  padding: 0;
`;


export default Term

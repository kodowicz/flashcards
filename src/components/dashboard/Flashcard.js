import React, { Component } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Button, colors, fonts } from '../../assets/styles/GlobalStyles';


export class FrontCard extends Component {
  constructor(props) {
    super(props);

    this.cardRef = React.createRef();

    this.state = {
      id: null,
      isFlipped: true,
      isMoved: false,
      toggle: false,
      cardCenter: {},
      point: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      rotateFront: 0,
      rotateBack: -180,
      transformCard: { x: 0, y: 0, rotate: 0 },
      moveLeft: false,
      moveRight: false,
      backAmplitude: 20,
      horizontalAmp: 100,
      verticalAmp: 50
    }
  }

  componentDidMount () {
    const cardCenter = this.cardRef.current.getBoundingClientRect();
    const horizontalAmp = this.props.moveEnabled ? 100 : 35;
    this.setState({
      horizontalAmp,
      cardCenter: {
        left: cardCenter.left,
        right: cardCenter.right
      }
    })
  }

  flipCard = () => {
    if (this.state.isFlipped) {
      if (!this.state.isMoved) {
        this.setState(prevState => {
          const rotateFront = prevState.rotateFront + 180;
          const rotateBack = prevState.rotateBack + 180;

          return ({
            rotateFront: rotateFront,
            rotateBack: rotateBack,
            toggle: !prevState.toggle
          })
        })
        this.setState({ isFlipped: false });
      } else {
        this.setState({ isMoved: false });
      }
    }
  }

  animateCard = () => {
    this.setState({ isFlipped: true });
  }

  startTouch = event => {
    this.setState({
      point: {
        x: event.targetTouches[0].pageX,
        y: event.targetTouches[0].pageY
      }
    })
  }

  moveCard = event => {
    const position = {
      x: event.targetTouches[0].pageX,
      y: event.targetTouches[0].pageY
    };

    this.setState({ position: position }, () => {
      const { point, position, horizontalAmp, verticalAmp } = this.state;
      let delta = {
        x: ((position.x - point.x) > horizontalAmp) ?
        horizontalAmp :
        ((position.x - point.x) < -horizontalAmp) ?
        -horizontalAmp :
        position.x - point.x,

        y: ((position.y - point.y) > verticalAmp) ?
        verticalAmp :
        ((position.y - point.y) < -verticalAmp) ?
        -verticalAmp :
        position.y - point.y
      };

      let rotate = delta.x * 0.1;

      this.setState({
        transformCard: {
          x: delta.x,
          y: delta.y,
          rotate: rotate
        },
        isMoved: true
      })
    })
  }

  stopTouch = event => {
    const { isMoved, cardCenter, backAmplitude } = this.state;
    const cardPosition = this.cardRef.current.getBoundingClientRect();

    if (cardCenter.left - cardPosition.left > backAmplitude && isMoved) {
      this.moveLeft();

    } else if (cardPosition.right - cardCenter.right > backAmplitude && isMoved) {
      this.moveRight();

    } else {
      this.setState({
        transformCard: {
          x: 0,
          y: 0,
          rotate: 0
        }
      })
    }
  }

  moveLeft = () => {
    const { term, shuffleCard, moveEnabled } = this.props;

    if (moveEnabled) {
      this.setState({
        moveLeft: true
      })

      this.cardRef.current.addEventListener('animationend', function() {
        shuffleCard(term);
      }, false);

    } else {
      this.setState({
        transformCard: {
          x: 0,
          y: 0,
          rotate: 0
        }
      })
    }
  }

  moveRight = () => {
    const { term, throwoutCard } = this.props;

    this.setState({
      moveRight: true
    })

    this.cardRef.current.addEventListener('animationend', function() {
      throwoutCard(term.id);
    }, false);
  }

  render() {
    const { toggle, rotateFront, rotateBack, transformCard, moveLeft, moveRight } = this.state;
    const { layerIndex, term } = this.props;

    return (
      <FrontWrapper
        ref={this.cardRef}
        flip={toggle}
        layerIndex={layerIndex}
        transformation={transformCard}
        moveLeft={moveLeft}
        moveRight={moveRight}
        onClick={this.flipCard}
        onTransitionEnd={this.animateCard}
        onTouchMove={this.moveCard}
        onTouchStart={this.startTouch}
        onTouchEnd={this.stopTouch}
      >
        <Front rotate={rotateFront}>
          <Top>
            <Term>{ term.term }</Term>
          </Top>
          <Bottom>
            <Tap>tap to flip</Tap>
          </Bottom>
        </Front>

        <Back rotate={rotateBack} onTouchMove={this.moveCard}>
          <Top>
            <Term>{ term.definition }</Term>
          </Top>
          <Bottom>
            <Tap>tap to flip</Tap>
          </Bottom>
        </Back>
      </FrontWrapper>
    )
  }
}


export const BackCard = ({ term }) => (
  <BackWrapper>
    <Front>
      <Top>
        <Term>{ term.term }</Term>
      </Top>
      <Bottom>
        <Tap>tap to flip</Tap>
      </Bottom>
    </Front>

    <Back>
      <Top>
        <Term>{ term.definition }</Term>
      </Top>
      <Bottom>
        <Tap>tap to flip</Tap>
      </Bottom>
    </Back>
  </BackWrapper>
)


export const Congratulations = ({ setid, layerIndex, createLearnSet }) => (
  <CongratsWrapper layerIndex={layerIndex}>
    <div>
      <Title>Congratulations!</Title>
      <Text>You've learnt everything!</Text>
      <Button
        color={colors.navy}
        onClick={() => createLearnSet(setid)}
      >
        restart
      </Button>
    </div>
  </CongratsWrapper>
);


const Wrapper = styled.div`
  color: ${colors.navy};
  grid-column: 1 / 1;
  grid-row: 1 / 1;
  width: 220px;
  height: 300px;
  background: white;
  -webkit-user-select: none;
  transition: transform .2s;
`;

const Card = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0 0 20px rgba(88, 38, 235, 0.53);
  transition: transform .6s, opacity 0s;
  transform: ${props => `rotateY(${props.rotate}deg)`};
`;

const Front = styled(Card)`
  opacity: 1
`;

const Back = styled(Card)`
  opacity: 0
`;

const FrontWrapper = styled(Wrapper)`
  perspective: 1000px;
  z-index: 5;

  /*flipping a card */
  ${ ({ flip }) => flip && css`
    ${Front} {
      transition: transform .6s, opacity 0s .5s;
      opacity: 0;
    }

    ${Back} {
      transition: transform .6s, opacity 0s .15s;
      opacity: 1;
    }
  `};

  /* move card */
  ${ ({ transformation }) => transformation.rotate !== 0 && css`
    transform: translate(${transformation.x}px, ${transformation.y}px) rotate(${transformation.rotate}deg)
  `};

  ${ ({ moveLeft, transformation }) => moveLeft && css`
    animation: ${shuffle(transformation)} 0.8s ease-out forwards
  `};

  ${ ({ moveRight, transformation }) => moveRight && css`
    animation: ${throwOut} 1s ease-out forwards
  `};
`;

const BackWrapper = styled(Wrapper)`
  background: white;
  z-index: 3;
  transform: translate(-2px, -5px) rotate(5deg);
  box-shadow: 0 0 20px rgba(88, 38, 235, 0.53);

  &::before, &::after {
    content: "";
    position: absolute;
    background: #f7f7f7;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }

  &::before {
    transform: translate(-2px, 0px) rotate(-7deg);
    z-index: -2;
  }

  &::after {
    transform: translate(-5px, 5px) rotate(-2deg);
    z-index: -1
  }
`;

const CongratsWrapper = styled(Wrapper)`
  position: relative;
  background: white;
  z-index: 0;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 20px #83838378;
    background: white;

    &::before, &::after {
      content: "";
      position: absolute;
      background: white;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      box-shadow: 0 0 5px #20193c91;
    }

    &::before {
      z-index: -1;
      transform: translate(7px, -2px) rotate(3deg)
    }

    &::after {
      transform: translate(-3px, 6px) rotate(-2deg);
      z-index: -2
    }
  }
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 700;
  font-size: 2rem;
  margin: 0
`;

const Text = styled.p`
  font-size: 1.4rem;
  margin: 0 0 40px
`;

// const Restart = styled(Button)`
//   font-size: 1.4rem;
//   padding: 1rem 4rem;
// `;

const shuffle = (transform) => keyframes`
  0% {
   z-index: 5
  }

  50% {
    transform: translate(-200px, ${transform.y}px) rotate(-15deg);
  }

  70% {
    z-index: 3
  }

  100% {
    transform: rotate(0deg);
    z-index: 3
  }
`;

const throwOut = keyframes`
  0% {
    opacity: 1
  }

  30% {
    opacity: 0.5
  }

  50% {
    transform: translateX(300px) rotate(15deg);
    opacity: 0.5
  }

  100% {
    transform: translateX(300px) rotate(15deg);
    opacity: 0
  }
`;

const Top = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bottom = styled.div`
  height: 4rem;
  border-top: 2px solid #BAACE0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Term = styled.div`
  font-size: 2rem;
  text-align: center;
`;

const Tap = styled.button`
  text-transform: uppercase;
  background: none;
  border: none;
  color: ${colors.navy};
  font-size: 1.2rem;
  font-family: ${fonts.family}
`;

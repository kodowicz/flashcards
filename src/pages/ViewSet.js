import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import MethodChoiceOverlay from '../components/overlay/MethodChoiceOverlay';
import ProgressBar from '../components/ProgressBar';
import RatioDots from '../components/RatioDots';

import styled from 'styled-components';
import sort from '../assets/images/sort.svg';
import { LinkButton, Button, Main, BlockElement, colors, fonts } from '../assets/styles/GlobalStyles';


class ViewSet extends Component {
  componentDidMount() {
    this.props.changeLocation('set');
    this.props.changeLastLocation("/");
    this.props.removeNewKey();
    this.props.enableEditSet();
    this.props.setCurrentSetId(this.props.match.params.id);

    window.scrollTo(0, 0)
  }

  render() {
    const {
      match,
      setDetails,
      author,
      percentage,
      sortedBy,
      terms,
      signedUser,
      isUserSet,
      isOverlayOpen,
      sortTerms,
      createEditSet,
      chooseMethod,
      createLearnSet,
      createPlaySet
    } = this.props;

    const iseditable = author === signedUser ? true : false;
    const progressBarWidth = window.innerWidth < 768 ? 6 : 7;

    // handle if set doesn't exist
    if (terms.length === 0 && !setDetails) return <Redirect to='/404' />;

    if (isOverlayOpen) {
      return (
        <MethodChoiceOverlay
          signedUser={signedUser}
          setid={match.params.id}
          chooseMethod={chooseMethod}
          createLearnSet={createLearnSet}
          createPlaySet={createPlaySet} />
      )
    } else {

      return (
        <Main width={76} maxWidth={650} desktop={700}>
          <Description
            setDetails={setDetails}
            percentage={percentage}
            width={progressBarWidth} />

          <Buttons
            setid={match.params.id}
            iseditable={iseditable}
            createEditSet={createEditSet}
            chooseMethod={chooseMethod} />

          <TermsList
            terms={terms}
            isUserSet={isUserSet}
            sortedBy={sortedBy}
            sortTerms={sortTerms} />
        </Main>
      )
    }
  }
}

const Description = ({ setDetails, percentage, width }) => (
  <>
    <DetailsWrapper isExtended={!isNaN(percentage)}>
      <SetName isExtended={percentage}>{setDetails.name}</SetName>
        <Info>{setDetails.amount} terms</Info>
        <Border />
        <Info>by {setDetails.author}</Info>
        { (!isNaN(percentage)) &&
          <Progress>
            <ProgressBar
              percentage={percentage}
              width={`${width}rem`}
              bgColor={colors.progress} />
          </Progress>
        }
    </DetailsWrapper>
  </>
);

const Buttons = ({ setid, iseditable, chooseMethod, createEditSet }) => {
  const handleChoice = () => {
    // open overlay then create
    chooseMethod(true)
  }

  const handleEdit = () => {
    createEditSet();
  }

  return (
    <ButtonsWrapper iseditable={iseditable.toString()}>
      { iseditable &&
        <div onClick={handleEdit}>
          <LinkButton
             isCentre={true} to={`/edit/${setid}`}>
            edit set
          </LinkButton>
        </div>
      }
      <Button onClick={handleChoice}>
        learn set
      </Button>
    </ButtonsWrapper>
  );
};

const TermsList = ({ terms, isUserSet, sortedBy, sortTerms }) => {

  return (
    <TermListWrapper>
      <ListLable>
        <SubTitle>terms</SubTitle>
        <SortButton
          onClick={() => sortTerms()}>
          <span>
            {sortedBy ? 'alphabetical' : 'original'}
          </span>
          <SortImg src={sort} alt="" />
        </SortButton>
      </ListLable>
      <List>
        {terms.map((term, index) => (
          <ListItem key={term.id}>
            <Counter
              isLessThanTen={((index + 1) < 10) ? true : false}>
              {index + 1}
            </Counter>
            <SetWrapper>
              <TermWrapper>
                <Term id="term">{term.term}</Term>
                { isUserSet &&
                  <RatioDots ratio={term.ratio} />
                }
              </TermWrapper>

              <Line />
              <Term id="definition">{term.definition}</Term>
            </SetWrapper>
          </ListItem>
        ))}
      </List>
    </TermListWrapper>
  )
};


const DetailsWrapper = styled.div`
  grid-template-columns: ${({ isExtended }) =>
    isExtended ?
      'min-content 15px min-content 20% 90px' :
      'min-content 15px min-content 1fr'
  };
  display: inline-grid;
  grid-template-rows: repeat(2, min-content);
  grid-row-gap: 0.7rem;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: ${({ isExtended }) =>
      isExtended ?
        'min-content 15px min-content 40% 90px' :
        'min-content 15px min-content 1fr'
    }
  };
`;

const SetName = styled.h1`
  max-width: ${({ percentage }) => percentage ? '50vw' : 'none'};
  font-weight: ${fonts.bold};
  grid-column: span 4;
  font-size: 3.2rem;
  margin: 0;

  @media (min-width: 768px) {
    max-width: ${({ percentage }) => percentage ? '35rem' : 'none'};
  }
`;

const Info = styled.span`
  color: ${colors.azure};
  grid-row: 2 / 3;
  white-space: nowrap;
`;

const Border = styled.div`
  background: ${colors.azure};
  height: 1.8rem;
  width: 1.5px;
  grid-column: 2 / 3;
  grid-row: 2 /3;
  place-self: center;
`;

const Progress = styled.figure`
  height: 6rem;
  margin: 0;
  grid-row: 1 / 3;
  grid-column: 5 / 6;
  place-self: center;
`;

const ButtonsWrapper = styled.div`
  margin: 40px auto 60px auto;
  display: flex;
  justify-content: space-evenly;
  max-width: 300px;

  @media (min-width: 768px) {
    justify-content: ${props =>
      props.iseditable ? 'space-between' : 'flex-start'
    };
    margin: 40px 0 60px;
  }
`;

const TermListWrapper = styled.div`
  width: 100%;
`;

const ListLable = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`;

const SubTitle = styled.h2`
  color: ${colors.white};
  font-size: 1.6rem;
  margin: 0
`;

const SortButton = styled.button`
  color: ${colors.white};
  font-family: ${fonts.family};
  font-size: 1.4rem;
  background: none;
  height: min-content;
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
`;

const SortImg = styled.img`
  width: 2rem;
  height: 2rem;
  padding-left: 3px
`

const List = styled.ul`
  margin: 0 0 4rem 0;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 1.6rem;
  height: 7.7rem;
  height: auto;
  list-style: none;
  position: relative;

  @media (min-width: 768px) {
    margin-bottom: 2rem
  }
`;

const SetWrapper = styled(BlockElement)`
  padding: 1.6rem 2rem;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, min-content);
  grid-row-gap: 2px;
  align-content: center;

  @media (min-width: 768px) {
    padding: 2rem 0;
    grid-template-columns: 1fr 2px 1fr;
    grid-template-rows: 1fr;
    align-items: center;
  }
`;

const Counter = styled.span`
  left: ${props => props.isLessThanTen ? '-8vw' : '-10vw' };
  color: ${colors.azure};
  font-weight: ${fonts.bold};
  position: absolute;
  top: 50%;
  font-size: 2.5rem;
  transform: translateY(-50%);
  user-select: none;

  @media (min-width: 768px) {
    left: -50px
  }
`;

const TermWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-template-rows: 1fr;
  grid-column-gap: 1.5rem;

  @media (min-width: 768px) {
    padding-right: 3.5rem;
    align-items: center;
  }
`;

const Term = styled.p`
  font-weight: ${(props) => props.id === 'term' ? `${fonts.bold}` : `${fonts.semiBold}`};
  font-size: ${(props) => props.id === 'term' ? '1.6rem' : '1.4rem'};
  color: ${(props) => props.id === 'term' ? `${colors.white}` : `${colors.lightGray}`};
  margin: 0;
  white-space: pre-line;
  user-select: text;

  @media (min-width: 768px) {
    padding: 0 3.5rem
  }
`;

const Line = styled.div`
  @media (min-width: 768px) {
    background: ${colors.darkGray};
    width: 100%;
    height: 2rem;
  }
`;

export default ViewSet

import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { create } from "ipfs-http-client";
import img from "../src/images/zombieHoodie.png";
import { StyledBanner } from "./styles/globalStyles";

export const StyledButton = styled.button`
  padding: 8px;
  border-radius: 5px;
  border-style: outset;
  border-width: 1px;
  -webkit-box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.63);
-moz-box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.63);
box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.33);
  &:active {
    background-color: aliceblue;
  }
  
`;

export const StyledCard = styled.div`
width: 300px;
height: 300px;
margin-bottom: 240px;
justify-content: center;
align-items: center;
display: flex;
flex-direction: column;
background-color: gray;
background-size: cover;
border-radius: 10px;
-webkit-box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.63);
-moz-box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.63);
box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.63);

`;



function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("Floor Price: .02 ETH");
  const [claimingNft, setClaimingNft] = useState(false);

  const [count, setCount] = useState(1);
  const incrementCount = () => {
    if (count < 5) {
      setCount(count + 1);
    }
  };
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const claimNFTs = (_amount) => {
    setClaimingNft(true);
    blockchain.smartContract.methods.buy(1, _amount).send({
      from: blockchain.account,
      value: blockchain.web3.utils.toWei((0.02 * _amount).toString(), "ether"),
    }).once("error", (err) => {
      console.log(err);
      setFeedback("Error");
      setClaimingNft(false);
    }).then((receipt) => {
      setFeedback("Success");
      setClaimingNft(false);
    });
  };

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);

  return (
    <s.Screen>

      {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>

          <s.HeaderText>Join The Horde!</s.HeaderText>

          <StyledCard>
            <s.TextTitle>Connect to the Blockchain</s.TextTitle>
            <s.SpacerSmall />
            <StyledButton
              onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
              }}
            >
              CONNECT
            </StyledButton>
            <s.SpacerSmall />
            {blockchain.errorMsg !== "" ? (
              <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
            ) : null}
          </StyledCard>
          <s.StyledFooter></s.StyledFooter>
        </s.Container>
      ) : (

        <s.Container

          flex={1}
          ai={"center"}
          jc={"center"}

        >
          <StyledCard>
            <s.TextTitle style={{ textAlign: "center" }}>
              Mint an Undead Monster
            </s.TextTitle>

            <s.SpacerXSmall />
            <s.TextDescription style={{ textAlign: "center" }}>{feedback}</s.TextDescription>
            <s.SpacerSmall />
            <StyledButton
              disabled={claimingNft ? 1 : 0}
              onClick={(e) => {
                e.preventDefault();
                claimNFTs(count);
              }}
            >
              {claimingNft ? "Claiming" : "MINT"}
            </StyledButton>
            <s.SpacerSmall />
            <s.ButtonContainer>
              <s.SpacerSmall />
              <StyledButton onClick={decrementCount}>-</StyledButton>
              <s.SpacerXSmall />
              <s.TextDescription>{count}</s.TextDescription>
              <s.SpacerXSmall />
              <StyledButton onClick={incrementCount}>+</StyledButton>

              <s.SpacerSmall />
            </s.ButtonContainer>
          </StyledCard>
          <s.StyledSkele></s.StyledSkele>


        </s.Container>

      )}

    </s.Screen>
  );
}

export default App;

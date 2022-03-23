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
  border-width: 1px;

  &:active {
    background-color: aliceblue;
  }
`;

export const StyledCard = styled.div`
width: 300px;
height: 300px;
margin-bottom: 50px;
justify-content: center;
align-items: center;
display: flex;
flex-direction: column;
background-color: lightgray;
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

  const claimNFTs = (_mintAmount) => {
    setClaimingNft(true);
    blockchain.smartContract.methods.mint(_mintAmount).send({
      from: blockchain.account,
      value: blockchain.web3.utils.toWei((0.02 * _mintAmount).toString(), "ether"),
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
        <StyledBanner></StyledBanner>
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
              claimNFTs(1);
            }}
          >
            {claimingNft ? "Busy Claiming" : "MINT 1"}
          </StyledButton>
          <s.SpacerSmall />
          <StyledButton
            disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              claimNFTs(5);
            }}
          >
            {claimingNft ? "Busy Claiming" : "MINT 5"}
          </StyledButton>
          <s.SpacerSmall />
          </StyledCard>
          <s.StyledSkele></s.StyledSkele>
          <s.StyledFooter></s.StyledFooter>
        </s.Container>
        
      )}
      
    </s.Screen>
  );
}

export default App;

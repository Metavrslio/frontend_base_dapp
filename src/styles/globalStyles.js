import styled from "styled-components";
import img from "../images/umcAqua.jpg";
import img2 from "../images/footerLogo.png";
import img3 from "../images/newFooter.png";
import img4 from "../images/skeleHoodie.png"

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--light-grey);
  background-image: url(${img});
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${img})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const TextTitle = styled.p`
  color: var(--white);
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px ;
  font-family: "Nove";
`;

export const TextSubTitle = styled.p`
  color: var(--black);
  font-size: 16px;
  font-weight: 500;
  
`;

export const TextDescription = styled.p`
  color: var(--black);
  font-size: 14px;
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const StyledBanner = styled.div`
  background-image: url(${img2});
  height: 250px;
  width: 390px;
  position: absolute;
  margin-bottom: -650px;
  border-style: none;
`;

export const StyledFooter = styled.div`
  background-image: url(${img3});
  height: 400px;
  width: 100%;
  max-width: 1400px;
  margin-bottom: -849px;
  
  position: absolute;
  background-size: cover;
  
`;

export const StyledSkele = styled.div`
  background-image: url(${img4});
  width: 180px;
  height: 200px;
  background-size: cover;
  background-position: center;
  position: absolute;
  margin-top: -550px;
`;

export const HeaderText = styled.p`
  color: white;
  font-size: 4rem;
  position: absolute;
  margin-top: -750px;
  font-family: "Nove";
`;

export const ButtonContainer = styled.div`
  width: 100px;
height: 77px;
margin-bottom: 50px;
justify-content: space-between;
text-align: center;
align-items: center;
display: flex;
flex-direction: row;
background-color: lightgray;
background-size: cover;
border-radius: 10px;
-webkit-box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.63);
-moz-box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.63);
box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.63);
`;
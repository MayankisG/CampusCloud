import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeContainer, SchoolInfo, Title } from "../styles/AuthStyles";
import styled from "styled-components";
import backgroundImage from "../assets/universityBackground.jpg";

const BackgroundImage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  filter: brightness(0.8);
  
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <BackgroundImage />
      <HomeContainer>
        <SchoolInfo>
          <Title>Welcome to Campus Management System!</Title>
          <button onClick={() => navigate("/signin")} >Get Started</button>
        </SchoolInfo>
      </HomeContainer>
    </>
  );
};

export default Home;
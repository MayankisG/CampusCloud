// StudentLayout.js
import React from "react";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

const LayoutContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 20px;
  width: 100%;
`;

const StudentLayout = () => {
  const imagePreview = localStorage.getItem("profileImage");

  return (
    <LayoutContainer>
      <Sidebar imagePreview={imagePreview} />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default StudentLayout;

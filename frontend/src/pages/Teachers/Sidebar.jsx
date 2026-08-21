import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  BsGraphUp,
  BsPeople,
  BsPerson,
  BsFileText,
  BsBook,
  BsGraphDown,
  BsCalendar,
  BsGear,
  BsChatDots,
  BsCalendarEvent,
  BsQuestionSquare,
} from "react-icons/bs";
import bg1 from "../../assets/bg1.png";

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ $isOpen }) => ($isOpen ? "250px" : "80px")};
  height: 100%;
  background-color: rgb(34, 36, 141);
  color: white;
  overflow-y: auto;
  padding-top: 60px;
  transition: width 0.3s ease;
  z-index: 100;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const SidebarNav = styled.ul`
  list-style: none;
  padding: 0;
`;

const SidebarNavItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 18px;
  border-bottom: 1px solid #34495e;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #34495e;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin-left: 10px;
`;

const SidebarIcon = styled.div`
  margin-right: 10px;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  /* Optional: Add a border for a framed effect */
  /* border: 2px solid white; */
`;

const ToggleButton = styled.div`
  position: absolute;
  top: 20px;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: #34495e;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToggleIcon = styled.span`
  color: white;
  font-size: 20px;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.3s ease;
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || bg1);

  useEffect(() => {
    const handleStorageChange = () => {
      const newImage = localStorage.getItem("profileImage") || bg1;
      setProfileImage(newImage);
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (profileImage && profileImage.startsWith("blob:")) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarHeader>
        <Logo
          src={profileImage}
          alt="Profile Logo"
          onError={(e) => {
            e.target.src = bg1;
          }}
        />
      </SidebarHeader>
      <SidebarHeader>Teacher</SidebarHeader>
      <SidebarNav>
        <SidebarNavItem>
          <SidebarIcon>
            <BsGraphUp />
          </SidebarIcon>
          <StyledLink to="/teacher/dashboard">Dashboard</StyledLink>
        </SidebarNavItem>
        <SidebarNavItem>
          <SidebarIcon>
            <BsPeople />
          </SidebarIcon>
          <StyledLink to="/teacher/students">Students</StyledLink>
        </SidebarNavItem>
        <SidebarNavItem>
          <SidebarIcon>
            <BsCalendar />
          </SidebarIcon>
          <StyledLink to="/teacher/attendance">Attendance</StyledLink>
        </SidebarNavItem>
        <SidebarNavItem>
          <SidebarIcon>
            <BsChatDots />
          </SidebarIcon>
          <StyledLink to="/teacher/communication">Announcement</StyledLink>
        </SidebarNavItem>
        <SidebarNavItem>
          <SidebarIcon>
            <BsGear />
          </SidebarIcon>
          <StyledLink to="/teacher/settings">Settings & Profile</StyledLink>
        </SidebarNavItem>
      </SidebarNav>
      <ToggleButton onClick={toggleSidebar}>
        <ToggleIcon $isOpen={isOpen}>▲</ToggleIcon>
      </ToggleButton>
    </SidebarContainer>
  );
};

export default Sidebar;
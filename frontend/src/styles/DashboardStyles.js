import styled from "styled-components";

export const AdminDashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

export const Content = styled.div`
  flex: 1;
  padding: 2rem;
  margin-left: ${({ $isOpen }) => ($isOpen ? "250px" : "80px")};
  transition: all 0.3s ease;
  overflow-x: hidden;
`;

export const TopContent = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const BottomContent = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Section = styled.section`
  flex: 1;
  min-width: 300px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
  font-weight: 600;
`;

export const CardContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

export const Card = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #4299e1;
  font-weight: 600;
`;

export const CardContent = styled.div`
  font-size: 1.75rem;
  color: #2d3748;
  font-weight: 700;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4299e1;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background-color: #3182ce;
    transform: translateY(-1px);
  }

  ${(props) =>
    props.secondary &&
    `
    background-color: #e2e8f0;
    color: #4a5568;
    
    &:hover {
      background-color: #cbd5e0;
      transform: translateY(-1px);
    }
  `}
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

export const FileInput = styled.input`
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 0.9rem;
`;

export const PDFViewer = styled.iframe`
  width: 100%;
  height: 500px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;
export const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;
// Additional styles for dashboard containers
export const StudentDashboardContainer = styled(AdminDashboardContainer)``;
export const TeacherDashboardContainer = styled(AdminDashboardContainer)``;
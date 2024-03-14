import { Nav, Container, Navbar, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  BUSINESSPAGE_ROUTE,
  MEETINGSPAGE_ROUTE,
  MEETINGSTATISTICPAGE_ROUTE,
  SIGNIN_ROUTE,
} from "../utils/const";
import MeetingStatisticsPage from "../pages/MeetingStatisticsPage";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">LOGO</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href={BUSINESSPAGE_ROUTE}>Business Page</Nav.Link>
          <Nav.Link href={MEETINGSPAGE_ROUTE}>Meetings Page</Nav.Link>
          <Nav.Link href={MEETINGSTATISTICPAGE_ROUTE}>Statistics Page</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Link href={SIGNIN_ROUTE}>Signin-Signup</Nav.Link>
          <Nav.Link
            href={SIGNIN_ROUTE}
            onClick={() => localStorage.removeItem("token")}
          >
            EXIT
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;

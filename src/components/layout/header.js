import React from 'react'
import { Button, Container, Table,  Navbar, Nav, NavbarBrand, Form} from 'react-bootstrap';

export const NavbarComponent = (props) => {
    return (
        <Navbar collapseOnSelect expand='sm' bg="dark" varian="dark">
            <Container fluid >
                <Navbar.Brand><img src="https://www.astronacci.com/images/website/logo-navbar.png"/></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll"> <i style={{color:'white'}} className="bi bi-three-dots-vertical"></i> </Navbar.Toggle>
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                    </Nav>
                    <Nav.Link style={{color:'white'}}><i className="bi bi-person"></i> {' '} {props.user}</Nav.Link>
                    <Nav.Link onClick={(e) => {props.logOut()}} style={{color:'white'}}><i className="bi bi-box-arrow-right"></i> {' '} Logout</Nav.Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
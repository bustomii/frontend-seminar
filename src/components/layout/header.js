import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Container,  Navbar, Nav, NavDropdown, Button} from 'react-bootstrap';
import axios from 'axios';
import swal from 'sweetalert';

export const NavbarComponent = (props) => {
    const [changePassword, setchangePassword] = useState('')
    const [modalChange, setmodalChange] = useState(false)
    const changePasswordFunc = () => {
        axios.post('/change-password', {password : changePassword}).then((res)=>{
            if(res.data.message){
                setmodalChange(false)
                swal({
                    title: "Change Password Success",
                    text: "Click the button to exit!",
                    icon: "success",
                });
            }else{
                swal({
                    title: "Change Password Failed",
                    text: "Click the button to exit!",
                    icon: "error",
                }); 
            }
        }).catch(err => {
            swal({
                title: "Change Password Failed",
                text: "Click the button to exit!",
                icon: "error",
            });
        })
    }

    return (
        <>
            <Navbar collapseOnSelect expand='sm' bg="dark" varian="dark">
                <Container fluid >
                    <Navbar.Brand><img src="https://www.astronacci.com/images/website/logo-navbar.png"/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll"> <i style={{color:'white'}} className="bi bi-three-dots-vertical"></i> </Navbar.Toggle>
                    <Navbar.Collapse style={{color:'white'}} id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                        </Nav>
                        <NavDropdown title={(<><i className="bi bi-person" style={{color:'white'}}></i><span style={{color:'white'}}>{' '}{props.user}</span></>)} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={()=>{setmodalChange(true)}}>Change Password</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link onClick={(e) => {props.logOut()}} style={{color:'white'}}><i className="bi bi-box-arrow-right"></i> {' '} Logout</Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Modal
            show={modalChange}
            onHide={(e) => {
                setmodalChange(false)
                setchangePassword('')
            }}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        CHANGE PASSWORD
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <input type="text" value={changePassword} onFocus={(e) => {
                            }} onChange={(e) =>{
                                setchangePassword(e.target.value)
                            }} className="form-control" placeholder="Enter your password"/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                        <label style={{color:''}}>{}</label>
                        <Button variant="primary" size="lg" onClick={()=> changePasswordFunc(changePassword)}>
                            SUBMIT
                        </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
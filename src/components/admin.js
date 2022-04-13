import react, { useState, useEffect } from 'react'
import { Button, Container, Table,  Navbar, Nav, NavbarBrand, Form} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import axios from 'axios'
import swal from 'sweetalert';
import { MDBDataTableV5 } from 'mdbreact';
import ReactExport from "react-export-excel-xlsx-fix";
import { useDispatch, useSelector } from 'react-redux'
import accessAction from '../actions/accessAction'
import { NavbarComponent } from './layout/header';
import { FooterComponent } from './layout/footer';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const AdminComponent = (props) => {
    const user = useSelector((value) => value.user)
    const dispatch = useDispatch()
    const [dataAll, setdataAll] = useState(props.data)
    const [modalAddUser, setmodalAddUser] = useState(false)
    const [username, setusername] = useState('')
    const [displayname, setdisplayname] = useState('')
    const [password, setpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')

    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: 'No',
                field: 'no',
                attributes: {
                    'aria-controls': 'DataTable',
                    'aria-label': 'No',
                },
            },
            {
                label: 'Username',
                field: 'username',
            },
            {
                label: 'Display Name',
                field: 'display_name',
            },
            {
                label: 'Reset Password',
                field: 'password',
            },
        ],
        rows: []
    })

    

    const pushDataTable = (array) => {
        const rows = []
        for(let i=0; i<array.length; i++){
            const add = new Object()
            add.no = i+1
            add.username = array[i].username
            add.display_name = array[i].display_name
            if(array[i].reset_password === 1){
                add.password = (<Badge style={{cursor:"pointer", width:80}} bg="warning">Request</Badge>)
            }else{
                add.password = (<Badge style={{width:80}} bg="success">No request</Badge>)
            }
            rows.push(add)
        }
        setDatatable({...datatable, rows:rows})
    }

    useEffect(() => {
        setdataAll(props.data)
        const recent = props.data
        pushDataTable(recent)
    }, [props.data])

    //export data to excel

    //delete all data
    const DeleteAll = () => {
        axios.post('/delete-all', { admin:true }).then((res) => {
            setdataAll(res.data.data)
            pushDataTable(res.data.data)
            swal({
                title: "Delete Success",
                text: "Click the button to exit!",
                icon: "success",
            });
        }).catch((err) => {
            console.log(err)
        })
    }

    const logOut = () => {
        setdataAll([])
        pushDataTable([])
        dispatch(accessAction(false))
        localStorage.setItem('access_token', null)
    }

    const AddUser = (username, pass, cpass, displayname) => {
        axios.post('/signup', {username, password:pass}).then((res) => {
            swal({
                title: "Add user success",
                text: "Click the button to exit!",
                icon: "success",
            });
            setmodalAddUser(false)
        }).catch((err)=>{
            setmodalAddUser(false)
            swal({
                title: "Failed",
                text: "Click the button to exit!",
                icon: "error",
            });
        })
    }

    return (
        <>
            <NavbarComponent logOut={logOut} user={user.display_name}/>
            <Container>
                <div style={{padding:10}}>
                <Button onClick={(e)=>{setmodalAddUser(true)}} style={{marginTop:5}} variant="primary"><i className="bi bi-plus"></i> Add User</Button>{' '}
                {dataAll.length > 0 ?(<Button style={{marginTop:5}} onClick={(e)=> {
                    swal({
                        title: "Are you sure?",
                        text: "You will not be able to recover this imaginary file!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            DeleteAll()
                        } else {
                            swal({
                                title: "Cancel Delete",
                                text: "Your imaginary file is safe!",
                                icon: "info",
                            });
                        }
                    });
                }} variant="danger"><i className="bi bi-trash"></i> Delete All Data</Button>):(<Button style={{marginTop:5}} onClick={(e)=> {swal({
                    title: "No Data to Delete",
                    text: "Click the button to exit!",
                    icon: "warning",
                })}} variant="danger"><i className="bi bi-trash"></i> Delete All Data</Button>)}
                </div>
            <MDBDataTableV5 striped responsive hover entriesOptions={[5, 10, 20, 25]} entries={10} pagesAmount={4} data={datatable} searchTop searchBottom={false} />
            </Container>
            <FooterComponent/>

            <Modal
            show={modalAddUser}
            onHide={() => setmodalAddUser(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        ADD NEW USER
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" onChange={(e) => {setusername(e.target.value)}} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Display Name</label>
                            <input type="text" onChange={(e) => {setdisplayname(e.target.value)}} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="text" onChange={(e) => {setpassword(e.target.value)}} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="text" onChange={(e) => {setconfirmpassword(e.target.value)}} className="form-control"/>
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <label style={{color:''}}>{}</label>
                    <Button variant="primary" size="lg" onClick={(e)=>{AddUser(username, password, confirmpassword, displayname)}}>
                        SAVE
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
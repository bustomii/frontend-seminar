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
import userAccess from '../actions/userAction';

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
    const [alertuser, setalertuser] = useState('')
    const [alertpassword, setalertpassword] = useState('')
    const [alertconfirm, setalertconfirm] = useState('')
    const [alertstatus, setalertstatus] = useState('')
    const [alertcolor, setalertcolor] = useState('')
    const [alertdisplayname, setalertdisplayname] = useState('')
    const [arrayID, setarrayID] = useState('')
    const [modalEdit, setmodalEdit] = useState(false)
    const [editusername, seteditusername] = useState('')
    const [editdisplayname, seteditdisplayname] = useState('')
    const [editID, seteditID] = useState()

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
            {
                label: 'Action',
                field: 'action',
            },
        ],
        rows: []
    })

    const resetPassword = (id) => {
        axios.post('/reset-password-approve', {id}).then((res) => {
            getData()
            swal({
                title: "Reset Password Success",
                text: "Click the button to exit!",
                icon: "success",
            });
        }).catch((err) => {
            console.log(err)
        })
    }

    const deleteUser = (id) => {
        axios.post('/delete-user', {id}).then((res) => {
            getData()
            swal({
                title: "Delete Success",
                text: "Click the button to exit!",
                icon: "success",
            });
        }).catch((err) => {
            console.log(err)
        })
    }

    const editUser = (id, username, displayname) => {
        setmodalEdit(true)
        seteditusername(username)
        seteditID(id)
        seteditdisplayname(displayname)
    }

    const pushDataTable = (array) => {
        const rows = []
        for(let i=0; i<array.length; i++){
            const add = new Object()
            add.no = i+1
            add.username = array[i].username
            add.display_name = array[i].display_name
            if(array[i].reset_password === 1){
                add.password = (<Badge style={{cursor:"pointer", width:80}} bg="warning" 
                onClick={(e)=> {
                    swal({
                        title: "Are you sure reset this account?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            resetPassword(array[i].id)
                        } else {
                            swal({
                                title: "Cancel Reset",
                                icon: "info",
                            });
                        }
                    });
                }}>Request</Badge>)
            }else{
                add.password = (<Badge style={{width:80}} bg="success">No request</Badge>)
            }
            if(array[i].id === 1){ 
                add.action = (<i className="bi bi-pencil-square" style={{color:'green', fontSize:20, cursor:'pointer'}} onClick={(e)=>{editUser(array[i].id, array[i].username, array[i].display_name )}}></i>)
            }else{
                add.action = (<><i className="bi bi-pencil-square" style={{color:'green', fontSize:20, cursor:'pointer'}} onClick={(e)=>{editUser(array[i].id, array[i].username, array[i].display_name )}}></i>{'   '} &nbsp; 
                <i className="bi bi-trash" style={{color:'red', fontSize:20, cursor:'pointer'}} onClick={(e)=>{deleteUser(array[i].id)}}></i></>)
                if(!arrayID.includes(array[i].id)){
                    setarrayID([...arrayID, array[i].id])
                }
            }
            rows.push(add)

        }
        setDatatable({...datatable, rows:rows})
    }

    useEffect(() => {
        setdataAll(props.data)
        const recent = props.data
        setarrayID([])
        pushDataTable(recent)
    }, [props.data])

    //export data to excel

    //delete all data
    const DeleteAll = () => {
        axios.post('/delete-all-user', {id:arrayID}).then((res) => {
            getData()
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
        setarrayID([])
        pushDataTable([])
        dispatch(accessAction(false))
        localStorage.setItem('access_token', null)
    }

    const AddUser = (username, pass, cpass, displayname) => {
        if(username === '' || username.length < 5){
            setalertuser('red')
        }
        if(pass === ''){
            setalertpassword('red')
        }
        if(cpass === ''){
            setalertconfirm('red')
        }
        if(displayname === ''){
            setalertdisplayname('red')
        }
        if(username !== '' && username.length >= 5 && pass !== '' && cpass !== '' && displayname !== ''){
            if(pass !== cpass){
                setalertconfirm('red')
                setalertdisplayname('red')
                setalertstatus('Password no match !')
                setalertcolor('red')
            }else{
                axios.post('/signup', {username, password:pass, display_name:displayname}).then((res) => {
                    swal({
                        title: "Add user success",
                        text: "Click the button to exit!",
                        icon: "success",
                    });
                    setmodalAddUser(false)
                    getData()
                }).catch((err)=>{
                    // setmodalAddUser(false)
                    swal({
                        title: "Failed",
                        text: "Click the button to exit!",
                        icon: "error",
                    });
                })
            }
        }
    }

    const EditUser = (username, pass, cpass, displayname) => {
        if(username === '' || username.length < 5){
            setalertuser('red')
        }
        if(pass === ''){
            setalertpassword('red')
        }
        if(cpass === ''){
            setalertconfirm('red')
        }
        if(displayname === ''){
            setalertdisplayname('red')
        }
        if(username !== '' && username.length >= 5 && pass !== '' && cpass !== '' && displayname !== ''){
            if(pass !== cpass){
                setalertconfirm('red')
                setalertdisplayname('red')
                setalertstatus('Password no match !')
                setalertcolor('red')
            }else{
                axios.post('/edit-user', {username, password:pass, display_name:displayname}).then((res) => {
                    swal({
                        title: "Add user success",
                        text: "Click the button to exit!",
                        icon: "success",
                    });
                    setmodalEdit(false)
                    getData()
                }).catch((err)=>{
                    // setmodalAddUser(false)
                    swal({
                        title: "Failed",
                        text: "Click the button to exit!",
                        icon: "error",
                    });
                })
            }
        }
    }

    const getData = () => {
        axios.get('/data-seminar').then((res) => {
            setdataAll(res.data.data)
            setarrayID([])
            pushDataTable(res.data.data)
        }).catch((err) => {
            // console.log(err)
        })
    }

    const refreshAlert = (color, status) => {
        setalertuser(color)
        setalertpassword(color)
        setalertconfirm(color)
        setalertdisplayname(color)
        setalertstatus(status)
        setalertcolor(color)
    }

    const cekUser = (value) => {
        if(value.length < 6){
            setalertuser('red')
        }else{
            axios.post('/username', {username:value}).then((res) => {
                if(res.data.message){
                    setalertuser('red')
                }else {
                    setalertuser('green')
                }
            })
        }
    }

    return (
        <>
            <NavbarComponent logOut={logOut} user={user.display_name}/>
            <Container>
                <div style={{padding:10}}>
                <Button onClick={(e)=>{
                    setmodalAddUser(true)
                    refreshAlert('','')
                }} style={{marginTop:5}} variant="primary"><i className="bi bi-plus"></i> Add User</Button>{' '}
                {arrayID.length > 0 ?(<Button style={{marginTop:5}} onClick={(e)=> {
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
                            <input type="text" style={{borderColor:alertuser}} onChange={(e) => {
                                setusername(e.target.value)
                                cekUser(e.target.value)
                            }} onFocus={(e) => {refreshAlert('','')}} className="form-control" placeholder='Username min 6 char' prefix='iya'/>
                        </div>
                        <div className="form-group" style={{marginTop:5}}>
                            <label>Display Name</label>
                            <input type="text" style={{borderColor:alertpassword}} onChange={(e) => {
                                setdisplayname(e.target.value)
                            }} onFocus={(e) => {refreshAlert('','')}} className="form-control" placeholder='Input display name'/>
                        </div>
                        <div className="form-group" style={{marginTop:5}}>
                            <label>Password</label>
                            <input type="password" style={{borderColor:alertconfirm}} onChange={(e) => {
                                setpassword(e.target.value)
                            }} onFocus={(e) => {refreshAlert('','')}} className="form-control" placeholder='Input password'/>
                        </div>
                        <div className="form-group" style={{marginTop:5}}>
                            <label>Confirm Password</label>
                            <input type="password" style={{borderColor:alertdisplayname}} onChange={(e) => {
                                setconfirmpassword(e.target.value)
                            }} onFocus={(e) => {refreshAlert('','')}} className="form-control" placeholder='Confirm your password'/>
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <label style={{color:alertcolor}}>{alertstatus}</label>
                    <Button variant="primary" size="lg" onClick={(e)=>{AddUser(username, password, confirmpassword, displayname)}}>
                        SAVE
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
            show={modalEdit}
            onHide={() => setmodalEdit(false)}
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
                            <input type="text" style={{borderColor:alertuser}} value={editusername} onChange={(e) => {
                                seteditusername(e.target.value)
                                cekUser(e.target.value)
                            }} onFocus={(e) => {refreshAlert('','')}} className="form-control" placeholder='Username min 6 char' prefix='iya'/>
                        </div>
                        <div className="form-group" style={{marginTop:5}}>
                            <label>Display Name</label>
                            <input type="text" style={{borderColor:alertpassword}} value={editdisplayname} onChange={(e) => {
                                seteditdisplayname(e.target.value)
                            }} onFocus={(e) => {refreshAlert('','')}} className="form-control" placeholder='Input display name'/>
                        </div>
                        <div className="form-group" style={{marginTop:5}}>
                            <label>New Password</label>
                            <input type="password" style={{borderColor:alertconfirm}} onChange={(e) => {
                                setpassword(e.target.value)
                            }} onFocus={(e) => {refreshAlert('','')}} className="form-control" placeholder='Input password'/>
                        </div>
                        <div className="form-group" style={{marginTop:5}}>
                            <label>Confirm New Password</label>
                            <input type="password" style={{borderColor:alertdisplayname}} onChange={(e) => {
                                setconfirmpassword(e.target.value)
                            }} onFocus={(e) => {refreshAlert('','')}} className="form-control" placeholder='Confirm your password'/>
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <label style={{color:alertcolor}}>{alertstatus}</label>
                    <Button variant="primary" size="lg" onClick={(e)=>{EditUser(editusername, password, confirmpassword, editdisplayname)}}>
                        SAVE
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
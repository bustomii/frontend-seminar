import Modal from 'react-bootstrap/Modal'
import  { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import accessAction from '../actions/accessAction'
import userAccess from '../actions/userAction'


export const ComponentLogin = (props) => {
    const access = useSelector((value) => value.access)
    const dispatch = useDispatch()

    const [show, setShow] = useState(true);
    const [username, setusername] = useState('')
    const [password, setpassword] = useState('')
    const [alertPassword, setalertPassword] = useState('')
    const [alertUsername, setalertUsername] = useState('')
    const [statusConfirm, setstatusConfirm] = useState('')
    const [colorStatus, setcolorStatus] = useState('')
    const [modalforget, setmodalforget] = useState(false)
    const [usernamereset, setusernamereset] = useState('')
    const [statusReset, setstatusReset] = useState('')
    
    useEffect(() => {
        if(access === false){
            setShow(true)
        }else{
            setShow(false)
        }
    }, [access])

    const Login = () => {
        if(username === '' && password === '' ) {
            setalertPassword('red')
            setalertUsername('red')
        }
        else if(username === ''){
            setalertUsername('red')
        }else if(password === ''){
            setalertPassword('red')
        }else{
            const postData = {
                username,
                password
            }
            axios.post(
                '/login', postData
            ).then((res) =>  {
                if(res.data.status === 200){
                    setalertUsername('green')
                    setalertPassword('green')
                    setstatusConfirm('Login Success !')
                    setcolorStatus('green')
                    localStorage.setItem('access_token', res.data.accessToken)
                    dispatch(accessAction(true))
                    dispatch(userAccess(res.data.username))

                }else if(res.data.status === 401 || res.data.status === 404){
                    setalertUsername('red')
                    setalertPassword('red')
                    setcolorStatus('red')
                    setstatusConfirm('Wrong username or password !')
                }
            }).catch((err) => {
                setcolorStatus('red')
                setstatusConfirm('Please try again !')
                setalertUsername('red')
                setalertPassword('red')
            })
        }  
    }

    const resetPassword = (username) => {
        axios.post('/reset-password', {username}).then((res) =>{
            if(res.data.message){
                setstatusReset('Request Success')
                setusernamereset('')
            }else{
                setstatusReset('Username tidak ditemukan')
            }
        })
    }
    
    
    return (<>
        <Modal
        show={show}
        onHide={(e) => {
            setalertUsername('red')
            setalertPassword('red')
            setcolorStatus('red')
            setstatusConfirm('Please signin !')
        }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header>
                <Modal.Title id="example-custom-modal-styling-title">
                    SIGN IN
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" onFocus={(e) => {
                            setalertUsername('')
                            setstatusConfirm('')
                            setalertPassword('')
                        }} onChange={(e) =>{
                            setusername(e.target.value)
                        }} className="form-control" placeholder="Enter username" style={{borderColor:alertUsername}} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password"  onFocus={(e) => {
                            setalertPassword('')
                            setstatusConfirm('')
                            setalertUsername('')
                        }} onChange={(e) =>{
                            setpassword(e.target.value)
                        }} className="form-control" placeholder="Enter password" style={{borderColor:alertPassword}} />
                    </div>
                    <div className="form-group" style={{marginTop:15, marginLeft:3, color:'rgb(18, 102, 241)', cursor:'pointer'}}>
                        <label onClick={(e) => {
                            setmodalforget(true)
                            setShow(false)
                        }} style={{cursor:'pointer'}}>Forget Password</label>
                    </div>
            </Modal.Body>
            <Modal.Footer>
                <label style={{color:colorStatus}}>{statusConfirm}</label>
                    <Button variant="primary" size="lg" onClick={Login}>
                        SIGN IN
                    </Button>
            </Modal.Footer>
        </Modal>
        <Modal
        show={modalforget}
        onHide={(e) => {
            setmodalforget(false)
            setShow(true)
            setstatusReset('')
            setusernamereset('')
        }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    FORGET PASSWORD
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="form-group">
                        <input type="text" value={usernamereset} onFocus={(e) => {
                            setstatusReset('')
                            setusernamereset('')
                        }} onChange={(e) =>{
                            setusernamereset(e.target.value)
                        }} className="form-control" placeholder="Enter username"/>
                    </div>
            </Modal.Body>
            <Modal.Footer>
                    <label style={{color:statusReset === 'Request Success'? 'green':'red'}}>{statusReset}</label>
                    <Button variant="primary" size="lg" onClick={()=> resetPassword(usernamereset)}>
                        SUBMIT
                    </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}
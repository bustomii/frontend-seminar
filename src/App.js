import logo from './logo.svg';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ComponentLogin } from './components/login';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { TableSeminar } from './components/tableSeminar.js';
import { connect } from "react-redux";
import { startAction } from "./actions/startAction";
import { stopAction } from "./actions/stopAction";
import { useSelector, useDispatch } from 'react-redux';
import accessAction from './actions/accessAction';
import userAccess from './actions/userAction';
import { AdminComponent } from './components/admin';


const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  startAction: () => dispatch(startAction),
  stopAction: () => dispatch(stopAction)
});

function App() {
  const access = useSelector((value) => value.access)
  const user = useSelector((value) => value.user)
  const dispatch = useDispatch()
  const [dataSeminar, setdataSeminar] = useState([])
  
  useEffect(() => { 
      axios.defaults.headers.common['Authorization'] =
      'Bearer ' + localStorage.getItem("access_token")
      axios.get('/data-seminar').then((res) => {
        setdataSeminar(res.data.data)
        dispatch(accessAction(true))
        dispatch(userAccess(res.data.user))
      }).catch((err) => {
        // console.log(err)
      })
  }, [access])

  return (
    <div className="App">
      {access?user === null? null: user.id === 1 ? (<AdminComponent data={dataSeminar}/>):(<TableSeminar data={dataSeminar}/>):(
      <ComponentLogin data={dataSeminar}/>)}
      
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ComponentLogin } from './components/login';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { TableSeminar } from './components/tableSeminar.js';
import { connect } from "react-redux";
import { startAction } from "./actions/startAction";
import { stopAction } from "./actions/stopAction";
import { useSelector, useDispatch } from 'react-redux';
import accessAction from './actions/accessAction';

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  startAction: () => dispatch(startAction),
  stopAction: () => dispatch(stopAction)
});

function App() {
  const access = useSelector((value) => value.access)
  const dispatch = useDispatch()
  const [dataSeminar, setdataSeminar] = useState([])
  
  useEffect(() => { 
    axios.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem("access_token")
    axios.get('/data-seminar').then((res)=>{
      setdataSeminar(res.data.data)
      dispatch(accessAction(true))
    }).catch((err) => {
      // console.log(err)
    })
  }, [access])

  return (
    <div className="App">
      {access?null:(
      <ComponentLogin data={dataSeminar}/>)}
      <TableSeminar data={dataSeminar}/>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

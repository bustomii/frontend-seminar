import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Table } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Container>
            <Table responsive striped bordered hover>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No Hp</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>Bustomi</td>
                    <td>tomblok.id@gmail.com</td>
                    <td>085769149310</td>
                    <td><Button variant="primary">Approve</Button>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No Hp</th>
                    <th>Status</th>
                </tr>
                </tfoot>
            </Table>
        </Container>
    </div>
  );
}

export default App;

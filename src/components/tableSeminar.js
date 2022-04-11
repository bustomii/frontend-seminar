import react, {useState} from 'react'
import { Button, Container, Table } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import axios from 'axios'

export const TableSeminar = (props) => {
    const [modalImport, setmodalImport] = useState(false)
    const [fileUpload, setfileUpload] = useState()      
    const [fileName, setFileName] = useState("");
    const [extention, setExtention] = useState("")

    const handleInputChange = (event) => {
        var re = /(?:\.([^.]+))?$/;
        let name = event.target.files[0].name
        setfileUpload(event.target.files[0])        
        setFileName(name);  
        setExtention(re.exec(name)[1]);
    }

    const submit = async (e) => {
        const formData = new FormData();
        formData.append("file", fileUpload);
        formData.append("fileName", fileName);
        formData.append("extention", extention);
        try {
            const res = await axios.post(
                "/import-data",
                formData
            );
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const data = props.data
    let viewTable = data.length > 0 ? data.map((value, index) => { 
    return (
        <tr>
            <td>{value.id}</td>
            <td>{value.nama}</td>
            <td>{value.email}</td>
            <td>{value.no_tlp}</td>
            <td>{value.status == 0 ?
            (<Badge key={index} style={{cursor:"pointer", width:80}} bg="warning" onClick={(e)=>{alert('approved')}}>Approve</Badge>):value.status == 1?
            (<Badge key={index} style={{width:80}} bg="success">Approved</Badge>):(<Badge key={index} style={{width:80}} bg="danger">Not attend</Badge>)}</td>
        </tr>
    )
    }):(
    <tr>
        <td colSpan="5">No data entries</td>
    </tr>
    )
    return (
        <Container>
            <div style={{padding:10}}>
            <Button onClick={(e)=> {setmodalImport(true)}} variant="primary"><i className="bi bi-upload"></i> Import Data</Button>{' '}
            <Button variant="secondary"><i className="bi bi-download"></i> Export Data</Button>{' '}
            </div>
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
                {viewTable}
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

        <Modal
        show={modalImport}
        onHide={() => setmodalImport(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header>
                <Modal.Title id="example-custom-modal-styling-title">
                    IMPORT DATA SEMINAR
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="form-group">
                        <label>File Excel</label>
                        <input type="file" onChange={handleInputChange} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="form-control"/>
                    </div>
                    <Modal.Footer>
                    <label style={{color:''}}>{}</label>
                        <Button variant="primary" size="lg" onClick={submit}>
                            SAVE
                        </Button>
                    </Modal.Footer>
            </Modal.Body>
        </Modal>
    </Container>
    )
}
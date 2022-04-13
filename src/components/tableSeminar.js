import react, { useState, useEffect } from 'react'
import { Button, Container, Table } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import axios from 'axios'
import swal from 'sweetalert';
import FileSaver from "file-saver";
import { MDBDataTableV5 } from 'mdbreact';
import ReactExport from "react-export-excel-xlsx-fix";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const TableSeminar = (props) => {
    const years = new Date().getFullYear()
    const [dataAll, setdataAll] = useState(props.data)
    const [modalImport, setmodalImport] = useState(false)
    const [fileUpload, setfileUpload] = useState()      
    const [fileName, setFileName] = useState("");
    const [extention, setExtention] = useState("")
    const [modalApprove, setmodalApprove] = useState(false)
    const [detailNama, setdetailNama] = useState('')
    const [detailEmail, setdetailEmail] = useState('')
    const [detailNoHp, setdetailNoHp] = useState('')
    const [detailID, setdetailID] = useState('')
    const [statusApprove, setstatusApprove] = useState(false)

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
                label: 'Nama',
                field: 'nama',
            },
            {
                label: 'Email',
                field: 'email',
            },
            {
                label: 'No Telepon',
                field: 'notelepon',
            },
            {
                label: 'Status',
                field: 'status',
            },
        ],
        rows: []
    })

    const pushDataTable = (array) => {
        const rows = []
        for(let i=0; i<array.length; i++){
            const add = new Object()
            add.no = i+1
            add.nama = array[i].nama
            add.email = array[i].email
            add.notelepon = array[i].no_tlp
            if(array[i].status === 0){
                add.status = (<Badge style={{cursor:"pointer", width:80}} bg="warning" onClick={(e)=>{detailPeserta(array[i].nama, array[i].email, array[i].no_tlp, array[i].id)}}>Approve</Badge>)
            }else if(array[i].status === 1){
                add.status = (<Badge style={{width:80}} bg="success">Approved</Badge>)
            }else{
                add.status = (<Badge style={{width:80}} bg="danger">Not attend</Badge>)
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
        axios.post('/delete-all').then((res) => {
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

    //aprove data
    const ApproveFunc = (id, type, nama, email) => {
        axios.post('/approve', {id, type}).then((res) => {
            const linkAutofill = `https://docs.google.com/forms/d/e/1FAIpQLSdGKnN3NgWEG_gVbesv3HfgzaAtreffATfquB5HSMX74319AA/viewform?usp=pp_url&entry.1900039790=${email}&entry.828018661=${nama}&entry.1322278785=${email}`
            const linkAutofillSubmit = `https://docs.google.com/forms/d/e/1FAIpQLSdGKnN3NgWEG_gVbesv3HfgzaAtreffATfquB5HSMX74319AA/formResponse?usp=pp_url&entry.1900039790=${email}&entry.828018661=${nama}&entry.1322278785=${email}&submit=Submit`
            setdataAll(res.data.data)
            pushDataTable(res.data.data)
            // setmodalApprove(false)
            if(type == 1){
                setstatusApprove(true)
                swal({
                    title: "Success",
                    text: "Click the button to go Google Form!",
                    icon: "success",
                }).then(function() {
                    // https://forms.gle/Qus8awWfarXo9DpZ6
                    window.open(linkAutofillSubmit, '_blank');
                });
                
            }else{
                swal({
                    title: "Not Attend",
                    text: "Click the button to exit!",
                    icon: "warning",
                });
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    //modal detail aprove
    const detailPeserta = (nama, email, nohp, id) => {
        setdetailID(id)
        setdetailNama(nama)
        setdetailEmail(email)
        setdetailNoHp(nohp)
        setmodalApprove(true)
    }

    //change value
    const handleInputChange = (event) => {
        var re = /(?:\.([^.]+))?$/;
        let name = event.target.files[0].name
        setfileUpload(event.target.files[0])        
        setFileName(name);  
        setExtention(re.exec(name)[1]);
    }

    //submit import data
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
            if(res.data.status === 400){
                swal({
                    title: "Error",
                    text: res.data.message,
                    icon: "error",
                });
            }else{
                pushDataTable(res.data.data)
                setdataAll(res.data.data)
                setmodalImport(false)
                swal({
                    title: "Success",
                    text: "Click the button to exit!",
                    icon: "success",
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    // table data
    // let viewTable = dataAll.length > 0 ? dataAll.map((value, index) => { 
    // return (
    //     <tr>
    //         <td>{index + 1}</td>
    //         <td>{value.nama}</td>
    //         <td>{value.email}</td>
    //         <td>{value.no_tlp}</td>
    //         <td>{value.status == 0 ?
    //         (<Badge key={index} style={{cursor:"pointer", width:80}} bg="warning" onClick={(e)=>{detailPeserta(value.nama, value.email, value.no_tlp, value.id)}}>Approve</Badge>):value.status == 1?
    //         (<Badge key={index} style={{width:80}} bg="success">Approved</Badge>):(<Badge key={index} style={{width:80}} bg="danger">Not attend</Badge>)}</td>
    //     </tr>
    // )
    // }):(
    // <tr>
    //     <td colSpan="5">No data entries</td>
    // </tr>
    // )

    return (
        <Container>
            <div style={{padding:10}}>
            <Button style={{marginTop:5}} onClick={(e)=> {setmodalImport(true)}} variant="primary"><i className="bi bi-upload"></i> Import Data</Button>{' '}
            {dataAll.length > 0 ?
            <ExcelFile filename={"Data Seminar "+ years} element={<Button style={{marginTop:5}} variant="secondary"><i className="bi bi-download"></i> Export Data</Button>}>
                <ExcelSheet data={dataAll} name={"Data Seminar "+ years} >
                    <ExcelColumn label="No" value="id"/>
                    <ExcelColumn label="Nama" value="nama"/>
                    <ExcelColumn label="Email" value="email"/>
                    <ExcelColumn label="No Hp" value="no_tlp"/>
                    <ExcelColumn label="Status" value={(col) => col.status === 1 ? "Hadir" : "Tidak Hadir"}/>
                </ExcelSheet>
            </ExcelFile>
            :(<Button style={{marginTop:5}} onClick={(e) => {
                swal({
                    title: "No Data to Export",
                    text: "Click the button to exit!",
                    icon: "warning",
                })}} variant="secondary"><i className="bi bi-download"></i> Export Data</Button>)}
            {' '}
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
                title: "No Data to Export",
                text: "Click the button to exit!",
                icon: "warning",
            })}} variant="danger"><i className="bi bi-trash"></i> Delete All Data</Button>)}
            </div>
        {/* <Table responsive striped bordered hover>
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
        </Table> */}
        <MDBDataTableV5 striped responsive hover entriesOptions={[5, 10, 20, 25]} entries={10} pagesAmount={4} data={datatable} searchTop searchBottom={false} />
        <Modal
        show={modalImport}
        onHide={() => setmodalImport(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    IMPORT DATA SEMINAR
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="form-group">
                        <label>File Excel</label>
                        <input type="file" onChange={handleInputChange} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="form-control"/>
                    </div>
            </Modal.Body>
            <Modal.Footer>
                <label style={{color:''}}>{}</label>
                <Button variant="primary" size="lg" onClick={submit}>
                    SAVE
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal
        show={modalApprove}
        onHide={() => {
            setmodalApprove(false)
            setTimeout(() => {
                setstatusApprove(false)
            }, 500);
        }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    DETAIL
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='text-center'>
                    <div className="form-group">
                        <label>Nama : </label>
                        <label>&nbsp; {detailNama}</label>
                    </div>
                    <div className="form-group">
                        <label>Email : </label>
                        <label>&nbsp; {detailEmail}</label>
                    </div>
                    <div className="form-group">
                        <label>No Hp : </label>
                        <label>&nbsp; {detailNoHp}</label>
                    </div>
                    {statusApprove ? (
                    <div className="form-group">
                        <Badge style={{width:80}} bg="success">Approved</Badge>
                    </div>
                    ):null}
                </div>
            </Modal.Body>
            {statusApprove? null:(
            <>
            <Modal.Footer>
                <Button variant="success" size="lg" onClick={(e) => {
                    ApproveFunc(detailID, 1, detailNama, detailEmail)}}>
                    Approve
                </Button>
                <Button variant="danger" size="lg" onClick={(e) => {
                    ApproveFunc(detailID, -1, detailNama, detailEmail)}}>
                    Not Attend
                </Button>
            </Modal.Footer>
            </>
            )}
        </Modal>
    </Container>
    )
}
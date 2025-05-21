// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, Input, Modal, ModalBody, ModalHeader, ModalFooter, Button, InputGroup, InputGroupText } from 'reactstrap';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import API_URL from '../../../config';
import { format } from 'date-fns';
import Backdrop from '@mui/material/Backdrop';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import CircularProgress from '@mui/material/CircularProgress'
import { imageOverlay } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import NodeComLogs from './nodeComLogs'
import { Search } from 'react-feather';
import BatteryCellRenderer from './batteryIndication';
const MySwal = withReactContent(Swal)


const Overview = ({ village_id, line_id }) => {
    let navigate = useNavigate();
    const gridRef = useRef();
    let [rowData, setRowData] = useState();
    const [isCheckedMotorValveStatus, setIsCheckedMotorValveStatus] = useState({});
    const [valves, setValves] = useState([]);
    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
    const [isChecked, setIsChecked] = useState('on');
    const [openCommunicationLogs, setOpenCommunicationLogs] = useState(false);
    const [filldata, setfilldata] = useState();
    const [allNodeIDs, setAllNodeIDs] = useState([]);
    const [node_Id_Array, setNode_Id_Array] = useState([]);
    const [triggerFetch, setTriggerFetch] = useState(false); // State to control fetch trigger

    // Handle switch change
    const handleChangeButton = () => {
        setIsChecked(prevState => {
            const newState = prevState === "off" ? "on" : "off";
            console.log(newState);
            return newState;
        });
    };



    const handleError = ({ message1, message2 }) => {
        return MySwal.fire({
            title: message2,
            text: message1,
            icon: 'error',
            html: message1.replace(/\n/g, '<br />'),
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            confirmButtonColor: 'danger',
            buttonsStyling: false
        })
    }



    const handleSuccess = (message) => {
        return MySwal.fire({
            icon: 'success',
            title: 'Successfull',
            text: 'Motor valve status changed.',
            customClass: {
                confirmButton: 'btn btn-success'
            }
        })
    }


    const handleValveSuccess = (message) => {
        return MySwal.fire({
            icon: 'success',
            title: 'Successfull',
            text: message,
            customClass: {
                confirmButton: 'btn btn-success'
            }
        })
    }
    const handleConfirmText = (previousState, newState, node_id) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: 'Valve status will change on confirm.',
            //   text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                
                changeMotorValveStatus(previousState, newState, node_id); // Call the changeMotorStatus function

            }
            else if (result.dismiss) {
                // navigate('')
                fetchLogs();

                // setTriggerFetch(true)

            }

            else if (result.dismiss === MySwal.DismissReason.cancel) {
                handleConfirmCancel();
            }
        })
    }




    const handleConfirmCancel = () => {
        return MySwal.fire({
            title: 'Cancelled',
            text: 'Motor valve status not changed. ',
            icon: 'error',
            customClass: {
                confirmButton: 'btn btn-success'
            }
        })
    }




    const fetchLogs = () => {
        fetchx(API_URL + "/getVillageTankinfo?village_id=" + village_id + '&line_id=' + line_id)
            // fetchx("http://172.104.244.42:14012/v9/getVillageTankinfo?village_id=" + village_id + '&line_id=' + line_id)
            .then((result) => result.json())
            .then((rowData) => {
                setRowData(rowData["data"]);
                // setIsCheckedMotorValveStatus(rowData.data.map(item => item.valve_status && item.valve_status.toLowerCase() === 'open'));
                const status = {};
                rowData.data.forEach(item => {
                    if (item.node_id) {
                        status[item.node_id] = item.valve_status && item.valve_status.toLowerCase() === 'open';

                    }
                });

                setIsCheckedMotorValveStatus(status)
                // console.log(initialStatus)
                // setIsCheckedMotorValveStatus(initialStatus);
                // setRowData(rowData);
                // console.log(rowData)
            });

    };



    useEffect(() => {
   
        fetchLogs();
        //   Every Min
        const intervalId = setInterval(fetchLogs, 30000);

        return () => clearInterval(intervalId);

    }, [triggerFetch]);




    function changeMotorValveStatus(previousState, newState, node_id, ip_address, village_id, line_id) {
        console.log("Called")
        // http://:172.104.244.42:14012/v9/startMotor?node_id=&ip_address=&session_id=0
        // On
        if (previousState === false && newState === true) {

            setOpen(true);
            // Start a timer to check if the response takes more than 5 seconds
            const timeout = setTimeout(() => {
                setShowSecondaryMessage(true);
            }, 5000);

            // let nodeIDs = [node_id]
            // console.log(nodeIDs)
            // const nodeIdsParam = nodeIDs.join(',');
            let nodeIDArraay = []
            nodeIDArraay.push(node_id)
console.log(nodeIDArraay)
            console.log('On')
            fetchx(API_URL + `/valveControl?node_id[]=${node_id}&valve_operation=${'open'}&status=${isChecked}`)
                // fetchx(API_URL + `/valveControl?node_id=${node_id}&valve_operation=${'open'}`)
                // http://172.104.244.42:14012/v9/valveControl?node_id=NSTN0002&valve_operation=open
                .then(result => result.json())
                .then(resp => {
                    console.log("resp")
                    console.log(resp)
                    if (resp.statusCode === 200) {
                        console.log(resp.data, typeof (resp.data))
                        // setConfirmRoomStatus(false)
                        // if (typeof (resp.data) === 'string') {
                        //     // handleError(resp.data)
                        //     handleError({ message1: resp.data, message2: "Please do not press the button as it is already running" });

                        //     setOpen(false);
                        //     navigate('')


                        // }
                        // else{

                        fetchLogs();
                        setOpen(false);
                        handleSuccess();
                        // navigate('')
                        // }
                    }
                    else {
                        setOpen(false);
                        // handleError("Error occured while turning on the motor!!");
                        handleError({
                            message1: "Unexpected status code",
                            message2: `"Error occured while turning on the valve!!"`
                        });
                        // navigate('')
                        fetchLogs();

                    }

                })
        }
        else if (previousState === true && newState === false) {
            // Off
            console.log('OFF')


            setOpen(true);
            // Start a timer to check if the response takes more than 5 seconds
            const timeout = setTimeout(() => {
                setShowSecondaryMessage(true);
            }, 5000);

let nodeIDs = [node_id]
console.log(nodeIDs)
const nodeIdsParam = nodeIDs.join(',');

            // fetchx(API_URL + `/stopMotor?node_id=${node_id}&ip_address=${ip_address}`)
            fetchx(API_URL + `/valveControl?node_id[]=${node_id}&valve_operation=${'close'}&status=${isChecked}`)
                // fetchx(API_URL + `/valveControl?node_id=${node_id}&valve_operation=${'close'}`)

                .then(result => result.json())
                .then(resp => {
                    console.log("resp")
                    console.log(resp)
                    if (resp.statusCode === 200) {
                        // navigate('')
                        fetchLogs();
                        handleSuccess();


                        setOpen(false);

                    }
                    else {
                        handleError({
                            message1: "Unexpected status code",
                            message2: "Error occured while turning off the valve!!"
                        });
                        // navigate('')
                        fetchLogs();



                        // handleError("Error occured while turning off the motor!!");

                    }


                })
        }

    }




    const handleChangeMotorValve = (node_id) => {
        console.log(node_id)
        const newStates = { ...isCheckedMotorValveStatus };
        newStates[node_id] = !newStates[node_id];
        let previousState = isCheckedMotorValveStatus[node_id]
        let newState = newStates[node_id]
        console.log(previousState, newState)
        setIsCheckedMotorValveStatus(newStates);
        handleConfirmText(previousState, newState, node_id)


    };


    const CustomHeaderComponent = (props) => {
        return (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center' }}>
                {props.displayName}
            </div>
        );
    };



    const handleAutoOpenMotorValve = () => {
        fetchx(API_URL + `/valveControl?node_id[]=${allNodeIDs}&valve_operation=${'open'}&status=${isChecked}`)
        // fetchx(API_URL + `/valveControl?node_id=${node_id}&valve_operation=${'close'}`)

        .then(result => result.json())
        .then(resp => {
            console.log("resp")
            console.log(resp)
            if (resp.statusCode === 200) {
                // navigate('')
                fetchLogs();

                handleValveSuccess("Valve status changed successfully");

                setOpen(false);

            }
            else {
                handleError({
                    message1: "Unexpected status code",
                    message2: "Error occured while turning off the motor!!"
                });
                // navigate('')
                fetchLogs();

            }


        })

    };


    const handleAutoCloseMotorValve = () => {
        fetchx(API_URL + `/valveControl?node_id[]=${allNodeIDs}&valve_operation=${'close'}&status=${isChecked}`)
        // fetchx(API_URL + `/valveControl?node_id=${node_id}&valve_operation=${'close'}`)

        .then(result => result.json())
        .then(resp => {
            console.log("resp")
            console.log(resp)
            if (resp.statusCode === 200) {
                // navigate('')
                fetchLogs();

                handleValveSuccess("Valve status changed successfully");

                setOpen(false);

            }
            else {
                handleError({
                    message1: "Unexpected status code",
                    message2: "Error occured while turning off the motor!!"
                });
                // navigate('')
                fetchLogs();

            }


        })

    };
    


    const handleConfirmTextAutoStartAllValveOpen = () => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: 'Auto open valve process will start confirm.',
            //   text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                // AutoStart(village_id, line_id,node_id); // Call the changeMotorStatus function
                handleAutoOpenMotorValve()
            }
            else if (result.dismiss) {
                // navigate('')
                fetchLogs();


            }

            else if (result.dismiss === MySwal.DismissReason.cancel) {
                // handleConfirmCancelAutoStart();
            }
        })
    }


    const handleConfirmTextAutoStartAllValveClose = () => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: 'Auto close valve process will start confirm.',
            //   text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                // AutoStart(village_id, line_id,node_id); // Call the changeMotorStatus function
                handleAutoCloseMotorValve()
            }
            else if (result.dismiss) {
                // navigate('')
                fetchLogs();


            }

            else if (result.dismiss === MySwal.DismissReason.cancel) {
                // handleConfirmCancelAutoStart();
            }
        })
    }






    // const [columnDefs, setColumnDefs] = useState([
    const columnDefs = useMemo(() => [


        // {
        //     // headerName: 'Asset ID', field: 'node_id', maxWidth: 110, sort: 'asc'
        //     // headerComponentFramework: CustomHeaderComponent, 
        //     checkboxSelection: true, headerCheckboxSelection: true, maxWidth: 30,

        // },
        {
            headerName: 'Date', field: 'datetime', maxWidth: 220,
            cellRenderer: params => {
                const formattedDate = format(new Date(params.value), "MMM d, yyyy HH:mm:ss");
                return formattedDate;
            },
            checkboxSelection: true, headerCheckboxSelection: true
            // ,headerComponentFramework: CustomHeaderComponent,
        },
        {
            headerName: 'Asset ID', field: 'node_id', maxWidth: 160, sort: 'asc',
            valueGetter: params => {
                const dataTime = new Date(params.data.datetime);
                const currentTime = new Date();

                // Calculate the difference in minutes
                const diffInMinutes = (currentTime - dataTime) / 1000 / 60;

                // If the difference is within the last 7 minutes, show the green dot
                if (diffInMinutes <= 15) {

                    return `${params.data.node_id} 🟢`;
                } else {
                    return `${params.data.node_id} 🔴`;
                }
            }

            // headerComponentFramework: CustomHeaderComponent, 
        },
        // { headerName: 'Asset Type', field: 'asset_type', maxWidth: 110, headerComponentFramework: CustomHeaderComponent, },
        // { headerName: 'Capacity', field: 'capacity', maxWidth: 108 },
        { headerName: 'Water Level', field: 'water_level', maxWidth: 120, headerComponentFramework: CustomHeaderComponent, },
        {
            headerName: 'Battery', field: 'battery_percentage', maxWidth: 86, headerComponentFramework: CustomHeaderComponent, cellRendererFramework: BatteryCellRenderer, cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
        },
        {
            headerName: 'Valve Status', field: 'valve_status', maxWidth: 120, cellStyle: { textAlign: 'center' }, cellClass: 'vertical-center',
            headerComponentFramework: CustomHeaderComponent,

            cellRenderer: params => {
                const { data } = params;
                const isChecked = isCheckedMotorValveStatus[data.node_id];
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                        <div className='form-switch form-check-success'>
                            {/* <Input
                                type='switch'
                                id={`switch-${data.node_id}`} // Assuming you have an identifier like 'id' in your rowData
                                name={`valve-status-${data.node_id}`}
                                checked={data.valve_status === 'open'}
                                onChange={() => handleChangeMotorValve(data.node_id, data.valve_status)}
                                className='switch-input'
                                style={{
                                    backgroundColor: data.valve_status === 'open' ? '#086a14' : '#fe0606',
                                }}
                            /> */}
                            {isCheckedMotorValveStatus && <Input type='switch'
                                id='switch-success'
                                name='success'
                                // checked={isChecked}
                                checked={isCheckedMotorValveStatus[data.node_id] === true}

                                onChange={() => handleChangeMotorValve(data.node_id)}
                                className='switch-input'
                                style={{
                                    backgroundColor: isCheckedMotorValveStatus[data.node_id] ? '#086a14' : '#fe0606', // Change color based on isChecked state

                                }} />}
                        </div>
                        <span style={{ marginLeft: '10px', marginTop: '-14px' }}>{data.valve_status}</span>
                    </div>

                );
            },

        },
        {
            // headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 110 }}
                    onClick={() => {
                        setfilldata(params.data)
                        setOpenCommunicationLogs(!openCommunicationLogs)
                    }}
                >
                    View Details
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 180
        },


    ]);


    // CSS for vertical centering
    const customStyles = `
  .vertical-center {
    display: flex;
    align-items: center;
    justify-content: left;
  }
  `;


    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = customStyles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);




    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        // autoHeight: true,
        // wrapText: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }));


    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById("filter-text-box3").value
        );
    }, []);



    //// OncheckBox Click
    const onSelectionChanged = (event) => {
        let allNodes = event.api.getSelectedRows()
        console.log(allNodes)
        console.log(allNodes.length)

        let NodeIDs = [];
        if (allNodes.length !== 0) {
            allNodes.forEach(node => {
                NodeIDs.push(node.node_id); // Assuming `node_id` is the property you're extracting
            });
            setAllNodeIDs(NodeIDs)
        }
        else {
            setAllNodeIDs([])
        }
    }



    console.log(allNodeIDs)



    const handleValveOpen = () => {
        console.log("Open Valve clicked");
        handleConfirmTextAutoStartAllValveOpen()
        // Add your logic here for opening the valve
    };

    const handleValveClose = () => {
        console.log("Close Valve clicked");
        handleConfirmTextAutoStartAllValveClose()
        // Add your logic here for closing the valve
    };


    

    return (
        <div className="p-0">

{/* , marginTop: '5px' */}
            <Card style={{ width: '820px', marginLeft: '-20px' }}>
                <CardBody>
                    <CardTitle style={{ color: '#ff0000', fontSize: '14px', marginBottom: '5px' }}>Input Control
                        <div className='form-switch form-check-success' style={{ display: 'flex', alignItems: 'center' }}>

                            <Input
                                type='switch'
                                id='switch-success'
                                name='success'
                                checked={isChecked === "on"}
                                onChange={handleChangeButton}
                                className='switch-input'
                                style={{
                                    backgroundColor: isChecked === "on" ? '#086a14' : '#fe0606', // Change color based on isChecked state
                                }}
                            />
                            <p style={{ marginLeft: '10px', marginTop: '14px', color: isChecked === "on" ? '#086a14' : '#0B3BEF' }}>
                                {isChecked === "on" ? "Fast Mode" : "Sleep Mode"}
                            </p>

                        </div>
                    </CardTitle>

                    {allNodeIDs.length !== 0 &&
                        // <div style={{ marginLeft: '460px', marginTop: '-40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-50px', marginRight: '80px' }}>

                            <Button
                                color={''}
                                style={{ width: 128, marginRight: '10px', zIndex: 1, color:'#fff',backgroundColor:'#6d00fe' }}
                                onClick={handleValveOpen}
                            >
                                Open Valve
                            </Button>
                            <Button
                                color={''}
                                style={{ width: 128, marginRight: '10px', zIndex: 1, color:'#fff',backgroundColor:'#fe0606' }}

                                onClick={handleValveClose}
                            >
                                Close Valve
                            </Button>
                        </div>
                    }



                    <div style={{ marginTop: '-40px', marginLeft: '724px', paddingBottom: '10px' }}>

                        <InputGroup className='input-group-merge' style={{ width: '160px' }}>
                            <Input placeholder='Search...' id="filter-text-box3" onInput={onFilterTextBoxChanged}
                            />

                            <InputGroupText>
                                <Search size={14} />
                            </InputGroupText>
                        </InputGroup>
                    </div>
                    <div className="ag-theme-alpine" style={{ height: 540, width: '114%', borderRadius: '8px solid black', overflow: 'hidden', border: '1px solid #c1c1c1' }}>

                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            animateRows={true}
                            onSelectionChanged={onSelectionChanged}
                            //   getRowStyle={getRowStyle}
                            rowSelection="multiple"
                            rowMultiSelectWithClick={true}

                            //   onCellClicked={cellClickedListener}
                            paginationAutoPageSize="true"
                            paginationPageSize="20"
                            pagination="true"
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                        //   onGridReady={onGridReady}
                        />
                    </div>

                    {/* </div>
                    </div> */}



                    {/* BackDrop For messages */}
                    {/* <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                Please wait night audit is in progress...
                            </h1>
                            {showSecondaryMessage && (
                                <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                    We're processing your request, which may take a little longer due to additional data. Please be patient!
                                </h1>
                            )}
                            <CircularProgress color="inherit" />
                        </div>
                    </Backdrop> */}
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                Please wait, the valve process is in progress...
                            </h1>
                            {showSecondaryMessage && (
                                <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                    We're processing the valve open and close operation, which may take a little longer due to additional steps. Please be patient!
                                </h1>
                            )}
                            <CircularProgress color="inherit" />
                        </div>
                    </Backdrop>



                    <div>
                        <Modal isOpen={openCommunicationLogs}
                            toggle={() => setOpenCommunicationLogs(!openCommunicationLogs)} className="modal-lg">
                            <ModalHeader className="modal-sm" toggle={() => setOpenCommunicationLogs(!openCommunicationLogs)} >Communication Logs</ModalHeader>
                            <ModalBody className="pb-3 px-sm-1 mx-20">
                                <div>
                                    <Card>
                                        <Col md="7" style={{ marginTop: '10px' }}>
                                            {filldata && <NodeComLogs filldata={filldata} />}
                                        </Col>
                                        {/* <Col md="12">
                                            {dataInsightItem && <SessionWiseData village_id={village_id} line_id={dataInsightItem.line_id} />}
                                        </Col> */}
                                    </Card>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>




                </CardBody>
            </Card>

        </div>
    );
};

export default Overview;

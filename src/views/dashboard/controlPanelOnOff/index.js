// // Overview.js
// import React from 'react';
// import { Card, CardBody, CardTitle, CardText, Row, Col, Button, CardHeader } from 'reactstrap';
// import { useLocation } from 'react-router-dom';
// import { Server, Search, ChevronUp, ChevronDown } from 'react-feather';
// import { useState, useEffect } from 'react';

// const Overview = () => {
//     const location = useLocation();
//     const { selectedTaluk, selectedDistrict, village_name,village_id } = location.state || {};
//     console.log(selectedTaluk, selectedDistrict, village_name,village_id)
//     const [openModify, setOpenModify] = useState(true);
//     const [mainDropDownData, setMainDropDownData] = useState(true);


//     useEffect(() => {

//         // fetchx(API_URL + '/getExtraDescription?hotelID=1')
//         fetchx('http://172.104.244.42:14012/v9/getVillagePumpinfo?village_id='+village_id)
//             .then(result => result.json())
//             .then(resp => {
//                 if (resp.statusCode === 200) {
//                     setMainDropDownData(resp['data'])
//                 }
//             })
//     }, []);
// console.log(mainDropDownData)

//     const toggle = () => {
//         setOpenModify(!openModify);
//     }

//     return (
//         <div>
//             <p style={{ color: '#344563', fontWeight: 'bold', fontSize: '20px' }}>{"Control Panel" + '>' + ((selectedDistrict && selectedTaluk) ?(selectedDistrict.label + '>' + selectedTaluk.label + '>' + village_name) : 'NA')}</p>
//             <Card>
//             <CardHeader>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <p style={{ color: '#001737', fontWeight: 'bold', fontSize: '16px', marginBottom: '2px' }}>All Line Details</p>
//                       <p style={{ color: '##5e6c84', fontSize: '14px', paddingTop: '2px' }}>Check all line details in this village</p>
//                       </div>
//                       <div style={{ display: 'flex', justifyContent: 'flex-end',marginTop:'-10px' }}>

//                           <Button color={''} style={{ background: '#fe0606', color: 'white' }}>AUTO START (OFF)</Button>
//                       </div>

//                   </CardHeader>
//                 <CardBody>
//                 <div style={{ fontWeight: 'bold', color: '#202020', paddingTop: '10px' }} onClick={() => toggle()}>{openModify ? <ChevronDown style={{ color: '#84818a', fontWeight: 'bold' }} /> : <ChevronUp style={{ color: '#84818a', fontWeight: 'bold' }} />}Modify/Update</div>



//                 </CardBody>
//             </Card>
//         </div>
//     );
// };

// export default Overview;



import React from 'react';
import { Card, CardBody, Button, CardHeader, Row, Col, Label, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'react-feather';
import { useState, useEffect } from 'react';
import Icon from '@src/views/dashboard/controlPanelOnOff/icons/Icon Stat.svg'
import FlowChartImage1 from '@src/views/dashboard/controlPanelOnOff/icons/Group 427319542.jpg'
import OutPutControlData from './outputControlData'
import { format, parseISO } from 'date-fns'
import AssetInfoSideCard from './assetInformationSideCard'
import BelowTwoCard from './overallConsumption'
import { useThemeProps } from '@mui/material';
import InstallationDetails from './installtionData'
import API_URL from '../../../config';
import { useNavigate } from "react-router-dom"
import Backdrop from '@mui/material/Backdrop';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import CircularProgress from '@mui/material/CircularProgress'
import DataInsights from '../villageDataInsights'
import Logs from './logs'
import DistrictWiseSupplyAndConsumption from './../villageDataInsights/districtWiseSupplyAndConsumption'
import SessionWiseData from './../villageDataInsights/sessionWiseData'

const MySwal = withReactContent(Swal)

const Overview = () => {
    const navigate = useNavigate()

    const location = useLocation();
    const { selectedTaluk, selectedDistrict, village_name, village_id } = location.state || {};
    const [openModify, setOpenModify] = useState(false);
    const [mainDropDownData, setMainDropDownData] = useState(true);
    const [isCheckedMotorStatus, setIsCheckedMotorStatus] = useState()
    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
    const [openLogs, setOpenLogs] = useState(false);
    const [openDataInsightsByVillageLineid, setOpenDataInsightsByVillageLineid] = useState(false);
    const [dataInsightItem, setDataInsightItem] = useState();

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
            text: message,
            customClass: {
                confirmButton: 'btn btn-success'
            }
        })
    }

    const handleConfirmText = (previousState, newState, node_id, ip_address, village_id, line_id) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: 'Motor status will change on confirm.',
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
                changeMotorStatus(previousState, newState, node_id, ip_address, village_id, line_id); // Call the changeMotorStatus function

            }
            else if (result.dismiss) {
                // navigate('')
                reCallVillagePumpInfo();

            }

            else if (result.dismiss === MySwal.DismissReason.cancel) {
                handleConfirmCancel();
            }
        })
    }

    const handleConfirmCancel = () => {
        return MySwal.fire({
            title: 'Cancelled',
            text: 'Motor status not changed. ',
            icon: 'error',
            customClass: {
                confirmButton: 'btn btn-success'
            }
        })
    }



    // For Auto Start
    const handleConfirmTextAutoStart = (village_id, line_id, node_id) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: 'Auto start process will start confirm.',
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
                AutoStart(village_id, line_id, node_id); // Call the changeMotorStatus function

            }
            else if (result.dismiss) {
                // navigate('')
                reCallVillagePumpInfo()

            }

            else if (result.dismiss === MySwal.DismissReason.cancel) {
                handleConfirmCancelAutoStart();
            }
        })
    }

    const handleConfirmCancelAutoStart = () => {
        return MySwal.fire({
            title: 'Cancelled',
            text: 'Motor status not changed. ',
            icon: 'error',
            customClass: {
                confirmButton: 'btn btn-success'
            }
        })
    }

    function changeMotorStatus(previousState, newState, node_id, ip_address, village_id, line_id) {
        console.log("Called")
        // http://:172.104.244.42:14012/v9/startMotor?node_id=&ip_address=&session_id=0
        // On
        if (previousState === false && newState === true) {

            setOpen(true);
            // Start a timer to check if the response takes more than 5 seconds
            const timeout = setTimeout(() => {
                setShowSecondaryMessage(true);
            }, 5000);


            console.log('On')
            fetchx(API_URL + `/startMotor?node_id=${node_id}&ip_address=${ip_address}&village_id=${village_id}&line_id=${line_id}`)

                .then(result => result.json())
                .then(resp => {
                    console.log("resp")
                    console.log(resp)
                    if (resp.statusCode === 200) {
                        console.log(resp.data, typeof (resp.data))
                        // setConfirmRoomStatus(false)
                        if (typeof (resp.data) === 'string') {
                            // handleError(resp.data)
                            handleError({ message1: resp.data, message2: "Please do not press the button as it is already running" });

                            setOpen(false);
                            // navigate('')
                            reCallVillagePumpInfo();



                        }
                        else {


                            setOpen(false);
                            handleSuccess();
                            // navigate('')
                            reCallVillagePumpInfo();

                        }
                    }
                    else {
                        setOpen(false);
                        // handleError("Error occured while turning on the motor!!");
                        handleError({
                            message1: "Unexpected status code",
                            message2: `"Error occured while turning on the motor!!"`
                        });
                        // navigate('')
                        reCallVillagePumpInfo();

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


            fetchx(API_URL + `/stopMotor?node_id=${node_id}&ip_address=${ip_address}`)

                .then(result => result.json())
                .then(resp => {
                    console.log("resp")
                    console.log(resp)
                    if (resp.statusCode === 200) {
                        navigate('')

                        setOpen(false);

                    }
                    else {
                        handleError({
                            message1: "Unexpected status code",
                            message2: "Error occured while turning off the motor!!"
                        });
                        navigate('')


                        // handleError("Error occured while turning off the motor!!");

                    }


                })
        }

    }



    useEffect(() => {
        // Save the state to localStorage
        if (selectedTaluk && selectedDistrict && village_name && village_id) {
            localStorage.setItem('selectedTaluk', JSON.stringify(selectedTaluk));
            localStorage.setItem('selectedDistrict', JSON.stringify(selectedDistrict));
            localStorage.setItem('village_name', village_name);
            localStorage.setItem('village_id', village_id);
        }
    }, [selectedTaluk, selectedDistrict, village_name, village_id]);

    useEffect(() => {
        // Retrieve the state from localStorage
        const savedTaluk = localStorage.getItem('selectedTaluk');
        const savedDistrict = localStorage.getItem('selectedDistrict');
        const savedVillageName = localStorage.getItem('village_name');
        const savedVillageId = localStorage.getItem('village_id');

        if (!selectedTaluk && savedTaluk) {
            location.state = {
                ...location.state,
                selectedTaluk: JSON.parse(savedTaluk),
                selectedDistrict: JSON.parse(savedDistrict),
                village_name: savedVillageName,
                village_id: savedVillageId
            };
        }

        if (savedVillageId) {
            fetchx(API_URL + '/getVillagePumpinfoweb?village_id=' + savedVillageId)

                // fetchx('http://172.104.244.42:14012/v9/getVillagePumpinfo?village_id=' + savedVillageId)
                .then(result => result.json())
                .then(resp => {
                    if (resp.statusCode === 200) {
                        setMainDropDownData(resp['data']);

                        setOpenModify(new Array(resp.data.length).fill(false));
                        // setIsCheckedMotorStatus(resp.data.map(item => item.motor_status && item.motor_status.toUpperCase() === 'ON'));
                        const status = {};
                        resp['data'].forEach(item => {
                            item.AllNodes.forEach(node => {
                                if (node.node_id) {
                                    status[node.node_id] = node.motor_status === 'ON';
                                }
                            });
                        });
                        setIsCheckedMotorStatus(status)
                        // Expand the first item by default
                        if (resp.data.length > 0) {
                            setOpenModify(prevStates => {
                                const newStates = [...prevStates];
                                // newStates[0] = true; // Expand the first item by default
                                return newStates;
                            });
                        }
                    }
                });
        }
    }, []);


    function reCallVillagePumpInfo() {

        // Retrieve the state from localStorage
        const savedTaluk = localStorage.getItem('selectedTaluk');
        const savedDistrict = localStorage.getItem('selectedDistrict');
        const savedVillageName = localStorage.getItem('village_name');
        const savedVillageId = localStorage.getItem('village_id');

        if (!selectedTaluk && savedTaluk) {
            location.state = {
                ...location.state,
                selectedTaluk: JSON.parse(savedTaluk),
                selectedDistrict: JSON.parse(savedDistrict),
                village_name: savedVillageName,
                village_id: savedVillageId
            };
        }


        if (savedVillageId) {
            fetchx(API_URL + '/getVillagePumpinfoweb?village_id=' + savedVillageId)

                // fetchx('http://172.104.244.42:14012/v9/getVillagePumpinfo?village_id=' + savedVillageId)
                .then(result => result.json())
                .then(resp => {
                    if (resp.statusCode === 200) {
                        setMainDropDownData(resp['data']);

                        setOpenModify(new Array(resp.data.length).fill(false));
                        // setIsCheckedMotorStatus(resp.data.map(item => item.motor_status && item.motor_status.toUpperCase() === 'ON'));
                        const status = {};
                        resp['data'].forEach(item => {
                            item.AllNodes.forEach(node => {
                                if (node.node_id) {
                                    status[node.node_id] = node.motor_status === 'ON';
                                }
                            });
                        });
                        setIsCheckedMotorStatus(status)
                        // Expand the first item by default
                        if (resp.data.length > 0) {
                            setOpenModify(prevStates => {
                                const newStates = [...prevStates];
                                // newStates[0] = true; // Expand the first item by default
                                return newStates;
                            });
                        }
                    }
                });
        }
    }
    // const toggle = () => {
    //     setOpenModify(!openModify);
    // };
    // const toggle = (index) => {
    //     setOpenModify(prevStates => {
    //         if (!prevStates) {
    //             // If prevStates is undefined (initial state), initialize it
    //             return new Array(mainDropDownData.length).fill(false);
    //         }
    //         console.log(prevStates)
    //         const newStates = [...prevStates]; // Create a copy of previous state array
    //         newStates[index] = !newStates[index]; // Toggle the state at the specified index
    //         console.log(newStates)
    //         return newStates; // Return the updated state array
    //     });
    // };


    const toggle = (index) => {
        setOpenModify(prevStates => {
            if (!prevStates) {
                // If prevStates is undefined (initial state), initialize it
                const initialStates = new Array(mainDropDownData.length).fill(false);
                initialStates[index] = true; // Set the current index to true (open)
                return initialStates;
            }

            // Create a copy of previous state array
            const newStates = [...prevStates];

            // Toggle the state at the specified index
            newStates[index] = !newStates[index];

            // If the current index is being toggled to open, close all others
            if (newStates[index]) {
                for (let i = 0; i < newStates.length; i++) {
                    if (i !== index) {
                        newStates[i] = false;
                    }
                }
            }

            return newStates; // Return the updated state array
        });
    };

    function formatedDate(date) {
        return format(parseISO(date), "MMM dd, yyyy hh:mm:ss a");
    }



    // const handleChangeMotor = (index) => {
    //     setIsCheckedMotorStatus(prevStates => {
    //         const newStates = [...prevStates];
    //         newStates[index] = !newStates[index];
    //     console.log(newStates)

    //         return newStates;
    //     });
    // };
    // const handleChangeMotor = (index, nodeIndex) => {
    //     console.log(index,nodeIndex)
    //     console.log(isCheckedMotorStatus[index])
    //     const currentStatus = isCheckedMotorStatus[index];

    //     console.log(`Current status at index ${index}: ${currentStatus}`);

    //     const newStates = [...isCheckedMotorStatus];
    //     console.log(newStates)
    //     newStates[index] = !newStates[index];
    //     setIsCheckedMotorStatus(newStates);
    //     console.log(newStates);
    //     console.log(`Updated status at index ${index}: ${newStates[index]}`);

    // };


    const handleChangeMotor = (node_id, ip_address, village_id, line_id) => {
        // const newStates = { ...isCheckedMotorStatus };
        const newStates = { ...isCheckedMotorStatus };
        console.log(isCheckedMotorStatus)
        // let filteredNodeStatus=isCheckedMotorStatus.filter((item) => item)
        newStates[node_id] = !newStates[node_id];
        setIsCheckedMotorStatus(newStates);

        let previousState = isCheckedMotorStatus[node_id]
        let newState = newStates[node_id]
        console.log(previousState, newState)
        handleConfirmText(previousState, newState, node_id, ip_address, village_id, line_id)
        console.log(`Updated status for node_id ${node_id}: ${newStates[node_id]}`);
    };

    const [showDataInsights, setShowDataInsights] = useState(false);

    const handleDataInsightsClick = () => {
        setShowDataInsights(true);
        renderDataInsights();
    };

    const renderDataInsights = () => {
        if (showDataInsights) {
            return (mainDropDownData && <DataInsights village_id={village_id} village_name={village_name} line_id={mainDropDownData.line_id} />);
        }
        return null;
    };


    if (showDataInsights) {
        return (
            <div>
                {renderDataInsights()}
            </div>
        );
    }


    function AutoStart(village_id, line_id, node_id) {

        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);

        console.log(village_id, line_id, node_id)
        fetchx(API_URL + `/starAutomation?village_id=${village_id}&line_id=${line_id}&pumpid=${node_id}`)
            .then(result => result.json())
            .then(resp => {
                console.log("resp")
                console.log(resp)
                if (resp.statusCode === 200) {
                    handleSuccess(resp.data)
                    // navigate('')
                    reCallVillagePumpInfo();
                    setOpen(false);
                }
                else {
                    handleError({
                        message1: "Unexpected status code",
                        message2: "Error occured while turning off the motor!!"
                    });
                    // navigate('')
                    reCallVillagePumpInfo();

                    // handleError("Error occured while turning off the motor!!");

                }


            })

    }

    function openDataInsightPage(item) {
        setDataInsightItem(item)
        setOpenDataInsightsByVillageLineid(true)
    }

    return (
        <div >
            <div className='me-1' style={{ display: 'flex', alignItems: 'center' }}>
                <Button className='me-1' size='sm' outline style={{ marginRight: '1rem', marginBottom: '10px' }} color='primary' onClick={() => navigate('/dashboard/controlPanel')}>
                    Back
                </Button>
            </div>
            <p style={{ color: '#344563', fontWeight: 'bold', fontSize: '20px' }}>
                {"Control Panel" + '>' + ((selectedDistrict && selectedTaluk) ? (selectedDistrict.label + '>' + selectedTaluk.label + '>' + village_name) : 'NA')}            </p>

            <Card >
                <CardHeader>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* <p style={{ color: '#001737', fontWeight: 'bold', fontSize: '16px', marginBottom: '2px' }}>All Line Control Panel</p> */}
                        {/* <p style={{ color: '##5e6c84', fontSize: '14px', paddingTop: '2px' }}>Check all line details in this village</p> */}
                        {/* <p style={{ fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', color: '#000000', marginTop: '10px' }}>
                            <img src={Icon} style={{ width: '40px', height: '40px', marginRight: '10px' }} alt="Icon" />
                            {village_name}
                        </p> */}
                        <p style={{ fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', color: '#000000', marginTop: '5px' }}>
                            <img src={Icon} style={{ width: '40px', height: '40px', marginRight: '10px' }} alt="Icon" />
                            {village_name}
                        </p>
                        <p style={{ color: '#6d00fe', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', marginTop: '10px' }}>All Line Control Panel</p>

                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-50px' }}>
                        <Button color={''} style={{ background: '#6d00fe', color: 'white', marginRight: '10px' }} onClick={() => handleDataInsightsClick()}>Data Insights</Button>
                        {/* <Button color={''} style={{ background: '#fe0606', color: 'white' }}>AUTO START (OFF)</Button> */}
                    </div>

                </CardHeader>

                <CardBody style={{ marginTop: '-20px' }}>
                    {mainDropDownData && mainDropDownData.length > 0 ? (
                        mainDropDownData.map((item, index) => (
                            <div>
                                <div key={index} style={{ fontWeight: 'bold', color: '#202020', paddingTop: '10px', cursor: 'pointer' }} onClick={() => toggle(index)}>
                                    <div style={{ fontSize: '16px' }} >
                                        {openModify[index] ? <ChevronDown style={{ color: 'white', fontWeight: 'bold', backgroundColor: '#ffbe00', borderRadius: '20%', padding: '2px', marginRight: '10px' }} /> : <ChevronUp style={{ color: 'white', fontWeight: 'bold', backgroundColor: '#ffbe00', borderRadius: '20%', padding: '2px', marginRight: '10px' }} />}
                                        {item.line_name}

                                    </div>








                                </div>


                                {/* {openModify[index] && ( */}
                                <Row>
                                    <Col md="8" style={{ marginTop: '20px' }}>
                                        <div style={{ border: '2px solid #dbdbdb', borderRadius: '8px', padding: '10px' }}>
                                            {item.AllNodes.map((node, nodeIndex) => (
                                                <div key={nodeIndex}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {/* {nodeIndex === 0 && (

                                                                <p style={{ fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', color: '#000000' }}>
                                                                    <img src={Icon} style={{ width: '40px', height: '40px', marginRight: '10px' }} alt="Icon" />
                                                                    {item.village_name}
                                                                </p>
                                                            )} */}
                                                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                                                            <p style={{ fontSize: '16px', marginBottom: '2px', color: '#3e3e3e', marginRight: '10px', fontWeight: 'bold' }}>
                                                                Motor Status ({node.motor_status && node.motor_status.toUpperCase() || 'NA'})
                                                            </p>
                                                            {node.motor_status !== null && (
                                                                <div className="form-switch form-check-success">
                                                                    {/* <Input
                                                                            type="switch"
                                                                            id={`switch-success-${index}-${nodeIndex}`}
                                                                            name="success"
                                                                            checked={isCheckedMotorStatus[index] === true}
                                                                            onChange={() => handleChangeMotor(index, nodeIndex)}
                                                                            className="switch-input"
                                                                            style={{
                                                                                backgroundColor: isCheckedMotorStatus[index] ? '#086a14' : '#fe0606'
                                                                            }}
                                                                        /> */}

                                                                    <Input
                                                                        type="switch"
                                                                        id={`switch-success-${node.node_id}`}
                                                                        name="success"
                                                                        checked={isCheckedMotorStatus[node.node_id] === true}
                                                                        onChange={() => handleChangeMotor(node.node_id, node.ip_address, item.village_id, item.line_id)}
                                                                        className="switch-input"
                                                                        style={{
                                                                            backgroundColor: isCheckedMotorStatus[node.node_id] ? '#086a14' : '#fe0606'
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', marginTop: '-24px' }}>
                                                        <p style={{ fontWeight: 'bold', fontSize: '20px', color: '#000000', margin: 0 }}>
                                                            {node.node_id}
                                                        </p>&nbsp;&nbsp;&nbsp;
                                                        <p style={{ marginLeft: '12px', fontSize: '14px', color: '#706d7d', margin: 0 }}>
                                                            ({node.ip_address})
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#a3a3a3' }}>Pump ID</p>
                                                        <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#a3a3a3', marginTop: '-8px' }}>
                                                            {node.datetime !== null ? 'Last Updated ' + formatedDate(node.datetime) : 'No Update'}
                                                        </p>
                                                        <p style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-38px' }}>
                                                            <Button color={''} style={{ color: '#03a19f', marginRight: '10px', border: '1px solid #03a19f' }} outline onClick={() => setOpenLogs(true)}>Logs</Button>

                                                            <Button color={''} style={{ background: '#6d00fe', color: 'white', marginRight: '10px' }} onClick={() => openDataInsightPage(item)}>Data Insights</Button>
                                                            <Button color={''} style={{ background: '#fe0606', color: 'white' }} onClick={() => handleConfirmTextAutoStart(item.village_id, item.line_id, node.node_id)}>AUTO MODE (OFF)</Button>

                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Col>
                                    {openModify[index] && (
                                        <>
                                            <Col md="4" style={{ marginTop: '20px', height: '200px' }}>
                                                <img src={FlowChartImage1} style={{ width: '100%', height: '100%', marginRight: '10px' }} alt="FlowChart" />
                                            </Col>
                                            {/* <Row> */}
                                            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

                                                <Col md="8" style={{ marginTop: '0px' }}>
                                                    {village_id && <OutPutControlData village_id={village_id} line_id={item.line_id} />}
                                                    {village_id && <InstallationDetails village_id={village_id} line_id={item.line_id} />}
                                                </Col>
                                                <Col md="4" style={{ marginTop: '0px' }}>
                                                    {village_id && <AssetInfoSideCard village_id={village_id} line_id={item.line_id} village_name={village_name} />}
                                                    {village_id && <BelowTwoCard village_id={village_id} line_id={item.line_id} village_name={village_name} />}
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                </Row>
                                {/* )} */}

                            </div>

                        ))
                    ) : (
                        <div style={{ fontWeight: 'bold', color: '#202020', paddingTop: '10px' }}>
                            No data available
                        </div>
                    )}

                    <div>
                        <Modal isOpen={openLogs}
                            toggle={() => setOpenLogs(!openLogs)} className="modal-lg">
                            <ModalHeader className="modal-lg" toggle={() => setOpenLogs(!openLogs)} ></ModalHeader>
                            <ModalBody className="pb-3 px-sm-1 mx-20">
                                <div>
                                    <Logs />
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>





                    <div>
                        <Modal isOpen={openDataInsightsByVillageLineid}
                            toggle={() => setOpenDataInsightsByVillageLineid(!openDataInsightsByVillageLineid)} className="modal-xl">
                            <ModalHeader className="modal-lg" toggle={() => setOpenDataInsightsByVillageLineid(!openDataInsightsByVillageLineid)} >Data Insights Based On Line</ModalHeader>
                            <ModalBody className="pb-3 px-sm-1 mx-20">
                                <div>
                                    <Card>
                                        {/* <Col md="7" style={{marginTop:'10px'}}>
                                            {dataInsightItem && <DistrictWiseSupplyAndConsumption village_id={village_id} line_id={dataInsightItem.line_id} />}
                                        </Col> */}
                                        <Col md="12" style={{ marginTop: '10px' }}>
                                            {dataInsightItem && <SessionWiseData village_id={village_id} line_id={dataInsightItem.line_id} />}
                                        </Col>
                                    </Card>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>


                    {/* BackDrop For messages */}
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                Please wait, the motor process is in progress...
                            </h1>
                            {showSecondaryMessage && (
                                <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                    We're processing the motor on and off operation, which may take a little longer due to additional steps. Please be patient!
                                </h1>
                            )}
                            <CircularProgress color="inherit" />
                        </div>
                    </Backdrop>




                </CardBody>
            </Card>
        </div>
    );
};

export default Overview;

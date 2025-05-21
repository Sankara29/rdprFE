
import React from 'react';
import { Card, CardBody, Button, CardHeader, Row, Col, Label, Input } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'react-feather';
import { useState, useEffect } from 'react';
import Icon from '@src/views/dashboard/controlPanelOnOff/icons/Icon Stat.svg'
import FlowChartImage1 from '@src/views/dashboard/controlPanelOnOff/icons/Group 427319542.jpg'
// import OutPutControlData from './outputControlData'
import { format, parseISO } from 'date-fns'
// import AssetInfoSideCard from './assetInformationSideCard'
// import BelowTwoCard from './overallConsumption'
// import { useThemeProps } from '@mui/material';
// import InstallationDetails from './installtionData'
import API_URL from '../../../config';
import { useNavigate } from "react-router-dom"
import Backdrop from '@mui/material/Backdrop';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import CircularProgress from '@mui/material/CircularProgress'
import DistrictWiseSupplyAndConsumption from './districtWiseSupplyAndConsumption'
import RightSideCard1 from './rightSideCard1'
import SessionWiseData from './sessionWiseData'

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
            text: 'Motor status changed.',
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
                navigate('')

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
                            navigate('')


                        }
                        else {


                            setOpen(false);
                            handleSuccess();
                            navigate('')
                        }
                    }
                    else {
                        setOpen(false);
                        // handleError("Error occured while turning on the motor!!");
                        handleError({
                            message1: "Unexpected status code",
                            message2: `"Error occured while turning on the motor!!"`
                        });
                        navigate('')
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
                                newStates[0] = true; // Expand the first item by default
                                return newStates;
                            });
                        }
                    }
                });
        }
    }, []);




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



    return (
        <div >
            {/* <p style={{ color: '#344563', fontWeight: 'bold', fontSize: '20px' }}>
                {"Control Panel" + '>' + ((selectedDistrict && selectedTaluk) ? (selectedDistrict.label + '>' + selectedTaluk.label + '>' + village_name) : 'NA')}            </p> */}
            <Card >
                <CardHeader>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <p style={{ color: '#001737', fontWeight: 'bold', fontSize: '16px', marginBottom: '2px' }}>All Line Details</p>
                        <p style={{ color: '##5e6c84', fontSize: '14px', paddingTop: '2px' }}>Check all line details in this village</p>
                    </div>

                </CardHeader>
                <CardBody style={{ marginTop: '-20px' }}>
                    {mainDropDownData && mainDropDownData.length > 0 ? (
                        mainDropDownData.map((item, index) => (
                            <div>
                                {/* <div key={index} style={{ fontWeight: 'bold', color: '#202020', paddingTop: '10px', cursor:'pointer' }} > */}
                                <div key={index} style={{ fontWeight: 'bold', color: '#202020', paddingTop: '10px', cursor:'pointer' }} onClick={() => toggle(index)}>

                                    <div style={{cursor:'pointer'}}>
                                        {openModify[index] ? <ChevronDown style={{ color: 'white', fontWeight: 'bold', backgroundColor: '#ffbe00', borderRadius: '20%', padding: '2px', marginRight: '10px' }} /> : <ChevronUp style={{ color: 'white', fontWeight: 'bold', backgroundColor: '#ffbe00', borderRadius: '20%', padding: '2px', marginRight: '10px' }} />}
                                        {item.line_name}
                                    </div>








                                </div>


                                {openModify[index] && (
                                    // <Row>
                                    //     <Col md="8" style={{ marginTop: '20px' }}>
                                    //         <div style={{ border: '2px solid #dbdbdb', borderRadius: '8px', padding: '10px' }}>
                                    //             {item.AllNodes.map((node, nodeIndex) => (


                                    <Row>
                                        {/* <div> */}
                                        {/* <Col md="7" >
                                            <DistrictWiseSupplyAndConsumption village_id={item.village_id} line_id={item.line_id} />
                                        </Col> */}




                                        <Col md="4" style={{ marginTop: '-36px' }}>
                                            {/* <RightSideCard1 /> */}
                                            {/* <RightSideCard2/> */}

                                        </Col>



                                        <Col md="12" >
                                            <SessionWiseData village_id={item.village_id} line_id={item.line_id} />
                                        </Col>


                                        {/* </div> */}
                                    </Row>
                                    //             ))}
                                    //         </div>
                                    //     </Col>


                                    // </Row>
                                )}

                            </div>

                        ))
                    ) : (
                        <div style={{ fontWeight: 'bold', color: '#202020', paddingTop: '10px' }}>
                            No data available
                        </div>
                    )}



                    {/* BackDrop For messages */}
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
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
                    </Backdrop>




                </CardBody>
            </Card>
        </div>
    );
};

export default Overview;

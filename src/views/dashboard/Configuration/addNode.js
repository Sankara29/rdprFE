

// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';

// ** Custom Components
import Avatar from "@components/avatar";


import API_URL from "../../../config";
// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
    Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, Modal, ModalBody, ModalHeader, InputGroupText, Row, Col,
    Accordion, AccordionBody, AccordionHeader, AccordionItem
} from "reactstrap";


// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { format } from 'date-fns';

const MySwal = withReactContent(Swal)

const defaultValues = {

};

// let API_URL = 'https://testpms.ms-tech.in/v15'

const AddVillage = () => {

    const [open, setOpen] = useState('1')
    const [getTaluk, setAllTaluk] = useState()
    const [getVillage, setAllVillage] = useState()
    const [filldata, setfilldata] = useState()



    const handleSuccess = (message) => {
        return MySwal.fire({
            title: 'Node Addition!!',
            text: message,
            icon: 'success',
        })
    }


    const handleSuccessDelete = (message) => {
        return MySwal.fire({
            title: 'Node Delition!!',
            text: message,
            icon: 'success',
        })
    }


    const handleError = (message) => {
        return MySwal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            confirmButtonColor: 'danger',
            buttonsStyling: false
        })
    }
    const [allLine, setAllLine] = useState();
    const [allNode, setAllNode] = useState();
    const [openDelete, setOpenDelete] = useState();
    


    const allAssetType = [
        { value: 'Pump', label: 'Starter Node' },
        { value: 'Mini Tank', label: 'Mini Tank' },
        { value: 'OHT', label: 'OHT' }
    ];

    const getLineDetails=async(village_id)=>{
        try {
            fetchx(API_URL + `/getLineDetails?village_id=${village_id}`)
            .then(result => result.json())
            .then(resp => {
                if (resp.statusCode === 200) {
                    console.log(resp)
                    if (resp.data.length > 0) {
                        const transformedTaluks = resp.data.map(district => ({
                            value: district.id,
                            label: district.line_name
                        }));
                        setAllLine(transformedTaluks);
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchx(API_URL + '/getAllVillage')
            .then(result => result.json())
            .then(resp => {
                if (resp.statusCode === 200) {
                    if (resp.data.length > 0) {
                        const transformedVillage = resp.data.map(key => ({
                            value: key.village_id,
                            label: key.village_name
                        }));
                        getLineDetails(transformedVillage?.[0]?.value)
                        setAllVillage(transformedVillage);
                    }

                }
            })


        fetchx(API_URL + '/getAllNode')
            .then(result => result.json())
            .then(resp => {
                if (resp.statusCode === 200) {
                    setAllNode(resp.data);

                }
            })


    }, []);

    const toggle = id => {
        // open === id ? setOpen() : setOpen(id)
        setOpen('1')
    }
    // AG Grid
    const gridRef = useRef();
    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ));

    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event);

        setfilldata(event.data)
    }, []);


    const columnDefs = useMemo(() => [

        { headerName: 'Asset Type', field: 'asset_type', maxWidth: 140 },
        { headerName: 'Node ID', field: 'node_id', maxWidth: 140 },
        { headerName: 'Line Name', field: 'line_name', maxWidth: 180 },
        { headerName: 'Village Name', field: 'village_name', maxWidth: 1840 },
        // { headerName: 'Water Level', field: 'water_level', maxWidth: 120 ,
        //     headerName: 'Battery', field: 'battery_percentage', maxWidth: 86 , cellStyle: { textAlign: 'center' },
        //     cellClass: 'vertical-center',
        // },

        {
            headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 100 }}
                >
                    Update
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 120
        },
        {
            headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 100 }}
                    onClick={() => setOpenDelete(true)}
                >
                    Delete
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 120
        },


    ]);

    const onCellValueChanged = useCallback(event => {


    }, [])
    // ** State
    const [data, setData] = useState(null);



    // ** Hooks
    const { reset, handleSubmit, control, watch, formState: { errors }
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        setData(data);
        console.log(data)

        const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        console.log(currentDateTime);
        // { village_id, line_id, node_id, asset_type, installation_datetime, lat_long, manufacturing_date, added_by, isActive, note, ip_address, node_type}
        let createasset = JSON.stringify({
            // "hotelID": data.hotelID,
            line_name: data.Line.label,
            line_id: data.Line.value,
            village_id: data.village.value,
            node_id: data.nodeID,
            asset_type: data.assetType.value,
            installation_datetime: currentDateTime,
            lat_long: null,
            manufacturing_date: currentDateTime,
            added_by: data.addedBy,
            isActive: true,  // No quotes around true
            note: null,
            ip_address: data.ipAddress,
            node_type: null
        });
        console.log(createasset);
        let res = fetchx(API_URL + "/addNode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        }).then((result) => result.json())
            .then((res) => {
                console.log(res);
                if (res.statusCode == 200) {
                    handleReset()
                    fetchx(API_URL + '/getAllNode')
                        .then(result => result.json())
                        .then(resp => {
                            if (resp.statusCode === 200) {
                                setAllNode(resp.data)

                            }
                        })
                    handleSuccess("Node added successfully!!")
                }
                else {
                    handleError(res.message)
                }
            });


    };



    const [gridApi, setGridApi] = useState(null);

    const onGridReady = (params) => {
        setGridApi(params.api);
    };
    const handleReset = () => {
        reset({
            village: null,
            Line: null,
            nodeID: '',
            assetType: '',
            ipAddress: '',
            addedBy: '',

        });
    };

    function ConfirmDelete(filldata){
console.log(filldata)

        let createasset = JSON.stringify({
            node_id: filldata.node_id,
           
        });
        console.log(createasset);
        let res = fetchx(API_URL + "/deleteNode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        }).then((result) => result.json())
            .then((res) => {
                console.log(res);
                if (res.statusCode == 200) {
                    setOpenDelete(false)
                    fetchx(API_URL + '/getAllNode')
                        .then(result => result.json())
                        .then(resp => {
                            if (resp.statusCode === 200) {
                                setAllNode(resp.data)

                            }
                        })
                        handleSuccessDelete("Node Deleted successfully!!")
                }
                else {
                    handleError(res.message)
                }
            });


    }


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">Add Node
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            {getVillage && <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='village'>
                                        Village
                                    </Label>
                                    <Controller
                                        id='village'
                                        control={control}
                                        name='village'
                                        render={({ field }) => (
                                            <Select
                                                required
                                                isClearable
                                                options={getVillage}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select', { 'is-invalid': data !== null && data.village === null })}
                                                // {...field}
                                                onChange={(select_village)=>{field.onChange(select_village),getLineDetails(select_village.value)}}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>}
                            {allLine && <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='Line'>
                                        Line
                                    </Label>
                                    <Controller
                                        id='Line'
                                        control={control}
                                        name='Line'
                                        render={({ field }) => (
                                            <Select
                                                required
                                                isClearable
                                                options={allLine}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select', { 'is-invalid': data !== null && data.Line === null })}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>}
                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="nodeID">
                                        Node ID
                                    </Label>
                                    <InputGroup className="input-group-merge">
                                        <Controller
                                            id="nodeID"
                                            name="nodeID"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    required
                                                    placeholder="Enter Node ID"
                                                    {...field}
                                                    className={classnames("form-control", {
                                                        "is-invalid":
                                                            data !== null && (data.nodeID === null || !data.nodeID.length)
                                                    })}
                                                    onBlur={async() => {
                                                        if (field.value) {
                                                            try {
                                                                const response = await fetch(`${API_URL}/getNodeDetails?node_id=${field.value}`);
                                                                const result = await response.json();
                            
                                                                if (result.statusCode === 200 && result.data) {
                                                                    // Update the ipAddress field with API response
                                                                    reset({
                                                                        ...watch(),
                                                                        ipAddress: result.data?.[0].ipaddr || ''  // Set the IP or empty string if null
                                                                    });
                                                                } else {
                                                                    console.error("Failed to fetch node details");
                                                                    toast.error("Failed to fetch node details");
                                                                }
                                                            } catch (error) {
                                                                console.error("Error fetching node details:", error);
                                                                toast.error("API call failed");
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='assetType'>
                                        Node Type
                                    </Label>
                                    <Controller
                                        id='assetType'
                                        control={control}
                                        name='assetType'
                                        render={({ field }) => (
                                            <Select
                                                required
                                                isClearable
                                                options={allAssetType}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select', { 'is-invalid': data !== null && data.assetType === null })}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="ipAddress">
                                        IP-Address
                                    </Label>
                                    <InputGroup className="input-group-merge">
                                        <Controller
                                            id="ipAddress"
                                            name="ipAddress"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    placeholder="Enter IP-Address"
                                                    {...field}
                                                    className={classnames("form-control", {
                                                        "is-invalid":
                                                            data !== null && (data.ipAddress === null || !data.ipAddress.length)
                                                    })}
                                                />
                                            )}
                                        />
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="addedBy">
                                        Added By
                                    </Label>
                                    <InputGroup className="input-group-merge">
                                        <Controller
                                            id="addedBy"
                                            name="addedBy"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    required
                                                    placeholder="Enter Name"
                                                    {...field}
                                                    className={classnames("form-control", {
                                                        "is-invalid":
                                                            data !== null && (data.addedBy === null || !data.addedBy.length)
                                                    })}
                                                />
                                            )}
                                        />
                                    </InputGroup>
                                </div>
                            </Col>
                            <div className="d-flex">
                                <Button className="me-1" color="primary" type="submit">
                                    Submit
                                </Button>
                                <Button
                                    outline
                                    color="secondary"
                                    type="reset"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>

                            </div>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={allNode} columnDefs={columnDefs}
                            animateRows={true} rowSelection='multiple'
                            onCellClicked={cellClickedListener}
                            // paginationAutoPageSize = 'true'
                            onCellValueChanged={onCellValueChanged}
                            paginationPageSize='10'
                            pagination='true'
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                            onGridReady={onGridReady}
                        />
                    </div>
                </CardBody></Card>
       

                <div className='disabled-animation-modal'>
        <Modal isOpen={openDelete} toggle={() => setOpenDelete(!openDelete)} className='modal-dialog-centered'>
          <ModalHeader className='bg-transparent' toggle={() => setOpenDelete(!openDelete)}></ModalHeader>
          <ModalBody className='px-5 pb-2'>
            <div className='text-center mb-2'>
              <h1 className='mb-1'>On confirm NodeID will be deleted</h1>
            </div>
            <Col>
              <div className="button-container text-center">
                <Button className="me-1" color="primary" type="submit" onClick={() => {if(filldata) {ConfirmDelete(filldata)}}} >
                  Confirm
                </Button>
                <Button className="me-1" color="danger" onClick={() => setOpenDelete(false)} >
                  Cancel
                </Button>
              </div>
            </Col>
          </ModalBody>

        </Modal>
      </div>

        </div >
    );
};

export default AddVillage;
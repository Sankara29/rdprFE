

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



    const handleSuccess = (message) => {
        return MySwal.fire({
            title: 'Line Addition!!',
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



    useEffect(() => {
    


        fetchx(API_URL + '/getLineDetails')
            .then(result => result.json())
            .then(resp => {
                if (resp.statusCode === 200) {
                  setAllLine(resp.data)                 

                }
            })


            fetchx(API_URL + '/getAllVillage')
            .then(result => result.json())
            .then(resp => {
                if (resp.statusCode === 200) {
                    if (resp.data.length > 0) {
                        const transformedVillage = resp.data.map(key => ({
                            value: key.village_id,
                            label: key.village_name
                        }));
                        setAllVillage(transformedVillage);
                    }                    

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

    }, []);


    const columnDefs = useMemo(() => [

        { headerName: 'Line ID', field: 'id', maxWidth: 120, sort: 'desc'  },
        { headerName: 'Line Name', field: 'line_name', maxWidth: 180  },
        { headerName: 'Village Name', field: 'village_name', maxWidth: 180  },
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
    const [popUp, setPopUp] = useState(false);



    // ** Hooks
    const { reset, handleSubmit, control, watch, formState: { errors }
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        setData(data);
        console.log(data)

        const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        console.log(currentDateTime);
        let createasset = JSON.stringify({
            // "hotelID": data.hotelID,

            "line_name": data.lineName,
            "village_id": data.village.value,
            "added_by": data.addedBy,
            "datetime": currentDateTime,
            "village_name": data.village.label,
            "isActive": "true",
            "population": data.Papulation
        });
        console.log(createasset);
        let res = fetchx(API_URL + "/addLineDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        }).then((result) => result.json())
            .then((res) => {
                console.log(res);
                if (res.statusCode == 200) {
                    handleReset()
                    fetchx(API_URL + '/getLineDetails')
                    .then(result => result.json())
                    .then(resp => {
                        if (resp.statusCode === 200) {
                          setAllLine(resp.data)                 
        
                        }
                    })
                    handleSuccess("Line added successfully!!")
                }
                else {
                    handleError("Error Occured!!")
                }
            });


    };



    const [gridApi, setGridApi] = useState(null);

    const onGridReady = (params) => {
        setGridApi(params.api);
    };








    const handleReset = () => {
        reset({
            lineName: '',
            village: null,
            addedBy: '',
            Papulation:''

        });
    };


    return (
        <div>
            {/* <Accordion open={open} toggle={toggle}>
                <AccordionItem>
                    <AccordionHeader targetId='1'><h4><b></b></h4></AccordionHeader>
                    <AccordionBody accordionId='1'> */}
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Add Line
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
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>}
                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className="mb-1">
                                                <Label className="form-label" for="lineName">
                                                    Line Name
                                                </Label>
                                                <InputGroup className="input-group-merge">
                                                    <Controller
                                                        id="lineName"
                                                        name="lineName"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                required
                                                                placeholder="Enter Village Name"
                                                                {...field}
                                                                className={classnames("form-control", {
                                                                    "is-invalid":
                                                                        data !== null && (data.lineName === null || !data.lineName.length)
                                                                })}
                                                            />
                                                        )}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </Col>

                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className="mb-1">
                                                <Label className="form-label" for="Papulation">
                                                    Papulation
                                                </Label>
                                                <InputGroup className="input-group-merge">
                                                    <Controller
                                                        id="Papulation"
                                                        name="Papulation"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                pattern="[0-9]*" title="Only Numbers Allowed" required
                                                                placeholder="Enter Papulation"
                                                                {...field}
                                                                className={classnames("form-control", {
                                                                    "is-invalid":
                                                                        data !== null && (data.Papulation === null || !data.Papulation.length)
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
                                                                placeholder="Enter Village Name"
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
                                        {/* <Col md='4' sm='12' className='mb-1'>
                                            <div className="mb-1">
                                                <Label className="form-label" for="Papulation">
                                                    Papulation
                                                </Label>
                                                <InputGroup className="input-group-merge">
                                                    <Controller
                                                        id="Papulation"
                                                        name="Papulation"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                pattern="[0-9]*" title="Only Numbers Allowed" required
                                                                placeholder="Enter Papulation"
                                                                {...field}
                                                                className={classnames("form-control", {
                                                                    "is-invalid":
                                                                        data !== null && (data.Papulation === null || !data.Papulation.length)
                                                                })}
                                                            />
                                                        )}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </Col> */}

                                        {/* <Col md='4' sm='12' className='mb-1'> */}
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
                                        {/* </Col> */}
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    {/* </AccordionBody>
                </AccordionItem>
            </Accordion> */}









            <Card>
                <CardBody>
                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={allLine} columnDefs={columnDefs}
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
            {popUp && (
                <div className="disabled-animation-modal">
                    <Modal
                        isOpen={popUp}
                        toggle={() => setPopUp(!popUp)}
                        className="modal-sm"
                    >
                        {" "}
                        {/*onClosed={onDiscard}*/}
                        <ModalHeader
                            className="modal-sm"
                            toggle={() => {
                                setPopUp(!popUp);
                            }}
                        >
                            Need To Check..
                        </ModalHeader>
                        <ModalBody className="pb-3 px-sm-2 mx-20">
                            <div>
                                <b>{popUp}</b>
                                <br></br>
                                <br></br>
                                <div className="d-flex">
                                    <Button
                                        color="primary"
                                        className="me-1"
                                        // className="text-center"
                                        onClick={() => Confirm()}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        color="danger"
                                        className="me-1"
                                        // className="text-center"
                                        onClick={() => { setPopUp(false) }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            )}




            {/* <App/> */}
        </div >
    );
};

export default AddVillage;
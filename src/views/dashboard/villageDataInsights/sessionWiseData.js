// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, Label, CardHeader, Input, InputGroup, InputGroupText, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import classnames from 'classnames'
import { Search } from 'react-feather';
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { FileText, Info, Book } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import DistrictWiseSupplyAndConsumption from './districtWiseSupplyAndConsumption'


import API_URL from '../../../config';


const listGroupStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: '24px',
    width: '50px', // Adjust width as needed
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '10px'

};
const listGroupItemStyle = {
    // Your base ListGroupItem style
    display: 'flex',
    justifyContent: 'center', // Centering text horizontally
    alignItems: 'center', // Centering text vertically
    borderRadius: 0, // Remove default border-radius
    cursor: 'pointer',
    borderTop: '1px solid rgb(192,204,218)', // Top border styling
    fontSize: '10px',
    fontWeight: 'bold'
};

const activeItemStyle = {
    backgroundColor: '#6d00fe',
    color: '#fff',
    fontWeight: 'bold',
};

const firstItemStyle = {
    borderTopLeftRadius: '0.25rem', // Adding back border-radius for the first item
};

const lastItemStyle = {
    borderBottomRightRadius: '0.25rem', // Adding back border-radius for the last item
};


const Overview = ({ village_id, line_id }) => {
    const navigate = useNavigate();

    const [district, setDistrict] = useState([])

    const [selectedDistrict, setSelectedDistrict] = useState()
    const [selectedTaluk, setSelectedTaluk] = useState()
    const gridRef = useRef();
    let [rowData, setRowData] = useState();
    const { reset, handleSubmit, control, watch, formState: { errors } } = useForm({})
    const [activeList, setActiveLIst] = useState('1')
    const [openTankWise, setOpenTankWise] = useState(false)
    const [filldata, setFilldata] = useState()

    const toggleList = list => {
        if (activeList !== list) {
            setActiveLIst(list)
        }
    }


    // let watchChange = watch(openTankWise)
    // console.log(watchChange)

    useEffect(() => {
        setFilldata()
    }, [openTankWise === false]);


    useEffect(() => {

        fetchx(API_URL + `/getLineSessionWisedata?village_id=${village_id}&line_id=${line_id}`)

            // fetchx("http://172.104.244.42:14012/v9/getAllVillage?taluk_id="+selectedTaluk.value)
            .then((result) => result.json())
            .then((rowData) => {
                if (rowData.statusCode === 200) {
                    setRowData(rowData["data"]);
                }
            });



    }, []);



    const CustomHeaderComponent = (props) => {
        return (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center' }}>
                {props.displayName}
            </div>
        );
    };


    function formatValue(value) {
        if (value === null || value === undefined || value === '') {
            return '0.00'; // or any placeholder you prefer
        }
        return parseFloat(value).toFixed(2);
    }

    const formatValueIntFinal = (initialReading, finalReading) => {
        const isValid = value => value !== null && value !== undefined && value !== '';

        if (!isValid(initialReading) || !isValid(finalReading)) {
            return '';
        }

        // return `${initialReading} / ${finalReading}`;
        const formattedInitialReading = parseFloat(initialReading).toFixed(2);
        const formattedFinalReading = parseFloat(finalReading).toFixed(2);

        return `${formattedInitialReading} / ${formattedFinalReading}`;
    };



    const MinutesRenderer = (props) => {
        const timeString = props.value;
  const [hours, minutes] = timeString ? timeString.split(':') : ['', ''];
  return <span>{`${hours}:${minutes}`}</span>;

      };
      


    // const [columnDefs, setColumnDefs] = useState([
    const columnDefs = useMemo(() => [


        { headerName: 'Date', field: 'date', maxWidth: 118 },
        { headerName: 'Session ID', field: 'session_id', maxWidth: 88,headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }, },
        { headerName: 'Start Time', field: 'start_time', maxWidth: 80,headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' },cellRendererFramework: MinutesRenderer, },
        { headerName: 'End Time', field: 'end_time', maxWidth: 80,headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' },cellRendererFramework: MinutesRenderer, },
        {
            headerName: 'Initial / Final Water Meter Reading (ltrs)', field: 'initial_wm_reading', maxWidth: 140, wrapText: true,
            headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }, filter: true,
            //  valueFormatter: params => formatValue(params.value)
            valueFormatter: params => formatValueIntFinal(params.data.initial_wm_reading, params.data.final_wm_reading)

        },
        // {
        //     headerName: 'Final Water Meter Reading', field: 'final_wm_reading', maxWidth: 110, wrapText: true,
        //     headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }, valueFormatter: params => formatValue(params.value)
        // },
        {
            headerName: 'Initial / Final Energy Meter Reading (kWh)', field: 'initial_em_reading', maxWidth: 140, wrapText: true,
            headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' },
            // valueFormatter: params => formatValue(params.value)
            valueFormatter: params => formatValueIntFinal(params.data.initial_em_reading, params.data.final_em_reading)

        },
        // {
        //     headerName: 'Final Eng Meter Reading', field: 'final_em_reading', maxWidth: 110, wrapText: true,
        //     headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }, valueFormatter: params => formatValue(params.value)
        // },
        { headerName: 'Total Time (min)', maxWidth: 100, headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' },
        valueFormatter: params => {
            const parseTime = timeStr => {
              const [hours, minutes, seconds] = timeStr.split(':').map(Number);
              return new Date(1970, 0, 1, hours, minutes, seconds);
            };
      
            const formatTime = totalSeconds => {
              const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
              const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
              const seconds = String(totalSeconds % 60).padStart(2, '0');
              return `${hours}:${minutes}:${seconds}`;
            };
      
            const startTime = parseTime(params.data.start_time);
            const endTime = parseTime(params.data.end_time);
      
            const diffInSeconds = Math.floor((endTime - startTime) / 1000); // Difference in milliseconds converted to seconds
            return formatTime(diffInSeconds); // Format to HH:mm:ss
          }
      
    },

        {
            headerName: 'Total Energy consumption (kwh)', field: 'total_energy_supply', maxWidth: 110, wrapText: true,
            headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }, valueFormatter: params => formatValue(params.value)
        },
        {
            headerName: 'Total Water Supply (ltrs)', field: 'total_water_supply', maxWidth: 120, wrapText: true,
            headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }, valueFormatter: params => formatValue(params.value)
        },
        {
            // headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 110 }}
                    onClick={() => {
                        setOpenTankWise(!openTankWise)
                    }}
                >
                    Tank Info
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 180
        },


    ]);

    console.log(selectedDistrict)
    console.log(selectedTaluk)

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        autoHeight: true,
        wrapText: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }));





    const onGridReady = (params) => {
        // Save the grid API reference
        gridRef.current = params.api;
    };


    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.setQuickFilter(
            document.getElementById("filter-text-box3").value
        );
    }, []);


    const cellClickedListener = useCallback((event) => {
        console.log(event)
        setFilldata(event.data)
    })


    function resetFilldata () {
        setFilldata()

    }


    return (
        <div>




            <Row>
                <Col md='9' sm='8'>
                    <Card style={{ width: '840px', height: '496px' }}>
                        <CardHeader>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ marginTop: '-20px' }}>

                                    <CardText style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px', whiteSpace: 'nowrap' }}>
                                        Session Wise  Supply                                                                         {/* <small >
                                        </small> */}
                                    </CardText>

                                    <CardText style={{ color: '#8392a5', fontWeight: 'bold', fontSize: '12px', marginTop: '-12px', whiteSpace: 'nowrap' }}>
                                        Measure How Fast You’re Growing Daily
                                    </CardText>



                                </div>



                                {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:'20px', marginRight:'10px' }}>
                                    <Button style={{
                                        height: '30px', width: '160px', fontSize: '12px', color: '#333333', marginRight: '10px',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'nowrap'
                                    }} outline>
                                        <Book style={{ height: '20px', marginRight: '5px',color:'#5a13ba' }} />
                                        All Taluk Data
                                    </Button>
                                    <Button style={{
                                        height: '30px', width: '160px', fontSize: '12px', color: '#333333',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'nowrap'
                                    }} outline>
                                        <Book style={{ height: '20px', marginRight: '2px',color:'#5a13ba' }} />
                                        All Village Data
                                    </Button>
                                </div> */}




                                <div style={{ marginTop: '-10px', marginLeft: '730px' }}>

                                    <InputGroup className='input-group-merge' style={{ width: '160px' }}>
                                        <Input placeholder='Search  Village...' id="filter-text-box3" onInput={onFilterTextBoxChanged}
                                        />

                                        <InputGroupText>
                                            <Search size={14} />
                                        </InputGroupText>
                                        {/* value={searchTerm} onChange={e => onChange(e)} */}
                                    </InputGroup>
                                    {/* <ListGroup style={listGroupStyle}>
                                        <ListGroupItem
                                            className={classnames('cursor-pointer', { active: activeList === '1' })}
                                            onClick={() => toggleList('1')}
                                            action
                                            style={{
                                                ...listGroupItemStyle,
                                                ...(activeList === '1' ? activeItemStyle : {}),
                                                ...firstItemStyle,
                                            }}
                                        >
                                            Date
                                        </ListGroupItem>
                                        <ListGroupItem
                                            className={classnames('cursor-pointer', { active: activeList === '2' })}
                                            onClick={() => toggleList('2')}
                                            action
                                            style={{
                                                ...listGroupItemStyle,
                                                ...(activeList === '2' ? activeItemStyle : {}),
                                            }}
                                        >
                                            Month
                                        </ListGroupItem>
                                        <ListGroupItem
                                            className={classnames('cursor-pointer', { active: activeList === '3' })}
                                            onClick={() => toggleList('3')}
                                            action
                                            style={{
                                                ...listGroupItemStyle,
                                                ...(activeList === '3' ? activeItemStyle : {}),
                                                ...lastItemStyle,
                                            }}
                                        >
                                            Year
                                        </ListGroupItem>
                                    </ListGroup> */}
                                </div>

                            </div>
                        </CardHeader>
                        <CardBody>







                            {/* , height: '990px' */}

                            <div className="ag-theme-alpine" style={{ height: 360, width: '1140px' }}>
                            {/* <div className="ag-theme-alpine" style={{ height: 360, width: '1260px' }}> */}
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    animateRows={true}
                                    //   getRowStyle={getRowStyle}
                                    rowSelection="multiple"
                                    onCellClicked={cellClickedListener}
                                    paginationAutoPageSize="true"
                                    paginationPageSize="10"
                                    pagination="true"
                                    defaultColDef={defaultColDef}
                                    headerColor="ddw-primary"
                                    onGridReady={onGridReady}
                                />
                            </div>


                        </CardBody>
                    </Card>
                </Col>


                <div>
                    <Modal isOpen={openTankWise}
                        toggle={() => setOpenTankWise(!openTankWise)} className="modal-lg">
                        <ModalHeader className="modal-sm" toggle={() => setOpenTankWise(!openTankWise)} >Data Insights Based On Line</ModalHeader>
                        <ModalBody className="pb-3 px-sm-1 mx-20">
                            <div>
                                <Card>
                                    <Col md="7" style={{ marginTop: '10px' }}>
                                        {filldata && <DistrictWiseSupplyAndConsumption filldata={filldata} />}
                                    </Col>
                                    {/* <Col md="12">
                                            {dataInsightItem && <SessionWiseData village_id={village_id} line_id={dataInsightItem.line_id} />}
                                        </Col> */}
                                </Card>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>




            </Row>

        </div>
    );
};

export default Overview;

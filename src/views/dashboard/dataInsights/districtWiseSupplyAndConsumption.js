// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, Label, CardHeader, Input, InputGroup, InputGroupText, Button, ListGroup, ListGroupItem } from 'reactstrap';
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


import API_URL from '../../../config';


const listGroupStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: '24px',
    width: '50px', // Adjust width as needed
    marginTop: '10px',
    marginBottom: '10px',
    // marginLeft: '106px'

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


const Overview = () => {
    const navigate = useNavigate();

    const [district, setDistrict] = useState([])

    const [selectedDistrict, setSelectedDistrict] = useState()
    const [selectedTaluk, setSelectedTaluk] = useState()
    const gridRef = useRef();
    let [rowData, setRowData] = useState();
    const { reset, handleSubmit, control, formState: { errors } } = useForm({})
    const [activeList, setActiveLIst] = useState('1')

    const toggleList = list => {
        if (activeList !== list) {
            setActiveLIst(list)
        }
    }



    useEffect(() => {

        fetchx(API_URL + "/getAllVillage?taluk_id=" + 1)

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





    // const [columnDefs, setColumnDefs] = useState([
    const columnDefs = useMemo(() => [


        { headerName: 'Village Name', field: 'village_name', maxWidth: 138 },
        {
            headerName: 'Overall Electricity Consumption (kWh)', field: 'total_energy_supply', maxWidth: 160, wrapText: true,
            headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }, filter: true, valueFormatter: params => formatValue(params.value)
        },
        {
            headerName: 'Overall Water Supplied(m³)', field: 'total_water_supply', maxWidth: 110, wrapText: true,
            headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }, valueFormatter: params => formatValue(params.value)
        },
        {
            headerName: 'Total Pumps', field: 'Total_pumps', maxWidth: 80, wrapText: true,
            headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }
        },
        {
            headerName: 'Total Tanks', field: 'Total_mini_tanks', maxWidth: 80, wrapText: true,
            headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }
        },
        {
            headerName: 'Total Valves', field: 'Total_ohts', maxWidth: 80, wrapText: true,
            headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }
        },
        {
            // headerName: 'More Info Button Column',
            cellRendererFramework: (params) => (
                <div className="button-cell">
                    {selectedDistrict && selectedTaluk && <Button
                        color="primary"
                        style={{
                            width: '100%',
                            height: '80%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} onClick={() => {
                            console.log('Selected District:', selectedDistrict);
                            console.log('Selected Taluk:', selectedTaluk);
                            if (selectedTaluk && selectedDistrict) {
                                console.log(selectedTaluk)

                                navigate('/dashboard/controlPanelOnOff', {
                                    state: {
                                        selectedTaluk: selectedTaluk, selectedDistrict: selectedDistrict, village_name: params.data.village_name, village_id: params.data.village_id
                                    }
                                });
                            }
                        }}
                    >
                        <Info style={{ marginRight: '8px' }} />
                        {/* <FileText style={{ marginRight: '8px' }} /> */}
                        More Info
                    </Button>}
                </div>
            ),
            suppressSizeToFit: true,
            // cellClass: 'vertical-center',
            maxWidth: 148,
            cellStyle: { textAlign: 'center', padding: 0 }
        }

    ]);

    console.log(selectedDistrict)
    console.log(selectedTaluk)

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        // wrapText: true,
        // autoHeaderHeight: true,
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



    return (
        <div>




            <Row>
                <Col md='9' sm='8'>
                    <Card style={{ width: '850px', height: '990px' }}>
                        <CardHeader>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{marginTop:'-50px'}}>

                                    <CardText style={{ color: '#284b75', fontWeight: 'bold', fontSize: '16px', whiteSpace: 'nowrap' }}>
                                        District Wise Supply and Consumption
                                        {/* <small >
                                        </small> */}
                                    </CardText>

                                    <CardText style={{ color: '#738ba9', fontWeight: 'bold', fontSize: '14px', marginTop: '-10px' }}>
                                        Per Day Supply and Consumption data

                                    </CardText>



                                </div>



                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:'20px', marginRight:'10px' }}>
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
                                </div>




                                <div style={{marginTop:'-10px'}}>

                                    <InputGroup className='input-group-merge' style={{ width: '160px' }}>
                                        <Input placeholder='Search  Village...' id="filter-text-box3" onInput={onFilterTextBoxChanged}
                                        />

                                        <InputGroupText>
                                            <Search size={14} />
                                        </InputGroupText>
                                        {/* value={searchTerm} onChange={e => onChange(e)} */}
                                    </InputGroup>
                                    <ListGroup style={listGroupStyle}>
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
                                    </ListGroup>
                                </div>

                            </div>
                        </CardHeader>
                        <CardBody>









                            <div className="ag-theme-alpine" style={{ height: '874px', width: '100%' }}>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    animateRows={true}
                                    //   getRowStyle={getRowStyle}
                                    rowSelection="multiple"
                                    //   onCellClicked={cellClickedListener}
                                    paginationAutoPageSize="true"
                                    paginationPageSize="11"
                                    pagination="false"
                                    defaultColDef={defaultColDef}
                                    headerColor="ddw-primary"
                                    onGridReady={onGridReady}
                                />
                            </div>


                        </CardBody>
                    </Card>
                </Col>




            </Row>

        </div>
    );
};

export default Overview;

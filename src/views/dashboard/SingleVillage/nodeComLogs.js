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


const Overview = ({filldata}) => {
    console.log(filldata)
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
console.log(filldata)
        fetchx(API_URL + `/getTanknodeHistory?node_id=${filldata.node_id}`)

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


        { headerName: 'Date', field: 'datetime', maxWidth: 180 },
        { headerName: 'Tank ID', field: 'node_id', maxWidth: 110 },
        { headerName: 'Battery Percentage', field: 'battery_percentage', maxWidth: 128, headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' }, },
        {
            headerName: 'Status', field: 'valve_status', maxWidth: 120, wrapText: true,
        },
        {
            headerName: 'Water Level', field: 'water_level', maxWidth: 110, wrapText: true,headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center' },
        }

    ]);

   

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
                    <Card style={{ width: '760px',height:'540px'}}>
                        <CardHeader>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{marginTop:'-20px'}}>

                                    <CardText style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px', whiteSpace: 'nowrap' }}>
                                    Tank Node History                                        {/* <small >
                                        </small> */}
                                    </CardText>

                                    <CardText style={{ color: '#8392a5', fontWeight: 'bold', fontSize: '12px', marginTop: '-12px' }}>
                                    {/* Measure How Fast You’re Growing Daily */}
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




                                <div style={{marginTop:'-10px', marginLeft: '310px'}}>

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

                            <div className="ag-theme-alpine" style={{ height: 520, width: '100%' }}>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    animateRows={true}
                                    //   getRowStyle={getRowStyle}
                                    rowSelection="multiple"
                                    //   onCellClicked={cellClickedListener}
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




            </Row>

        </div>
    );
};

export default Overview;

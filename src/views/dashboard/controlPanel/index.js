// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, Label, CardHeader, Input, InputGroup, InputGroupText, Button } from 'reactstrap';
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
import DayMonthYearWiseData from './rightSIdeDayMonthYearData'
import TalukWiseData from './talukDataPpl'
import { FileText, Info } from 'react-feather';
import { useNavigate } from 'react-router-dom';


import API_URL from '../../../config';

const Overview = () => {
    const navigate = useNavigate();

    const [district, setDistrict] = useState([])
    const [taluk, setTaluk] = useState([])
    const [reload, setReload] = useState(true)
    const [selectedDistrict, setSelectedDistrict] = useState()
    const [selectedTaluk, setSelectedTaluk] = useState()
    const gridRef = useRef();
    let [rowData, setRowData] = useState();
    const { reset, handleSubmit, control, formState: { errors } } = useForm({})

    useEffect(() => {

        fetchx(API_URL + '/getAllDistrict')
            // fetchx('http://172.104.244.42:14012/v9/getAllDistrict')
            .then(result => result.json())
            .then(resp => {
                if (resp.statusCode === 200) {
                    // setDistrict(resp['data'])
                    const transformedDistricts = resp.data.map(district => ({
                        value: district.district_id,
                        label: district.district_name
                    }));
                    console.log(transformedDistricts)
                    setDistrict(transformedDistricts);
                    const defaultOption = { value: transformedDistricts[2].value, label: transformedDistricts[2].label };

                    setSelectedDistrict(defaultOption);

                }

            })


    }, []);


    useEffect(() => {
        if (district.length > 0) {
            const defaultOption = { value: district[2].value, label: district[2].label };
            handleChangeDistrict(defaultOption);
            // setSelectedDistrict(defaultOption)
        }
    }, [district]);

    useEffect(() => {
        // fetchx(API_URL + "/getReservationForFrontDesk?hotelID=1")
        if (selectedTaluk !== undefined) {
            fetchx(API_URL + "/getAllVillage?taluk_id=" + selectedTaluk.value)

                // fetchx("http://172.104.244.42:14012/v9/getAllVillage?taluk_id="+selectedTaluk.value)
                .then((result) => result.json())
                .then((rowData) => {
                    if (rowData.statusCode === 200) {
                        setRowData(rowData["data"]);
                    }
                });
        }
        // else {
        //     fetchx(API_URL + "/getAllVillage")

        //         // fetchx("http://172.104.244.42:14012/v9/getAllVillage")
        //         .then((result) => result.json())
        //         .then((rowData) => {
        //             if (rowData.statusCode === 200) {
        //                 setRowData(rowData["data"]);
        //             }
        //         });
        // }

    }, [selectedTaluk]);



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



    const handleChangeDistrict = (selectedOption) => {
        console.log(selectedOption)
        // const selectedIds = selectedOption.map(option => option.value);
        setSelectedDistrict(selectedOption);
        setTaluk([])
//     sessionStorage.setItem('setDistrict', JSON.stringify(selectedOption));
// const storedDistrict = JSON.parse(sessionStorage.getItem('setDistrict'));
// const districtId = storedDistrict ? storedDistrict.value : selectedOption.value;
// fetchx(API_URL + '/getAllTaluk?district_id=' + districtId)

        fetchx(API_URL + '/getAllTaluk?district_id=' + selectedOption.value)

            // fetchx('http://172.104.244.42:14012/v9/getAllTaluk?district_id=' + selectedOption.value)
            .then(result => result.json())
            .then(resp => {
                if (resp.statusCode === 200) {
                    // setDistrict(resp['data'])
                    if (resp.data.length > 0) {
                        const transformedTaluks = resp.data.map(district => ({
                            value: district.taluk_id,
                            label: district.taluk_name
                        }));
                        setTaluk(transformedTaluks);
                        const defaultTalukOption = { value: transformedTaluks[0].value, label: transformedTaluks[0].label };
                        setSelectedTaluk(defaultTalukOption);

                        setReload(false)
                        setReload(true)
                    }
                    else {
                        setTaluk([])
                    }
                }

            })

    };
    const handleChangeTaluk = (selectedOption) => {
        console.log(selectedOption)
        // const selectedIds = selectedOption.map(option => option.value);
        setSelectedTaluk(selectedOption);
    }

    console.log(district.length > 0 && district[0].label)

    // const defaultReason =  {
    //     value: district,
    //     label: district,
    //   } 

    // console.log(defaultReason)

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
            <p style={{ color: '#344563', fontWeight: 'bold', fontSize: '26px' }}>Control Panel</p>
            <Row>

                {/* District Options */}
                {district.length > 0 && <Col md='3' sm='8'>
                    <div className='mb-1'>
                        <Label className='form-label' for='districtName' >
                            Select District
                        </Label>
                        <Controller
                            id='districtName'
                            control={control}
                            name='districtName'
                            render={({ field }) => (
                                <Select
                                    isClearable
                                    defaultValue={{ value: district[2].value, label: district[2].label }} // Example of single default reason
                                    options={district}
                                    classNamePrefix='select'
                                    theme={selectThemeColors}
                                    className={classnames('react-select')}
                                    {...field}
                                    onChange={handleChangeDistrict}

                                />
                            )}
                        />
                    </div>
                </Col>}

                {/* Taluk Options */}
                {reload && taluk.length > 0 && <Col md='3' sm='8'>
                    <div className='mb-1'>
                        <Label className='form-label' for='districtName' >
                            Select Taluk
                        </Label>
                        <Controller
                            id='districtName'
                            control={control}
                            name='districtName'
                            render={({ field }) => (
                                <Select
                                    isClearable
                                    // defaultValue={{ value: taluk[0].value, label: taluk[0].label }} // Example of single default reason
                                    defaultValue={selectedTaluk ? { value: selectedTaluk.value, label: selectedTaluk.label } : null}

                                    options={taluk}
                                    classNamePrefix='select'
                                    theme={selectThemeColors}
                                    className={classnames('react-select')}
                                    {...field}
                                    onChange={handleChangeTaluk}

                                />
                            )}
                        />
                    </div>
                </Col>
                }



               



            </Row>




            <Row>
                <Col md='9' sm='8'>
                    <Card style={{ width: '850px', height: '990px' }}>
                        <CardBody>


                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                                <CardText style={{ color: '#284b75', fontWeight: 'bold', fontSize: '16px' }}>
                                    All Villages Data in {selectedTaluk && selectedTaluk.label} Taluk
                                </CardText>

                                <InputGroup className='input-group-merge' style={{ width: '200px' }}>
                                    <Input placeholder='Search  Village...' id="filter-text-box3" onInput={onFilterTextBoxChanged}
                                    />

                                    <InputGroupText>
                                        <Search size={14} />
                                    </InputGroupText>
                                    {/* value={searchTerm} onChange={e => onChange(e)} */}
                                </InputGroup>

                            </div>

                            <CardText style={{ color: '#738ba9', fontWeight: 'bold', fontSize: '14px' }}>
                                Per Day Supply and Consumption data
                            </CardText>



                            {selectedDistrict && selectedTaluk && <div className="ag-theme-alpine" style={{ height: '874px', width: '100%' }}>
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
                            </div>}


                        </CardBody>
                    </Card>
                </Col>


                <Col md='3' sm='8'>
                    {selectedTaluk && <DayMonthYearWiseData selectedTaluk={selectedTaluk} />}
                    {selectedTaluk && <TalukWiseData selectedTaluk={selectedTaluk} />}

                    {/* <DayMonthYearWiseData/> */}
                </Col>

            </Row>

        </div>
    );
};

export default Overview;

import React, { useEffect, useRef, useMemo, useState } from 'react';
import API_URL from '../../../config';
import { Card, CardBody, CardTitle, CardText, Row, Col, Label, CardHeader, Input, InputGroup, InputGroupText, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import { Search } from 'react-feather';
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'

import { FileText, Info } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Loader from '../rdprDashboard/Loader';
const OverView = () => {
    const navigate = useNavigate()
    const [district, setDistrict] = useState([])
    const [taluk, setTaluk] = useState([])
    const [gp, setGP] = useState([])
    const gridRef = useRef();
    const [selectedDistrict, setSelectedDistrict] = useState()

    const [rowData, setRowData] = useState();
    const [selectedTaluk, setSelectedTaluk] = useState();
    const [selectedGP, setSelectedGP] = useState();
    const { reset, handleSubmit, control, formState: { errors } } = useForm({})
    const [reload, setReload] = useState(true)
    useEffect(() => {

        fetchx(API_URL + '/getAllDistrict')
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
        }
    }, [district]);

    useEffect(() => {
        if (selectedTaluk !== undefined) {
            fetchx(API_URL + "/getAllGP?taluk_id=" + selectedTaluk.value)
                .then((result) => result.json())
                .then((rowData) => {
                    if (rowData.statusCode === 200) {
                        const transformedGP = rowData.data.map(gp => ({
                            value: gp.gp_id,
                            label: gp.gp_name
                        }));
                        // setGP(transformedGP);
                        // const dataOne = transformedGP.find((data) => data.label == 'SHIVAGANGE')
                        // console.log(dataOne)
                        // setSelectedGP(dataOne);
                        // setReload(false)
                        // setReload(true)

                        transformedGP.unshift({ value: 'ALL', label: 'All GPs' });

                        setGP(transformedGP);

                        // Optional: Select "All GPs" by default
                        const defaultOption = transformedGP.find(data => data.value === 'ALL');
                        setSelectedGP(defaultOption);

                        setReload(false);
                        setReload(true);

                    }
                });
        }
    }, [selectedTaluk]);



    const handleChangeDistrict = (selectedOption) => {

        setSelectedDistrict(selectedOption);
        setTaluk([])


        fetchx(API_URL + '/getAllTaluk?district_id=' + 1)

            .then(result => result.json())
            .then(resp => {
                if (resp.statusCode === 200) {
                    if (resp.data.length > 0) {
                        const transformedTaluks = resp.data.map(district => ({
                            value: district.taluk_id,
                            label: district.taluk_name
                        }));
                        setTaluk(transformedTaluks);
                        const dataOne = transformedTaluks.find((data) => data.label == 'Nelamangala')
                        setSelectedTaluk(dataOne);

                        // setReload(false)
                        // setReload(true)
                    }
                    else {
                        setTaluk([])
                    }
                }

            })

    };
    const handleChangeTaluk = (selectedOption) => {
        console.log(selectedOption)
        setSelectedTaluk(selectedOption);
        setRowData(null)
    }
    const handleChangeGP = (selectedOption) => {
        setSelectedGP(selectedOption);
    }

    useEffect(() => {
        if (selectedGP) {
            console.log(selectedGP)
            if (selectedGP.label != 'All GPs') {
                fetchx(API_URL + `/getVillageCum?` + `gp=${selectedGP.label}`)
                    .then((result) => result.json())
                    .then((rowData) => {
                        if (rowData.statusCode === 200) {

                            setRowData(rowData.data)
                        }
                    });
            } else {
                fetchx(API_URL + `/getVillageCum`)
                    .then((result) => result.json())
                    .then((rowData) => {
                        if (rowData.statusCode === 200) {

                            setRowData(rowData.data)
                        }
                    });
            }
        }



    }, [selectedGP])


    const onGridReady = (params) => {
        // Save the grid API reference
        gridRef.current = params.api;
    };



    function formatValue(value) {
        if (value === null || value === undefined || value === '') {
            return '0.00'; // or any placeholder you prefer
        }
        const num = parseFloat(value).toFixed(2);
        return Number(num).toLocaleString('en-IN');
    }
    function formatValues(value) {
        if (value === null || value === undefined || value === '') {
            return '0.00'; // or any placeholder you prefer
        }
        const num = parseFloat(value / 1000).toFixed(2);
        return Number(num).toLocaleString('en-IN');
    }

    const columnDefs = useMemo(() => [


        { headerName: 'Village Name', field: 'village', minWidth: 100 },
        {
            headerName: 'RRNo Count', field: 'rr_no_count', maxWidth: 150,
        },
        {
            headerName: 'Population', field: 'population', minWidth: 60,
        },
        {
            headerName: 'Overall Energy Consumption (kWh)', field: 'total_cumwhimp', minWidth: 360, sort: 'desc',
            valueFormatter: params => formatValue(params.value)
        },
        {
            headerName: 'Overall Water Supplied(m³)', field: 'total_water', minWidth: 310,
            valueFormatter: params => formatValues(params.value)
        },




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

    const handleVillageNavigation = (data) => {
        const village = data?.village;
        const population = data?.population;

        if (village) {
            navigate('/dashboard/Singlevillage', {
                state: { village_name: village, population }
            });
        }
    };

    const handleCellRightClick = (event) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) return;

        event.event.preventDefault(); // prevent context menu
        handleVillageNavigation(event.data);
    };

    const handleCellClick = (event) => {
        handleVillageNavigation(event.data);
    };

    return (
        <div>
            <Row className='mt-1 mb-1'>
                {taluk.length > 0 && <Col md='3' sm='8'>
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
                {reload && gp.length > 0 && <Col md='3' sm='8'>
                    <div className='mb-1'>
                        <Label className='form-label' for='GP' >
                            Select GP
                        </Label>
                        <Controller
                            id='GP'
                            control={control}
                            name='GP'
                            render={({ field }) => (
                                <Select
                                    isClearable

                                    defaultValue={selectedGP ? { value: selectedGP.value, label: selectedGP.label } : null}

                                    options={gp}
                                    classNamePrefix='select'
                                    theme={selectThemeColors}
                                    className={classnames('react-select')}
                                    {...field}
                                    onChange={handleChangeGP}

                                />
                            )}
                        />
                    </div>
                </Col>

                }
                <Col md='3' sm='8'>
                    <div className='mb-1'>
                        <Label className='form-label'>Search</Label>
                        <Input
                            type='text'
                            placeholder='Search...'
                            onChange={(e) => {
                                if (gridRef.current) {
                                    gridRef.current.setQuickFilter(e.target.value);
                                }
                            }}
                        />
                    </div>
                </Col>

            </Row>
            <div className="ag-theme-alpine" style={{ height: '650px', width: '85%' }}>
                {rowData && rowData.length > 0 ? <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    animateRows
                    rowSelection="multiple"
                    paginationPageSize={12}
                    pagination
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    onCellContextMenu={handleCellRightClick}
                    onCellClicked={handleCellClick}
                />
                    : <div className="ag-theme-alpine" style={{ height: '14px', width: '100%' }}>
                        <Loader />
                    </div>}
            </div>
        </div>
    )
}

export default OverView;
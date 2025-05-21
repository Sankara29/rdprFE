import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardBody, CardTitle, Row, Col, Label, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import 'ag-grid-enterprise'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'


import LineChartComponent from "../../charts/dlchart";
const OverView = () => {

    return (
        <>    <>

            <Breadcrumb>
                <BreadcrumbItem>
                    <a href="/dashboard/BillingReport">
                        Billing
                    </a>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <a href="/dashboard/DlReport">
                        Report
                    </a>
                </BreadcrumbItem>


            </Breadcrumb>
        </>
            <div>
                <LineChartComponent />
            </div>



        </>)
}

export default OverView;


import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { useState, useRef, useEffect } from 'react';
import { Row, Col, Breadcrumb, BreadcrumbItem, Input } from 'reactstrap';
import API_URL from '../../../config';
import { useNavigate } from 'react-router-dom';
import Loader from '../rdprDashboard/Loader';

const OverView = () => {
  const gridRef = useRef();
  const navigate = useNavigate()
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  const fullColumnDefsRef = useRef([]);

  useEffect(() => {
    const fetchBillingReport = async () => {
      try {
        const res = await fetch(`${API_URL}/getBillingReport`);
        const data = await res.json();

        if (data.statusCode !== 200) {
          console.error('API Error:', data.message || 'Unexpected error');
          return;
        }

        const formattedData = {};
        const monthCounts = {};
        const monthKeys = new Set();

        data.data.forEach(({ gwid, month_start, monthly_kWh, mdwimp, PF }) => {
          if (gwid === 'NSRT000001') return;

          const dateObj = new Date(month_start);
          const label = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });

          // if (label === 'Feb 2025') return;

          if (!formattedData[gwid]) formattedData[gwid] = { gwid };

          const kWh = (parseFloat(monthly_kWh) / 1000).toFixed(2);
          const pf = parseFloat(PF).toFixed(2);

          formattedData[gwid][`${label}_kWh`] = kWh;
          formattedData[gwid][`${label}_PF`] = pf;

          if (parseFloat(kWh) > 0) {
            monthCounts[label] = (monthCounts[label] || 0) + 1;
          }

          monthKeys.add(label);
        });

        const sortedMonths = Array.from(monthKeys).sort((a, b) => new Date(b) - new Date(a));
        setAvailableMonths(sortedMonths);

        const staticCol = [
          {
            headerName: 'Node ID',
            field: 'gwid',
            pinned: 'left',
            filter: 'agTextColumnFilter',
            sortable: true,
          },
        ];

        const dynamicCols = sortedMonths.map((month) => {
          const count = monthCounts[month] || 0;
          return {
            headerName: `${month} (${count})`,
            children: [
              {
                headerName: 'Units (kWh)',
                field: `${month}_kWh`,
                filter: 'agNumberColumnFilter',
                sortable: true,
                valueGetter: ({ data }) => {
                  const val = data?.[`${month}_kWh`];
                  return val !== undefined && val !== null ? Number(val) : null;
                },
                valueFormatter: ({ value }) =>
                  value !== null ? new Intl.NumberFormat('en-US').format(value.toFixed(2)) : '-',
              },
              {
                headerName: 'PF',
                field: `${month}_PF`,
                filter: 'agNumberColumnFilter',
                sortable: true,
                valueGetter: ({ data }) => {
                  const val = data?.[`${month}_PF`];
                  return val !== undefined && val !== null ? Number(val) : null;
                },
                valueFormatter: ({ value }) =>
                  value !== null ? value.toFixed(2) : '-',
              },
            ],
          };
        });

        const allColumns = [...staticCol, ...dynamicCols];
        fullColumnDefsRef.current = allColumns;
        setColumnDefs(allColumns);
        setRowData(Object.values(formattedData));
      } catch (err) {
        console.error('Failed to fetch billing data:', err);
      }
    };

    fetchBillingReport();
    const intervalId = setInterval(fetchBillingReport, 5 * 60 * 1000); // Every 5 mins

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (!selectedMonth) {
      setColumnDefs(fullColumnDefsRef.current);
    } else {
      const allDefs = fullColumnDefsRef.current;
      const filteredDefs = allDefs.filter((col) => {
        return (
          col.field === 'gwid' || // Always include Node ID
          col.headerName.startsWith(selectedMonth) // Only the selected month group
        );
      });
      setColumnDefs(filteredDefs);
    }
  }, [selectedMonth]);
  const lastRightClickRef = useRef(0)
  const handleCellRightClick = (event) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return;

    event.event.preventDefault(); // Prevent browser context menu

    const nodeId = event.data?.gwid;
    const delta = now - lastRightClickRef.current
    lastRightClickRef.current = now
    if (delta < 400) {
      if (nodeId) {
        navigate('/dashboard/DlReport', {
          state: { node_id: nodeId }
        });
      }
    }
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <a href="/dashboard/rdprDashboard">Dashboard</a>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          <a href="/dashboard/report">Monthly Billing</a>
        </BreadcrumbItem>
      </Breadcrumb>

      <h1>Monthly Billing Report</h1>

      <Row className="mb-3">
        <Col md="4">
          <h5>Total Unique GWIDs: {rowData.length}</h5>
        </Col>
        <Col md="4">
          <Input
            type="select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Input>
        </Col>
        <Col md="4">
          <Input
            type="text"
            placeholder="Search Node ID..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
          />
        </Col>
      </Row>

      <div className="ag-theme-alpine" style={{ height: 674, width: '100%' }}>
        {rowData.length > 0 ? (
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows
            pagination
            paginationPageSize={12}
            quickFilterText={quickFilterText}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
            onCellContextMenu={handleCellRightClick}
          />
        ) : (
          <div className="ag-theme-alpine" style={{ height: '14px', width: '100%' }}>
            <Loader />
          </div>
        )}
      </div>
    </>
  );
};

export default OverView;

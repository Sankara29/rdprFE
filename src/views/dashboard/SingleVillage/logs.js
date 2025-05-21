




import { Card, CardHeader, CardBody } from 'reactstrap';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import ApexCharts from 'react-apexcharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Label, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LogsCard = ({ node_id }) => {
  const [logs, setLogs] = useState([]);

  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const navigate = useNavigate();
  // const location = useLocation();
  // const { node_id } = location.state || {};

  const [energyData, setEnergyData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [billingData, setBillingData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [waterMonth, setWaterMonth] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const chartsPerPage = 5;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 700;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dlResponse, billingResponse, waterResponse] = await Promise.all([
          fetch('https://testpms.ms-tech.in/v15/getDlReport'),
          fetch('https://testpms.ms-tech.in/v15/getBillingReport'),
          fetch('https://testpms.ms-tech.in/v15/getWaterReport')
        ]);
        const dlResult = await dlResponse.json();
        const billingResult = await billingResponse.json();
        const waterResult = await waterResponse.json();

        if (Array.isArray(dlResult.data)) {
          setEnergyData(dlResult.data.reverse());
        }
        if (Array.isArray(waterResult.data)) {
          setWaterMonth(formatWaterData(waterResult.data));
        }
        if (Array.isArray(dlResult.water)) {
          setWaterData(dlResult.water);
        }
        if (billingResult.statusCode === 200) {
          setBillingData(formatBillingData(billingResult.data));
        }
      } catch (err) {
        console.error('Data fetch error:', err);
      }
    };
    fetchData();
  }, []);

  const formatBillingData = (data) => {
    const formatted = {};
    data.forEach(({ gwid, month_start, monthly_kWh, mdwimp, PF }) => {
      if (!formatted[gwid]) formatted[gwid] = {};
      formatted[gwid][month_start] = {
        kWh: (parseFloat(monthly_kWh) / 1000).toFixed(2),
        MDkW: (parseFloat(mdwimp) / 1000).toFixed(2),
        PF: parseFloat(PF).toFixed(2),
      };
    });
    return formatted;
  };

  const formatWaterData = (data) => {
    const formatted = {};
    data.forEach(({ node_id, usage_month, total_monthly_usage }) => {
      if (!formatted[node_id]) formatted[node_id] = {};
      formatted[node_id][usage_month] = {
        total_monthly_usage: parseFloat(total_monthly_usage / 1000).toFixed(2),
      };
    });
    return formatted;
  };

  const formatDate = (dateString) => {
    const [date, time = '00:00:00'] = dateString.split(' ');
    const [year, month, day] = date.split('-').map((part) => part.padStart(2, '0'));
    return moment(`${year}-${month}-${day} ${time}`, 'YYYY-MM-DD HH:mm:ss').format('MMM DD');
  };

  const groupedEnergy = useMemo(() => {
    const filtered = energyData.filter(({ timeclock }) => {
      if (!startDate && !endDate) return true;
      const dateOnly = moment(timeclock.split(' ')[0], 'YYYY-MM-DD');
      const isAfterStart = startDate ? dateOnly.isSameOrAfter(moment(startDate)) : true;
      const isBeforeEnd = endDate ? dateOnly.isSameOrBefore(moment(endDate)) : true;
      return isAfterStart && isBeforeEnd;
    });

    return filtered.reduce((acc, { gwid, timeclock, daily_whimp }) => {
      const date = formatDate(timeclock);
      const currentWh = parseFloat(daily_whimp) / 1000;
      if (!acc[gwid]) acc[gwid] = { dates: [], deltas: [] };
      acc[gwid].dates.push(date);
      acc[gwid].deltas.push(currentWh);
      return acc;
    }, {});
  }, [energyData, startDate, endDate]);

  const groupedWater = useMemo(() => {
    return waterData.reduce((acc, { node_id, date, water_usage }) => {
      const formattedDate = moment(date, 'YYYY-MM-DD').format('MMM DD');
      if (!acc[node_id]) acc[node_id] = {};
      acc[node_id][formattedDate] = parseFloat(water_usage);
      return acc;
    }, {});
  }, [waterData]);

  const filteredGWIDs = Object.keys(groupedEnergy).filter((gwid) =>
    gwid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGWIDs.length / chartsPerPage);
  const currentPageData = filteredGWIDs.slice(
    (currentPage - 1) * chartsPerPage,
    currentPage * chartsPerPage
  );

  const tableCellStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    textAlign: 'left'
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '0 10px'
  };

  useEffect(() => {
    if (node_id) setSearchTerm(node_id);
  }, [node_id]);


  return (
    <div>


      <Card style={{ width: '100%', margin: '20px auto', padding: '20px', border: '1px solid #333', borderRadius: '10px', fontFamily: 'monospace' }}>
        <CardHeader style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
          Daily Load
        </CardHeader>
        <CardBody style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Row className="mb-4">
            <Col md={3}>
              <Label for="searchNode">Search NodeId</Label>
              <Input
                id="searchNode"
                type="text"
                placeholder="Search NodeId..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Col>

            <Col md={3}>
              <Label for="startDate">From Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Label for="endDate">To Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Col>
          </Row>

          {currentPageData.map((gwid) => {
            const { dates, deltas } = groupedEnergy[gwid];
            const waterSeries = dates.map(date => groupedWater[gwid]?.[date] ?? 0);

            const limit = isMobile ? 20 : dates.length;

            const displayDates = dates.slice(-limit);
            const displayDeltas = deltas.slice(-limit);
            const displayWater = waterSeries.slice(-limit);

            const options = {
              chart: {
                type: 'bar',
                height: 350,
                stacked: false,
                events: {
                  dataPointSelection: (event, chartContext, config) => {
                    if (config.seriesIndex === 0) {
                      navigate('/dashboard/Dl/energyByNodeId', {
                        state: { node_id: gwid }
                      });
                    }
                  }
                }
              },
              xaxis: {
                categories: displayDates,
                title: { text: 'Date' },
                labels: {
                  formatter: (value) => moment(value, 'MMM DD').format('DD')
                }
              },
              tooltip: {
                x: {
                  formatter: (value) => moment(value, 'MMM DD').format('MMM DD')
                }
              },
              yaxis: [
                {
                  title: { text: 'Energy (kWh)' },
                  labels: { formatter: val => val.toFixed(2) }
                },
                {
                  opposite: true,
                  title: { text: 'Water (Litres)' },
                  labels: { formatter: val => val.toFixed(0) }
                }
              ],
              colors: ['#4CAF50', '#2196F3'],
              plotOptions: {
                bar: {
                  columnWidth: '40%',
                  dataLabels: { position: 'top' }
                }
              },
              dataLabels: { enabled: false },
              title: {
                text: `Energy & Water Consumption - ${gwid}`,
                align: 'center'
              },
              legend: {
                position: 'top'
              }
            };

            const series = [
              { name: 'Energy (kWh)', data: displayDeltas },
              { name: 'Water (Litres)', data: displayWater }
            ];

            return (
              <div key={gwid} style={{ marginBottom: '40px' }}>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <ApexCharts
                    options={options}
                    series={series}
                    type="bar"
                    height={350}
                    width={'100%'}
                  />
                </div>

                <h4 style={{ marginTop: '10px' }}>Billing Data</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                      <th style={tableCellStyle}>Month</th>
                      <th style={tableCellStyle}>Units (kWh)</th>
                      <th style={tableCellStyle}>MDkW</th>
                      <th style={tableCellStyle}>PF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingData[gwid] ? (
                      Object.entries(billingData[gwid])
                        .sort(([a], [b]) => new Date(`${a}-01`) - new Date(`${b}-01`))
                        .map(([month, value]) => (
                          <tr key={month}>
                            <td style={tableCellStyle}>{moment(month, 'YYYY-MM-DD').format('MMMM')}</td>
                            <td style={tableCellStyle}>{value.kWh}</td>
                            <td style={tableCellStyle}>{value.MDkW}</td>
                            <td style={tableCellStyle}>{value.PF}</td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td style={tableCellStyle} colSpan="4">No billing data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <h4 style={{ marginTop: '10px' }}>Water Data</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                      <th style={tableCellStyle}>Month</th>
                      <th style={tableCellStyle}>Water Used (m³)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waterMonth[gwid] ? (
                      Object.entries(waterMonth[gwid])
                        .map(([month, value]) => (
                          <tr key={month}>
                            <td style={tableCellStyle}>{moment(month, 'YYYY-MM-DD').format('MMMM')}</td>
                            <td style={tableCellStyle}>{value.total_monthly_usage}</td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td style={tableCellStyle} colSpan="2">No water data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}

        </CardBody>
      </Card>
    </div>



  );
};

export default LogsCard;

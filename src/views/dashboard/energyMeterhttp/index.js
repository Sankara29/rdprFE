
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Row, Col, Label, Input, Button, Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody, Table, Card, Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap'
import Select from 'react-select'
import classnames from 'classnames'
import API_URL from '../../../config'
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'
import { Info } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import moment from 'moment/moment'
import Loader from '../rdprDashboard/Loader'
import { format, parse, isValid, differenceInCalendarDays } from 'date-fns';
import dayjs from 'dayjs'
import EnergyMeterNodeHttp from '../energyMeterNodeIdhttp'
import WaterMeterNodeHttp from '../httpwaterMeterNodeId'
import LoadPop from "./LoadPop"
import { FaWater, FaSignal, FaBolt, FaTint, FaBroadcastTower, FaDatabase, FaClock } from 'react-icons/fa';
const OverView = () => {
  const navigate = useNavigate()
  const gridRef = useRef()
  const { control } = useForm({})
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenEnergy, setModalOpenEnergy] = useState(false);
  const [modalOpenWater, setModalOpenWater] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedNode, setSelectedNode] = useState("");
  const [rowData, setRowData] = useState([])
  const [filterRow, setFilterRow] = useState([]);


  const [districtOptions, setDistrictOptions] = useState([])
  const [talukOptions, setTalukOptions] = useState([])

  const [gpOptions, setGpOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);

  const [selectedGP, setSelectedGP] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);

  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedTaluk, setSelectedTaluk] = useState(null)
  const [nodeIdFilter, setNodeIdFilter] = useState("")
  const [recentNodeCount, setRecentNodeCount] = useState(0)
  const lastRightClickRef = useRef(0)
  const [selectedData, setSelectedData] = useState(null);
  const [installedWater, setInstalledWater] = useState([]);
  const [waterTodayCounts, setWaterTodayCounts] = useState(0);
  const [waterInstCount, setWaterInstCount] = useState(0);
  // Function to calculate the recent node count
  const calculateRecentNodeCount = () => {
    const now = new Date();

    return filterRow.filter(item => {
      const capturedTime = new Date(item.realtimeclock);
      if (isNaN(capturedTime)) {
        return false;
      }

      return (
        capturedTime.getFullYear() === now.getFullYear() &&
        capturedTime.getMonth() === now.getMonth() &&
        capturedTime.getDate() === now.getDate()
      );
    }).length;
  };



  useEffect(() => {
    setRecentNodeCount(calculateRecentNodeCount())
  }, [filterRow]) // Recalculate whenever filterRow changes
  const parseLooseDateTime = (raw) => {
    if (!raw || typeof raw !== 'string') return null;

    try {
      const parts = raw.trim().split(/[- :]/); // split on dash, space, colon
      if (parts.length < 6) return null;

      const [year, month, day, hour, minute, second] = parts.map((p) => parseInt(p, 10));

      const dateObj = new Date(year, month - 1, day, hour, minute, second);
      return isValid(dateObj) ? dateObj : null;
    } catch {
      return null;
    }
  }
  const columnDefs = useMemo(() => [
    // { headerName: 'Id', field: 'id', maxWidth: 68 },
    { headerName: 'GP Name', field: 'GPName', maxWidth: 188 },
    { headerName: 'Village Name', field: 'village', maxWidth: 200 },
    { headerName: 'RR No', field: 'rr_no', maxWidth: 90 },

    {
      headerName: `Node Id (🟢 ${recentNodeCount})`,
      field: 'node_id',
      maxWidth: 150,
      cellRendererFramework: (params) => {
        const dataTime = new Date(params.data.realtimeclock);
        const currentTime = new Date();

        const isToday =
          dataTime.getFullYear() === currentTime.getFullYear() &&
          dataTime.getMonth() === currentTime.getMonth() &&
          dataTime.getDate() === currentTime.getDate();

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        const handleNavigate = () => {
          // navigate('/dashboard/energyByNodeIdhttp', {
          //   state: { node_id: params.data.node_id }
          // });
          setModalOpenEnergy(true);
          setSelectedData(params.data)
          // setSelectedNode(params.data.node_id);
        };

        const handleContextMenu = (e) => {
          if (!isMobile) {
            e.preventDefault(); // Prevent browser context menu
            handleNavigate();
          }
        };

        return (
          <span
            onClick={handleNavigate}
            onContextMenu={handleContextMenu}
            style={{
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            title="Click or Right-Click for more info"
          >
            {params.data.node_id} {isToday ? '🟢' : '🔴'}
          </span>
        );
      }
    },


    // { headerName: 'Meter No', field: 'meterno', maxWidth: 118 },
    { headerName: "tank", field: 'tank_node', maxWidth: 120 },
    // { headerName: "battery", field: 'battery_percentage', maxWidth: 120 },
    {
      headerName: "installed ", field: 'starterInstalled', maxWidth: 150, valueFormatter: (params) => {
        // const noCommList = ['3300001', '1416910', '1608783', '1608780'];
        // const meterno = params.data?.meterno;

        // if (noCommList.includes(meterno)) return 'Not Communicated';

        const date = dayjs(params.value, 'YYYY-M-D H:m:s'); // handles "2025-7-21 11:3:00"
        const installedDate = params.data?.created_at
        return date.isValid() ? date.format('MMM-DD-YY') : installedDate ? dayjs(installedDate).format("MMM-DD-YY") : "";
      }, exportValueGetter: (params) => {
        const date = dayjs(params.value, "YYYY-M-D H:m:s");
        const installedDate = params.data.created_at
        return date.isValid() ? date.format("YYYY-MM-DD") : installedDate ? dayjs(installedDate).format("YYYY-MM-DD") : "";
      },
      filter: 'agDateColumnFilter',
      filterParams: {
        // filterOptions: ['equals', 'not equals'],
        suppressAndOrCondition: true,
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = dayjs(cellValue, 'YYYY-M-D H:m:s');
          const filterDate = dayjs(filterLocalDateAtMidnight);

          if (!cellDate.isValid()) return -1;

          return cellDate.startOf('day').diff(filterDate.startOf('day'), 'day');
        }
      }
    },

    {
      headerName: "Node Status", field: "tm", maxWidth: 240,
      valueGetter: (params) => params.data?.tm,
      valueFormatter: (params) => {


        const date = dayjs(params.value, 'YYYY-M-D H:m:s'); // handles "2025-7-21 11:3:00"
        return date.isValid() ? date.format('MMM-DD-YY') : 'Not Communicated';
      }, exportValueGetter: (params) => {
        const date = dayjs(params.value, "YYYY-M-D H:m:s");
        return date.isValid() ? date.format("YYYY-MM-DD") : "Not Communicated";
      },
      filter: 'agDateColumnFilter',
      filterParams: {
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = dayjs(cellValue, 'YYYY-M-D H:m:s');
          const filterDate = dayjs(filterLocalDateAtMidnight);

          if (!cellDate.isValid()) return -1;

          return cellDate.startOf('day').diff(filterDate.startOf('day'), 'day');
        }
      }
    },
    {
      headerName: 'Last Comm (EN)',
      field: 'realtimeclock',
      maxWidth: 110,
      valueGetter: (params) => params.data?.realtimeclock,
      valueFormatter: (params) => {
        const noCommList = ['3300001', '1416910', '1608783', '1608780'];
        const meterno = params.data?.meterno;

        if (noCommList.includes(meterno)) return 'Not Communicated';

        const date = dayjs(params.value, 'YYYY-M-D H:m:s'); // handles "2025-7-21 11:3:00"
        return date.isValid() ? date.format('MMM-DD-YY') : '';
      }, exportValueGetter: (params) => {
        const date = dayjs(params.value, "YYYY-M-D H:m:s");
        return date.isValid() ? date.format("YYYY-MM-DD") : "Not Communicated";
      },
      filter: 'agDateColumnFilter',
      filterParams: {
        // filterOptions: ['equals', 'not equals'],
        suppressAndOrCondition: true,
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = dayjs(cellValue, 'YYYY-M-D H:m:s');
          const filterDate = dayjs(filterLocalDateAtMidnight);

          if (!cellDate.isValid()) return -1;

          return cellDate.startOf('day').diff(filterDate.startOf('day'), 'day');
        }
      }
    },
    {
      headerName: 'Last Comm (WA)',
      field: 'latest_water_date',
      maxWidth: 180,
      valueGetter: (params) => params.data?.latest_water_date,
      valueFormatter: (params) => {
        const noCommList = ['3300001', '1416910', '1608783', '1608780'];
        const meterno = params.data?.meterno;

        if (noCommList.includes(meterno)) return 'Not Communicated';

        const date = dayjs(params.value, 'YYYY-M-D H:m:s'); // handles "2025-7-21 11:3:00"
        return date.isValid() ? date.format('MMM-DD-YY') : 'Not Communicated';
      }, exportValueGetter: (params) => {
        const date = dayjs(params.value, "YYYY-M-D H:m:s");
        return date.isValid() ? date.format("YYYY-MM-DD") : "Not Communicated";
      },
      filter: 'agDateColumnFilter',
      filterParams: {
        // filterOptions: ['equals', 'not equals'],
        suppressAndOrCondition: true,
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = dayjs(cellValue, 'YYYY-M-D H:m:s');
          const filterDate = dayjs(filterLocalDateAtMidnight);

          if (!cellDate.isValid()) return -1;

          return cellDate.startOf('day').diff(filterDate.startOf('day'), 'day');
        }
      }

    }
    ,
    {
      headerName: "Node status",
      field: "node_id",
      maxWidth: 175,
      cellRendererFramework: (params) => {
        const handleClick = async () => {
          try {
            const res = await fetch(`https://testpms.ms-tech.in/v15/gwid-time/${params.value}`);
            const data = await res.json();
            setModalData(data); // API returns an array
            setModalOpen(true);
            setSelectedNode(params.value);
            try {
              const res = await fetch(`https://testpms.ms-tech.in/v15/getGetCommandPerNode?node_id=${params.value}`);
              const result = await res.json();
              setCommandModalData(result.data || []);
            } catch (err) {
              console.error("Error fetching command data:", err);
            }
          } catch (err) {
            console.error("Error fetching node details:", err);
          }
        };

        return (
          <div className="button-cell">
            <Button
              onClick={handleClick}
              style={{
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              title="Click for more info"
            >
              Node Status
            </Button>
          </div>
        );
      },
      cellStyle: { textAlign: 'center', padding: 0 }
    },
    {
      headerName: 'water Info', maxWidth: 148,
      cellRendererFramework: (params) => (
        <div className="button-cell">
          <Button
            color="primary"
            style={{ width: '100%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            // onClick={() => navigate('/dashboard/waterByNodeIdhttp', { state: { node_id: params.data.node_id } })}
            onClick={() => { setModalOpenWater(true); setSelectedNode(params.data.node_id) }}
          >
            <Info style={{ marginRight: '8px' }} />
            Water
          </Button>
        </div>
      ),
      cellStyle: { textAlign: 'center', padding: 0 }
    }, {
      headerName: "location",
      field: "location",
      maxWidth: 150,
      cellRendererFramework: (params) => {
        const { lat, long } = params.data;


        // If lat/long exist, use them; otherwise, fallback to location string
        const googleMapsUrl = lat && long ? `https://www.google.com/maps/search/?api=1&query=${lat},${long}`
          : null;

        console.log(googleMapsUrl)

        return googleMapsUrl ? (
          <div className="button-cell">
            <Button
              color="primary"
              style={{ width: '100%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => window.open(googleMapsUrl, '_blank')}
            // onClick={() => { setModalOpenWater(true); setSelectedNode(node_id) }}
            >
              <Info style={{ marginRight: '8px' }} />
              Map
            </Button>
          </div>
        ) : (
          <span title="Location not available">N/A</span>
        );
      }, valueGetter: (params) => {
        const lat = params.data.lat;   // latitude field in your data
        const long = params.data.long;   // longitude field in your data
        return lat != null && long != null ? `${lat}, ${long}` : "";
      }, cellStyle: { textAlign: 'center', padding: 0 }
    }


  ], [navigate, recentNodeCount])

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    flex: 1,
    filterParams: { buttons: ['apply', 'reset'] },
    wrapHeaderText: true, // for AG Grid Enterprise >= 27
    autoHeaderHeight: true
  }), [])

  const onGridReady = (params) => {
    gridRef.current = params.api
  }
  const [waterData, setWaterData] = useState([])
  // Fetch data
  useEffect(() => {

    const fetchData = async (page = 1, limit = 12) => {



      // const response = await fetch('https://api.ms-tech.in/v14/get-multiple-hashes', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     keys: ["v_NSRT000003", "v_NSRT000012", "v_NSRT000029", "v_NSRT000033", "v_NSRT000051", "v_NSRT000071", "v_NSRT000076", "v_NSRT000083", "v_NSRT000099", "v_NSRT000125", "v_NSRT000192", "v_NSRT000193", "v_NSRT000205", "v_NSRT000217", "v_NSRT000221", "v_NSRT000225", "v_NSRT000230", "v_NSRT000231", "v_NSRT000236", "v_NSRT000237", "v_NSRT000246", "v_NSRT000255", "v_NSRT000259", "v_NSRT000263", "v_NSRT000264", "v_NSRT000290", "v_NSRT000295", "v_NSRT000298", "v_NSRT000511", "v_NSRT000513", "v_NSRT000516", "v_NSRT000520", "v_NSRT000522", "v_NSRT000524", "v_NSRT000526", "v_NSRT000548", "v_NSRT000556", "v_NSRT000557", "v_NSRT000559", "v_NSRT000563", "v_NSRT000564", "v_NSRT000568", "v_NSRT000570", "v_NSRT000571", "v_NSRT000573", "v_NSRT000574", "v_NSRT000576", "v_NSRT000577", "v_NSRT000580", "v_NSRT000583", "v_NSRT000004", "v_NSRT000007", "v_NSRT000016", "v_NSRT000018", "v_NSRT000020", "v_NSRT000026", "v_NSRT000032", "v_NSRT000039", "v_NSRT000042", "v_NSRT000048", "v_NSRT000049", "v_NSRT000054", "v_NSRT000056", "v_NSRT000064", "v_NSRT000067", "v_NSRT000074", "v_NSRT000077", "v_NSRT000096", "v_NSRT000100", "v_NSRT000105", "v_NSRT000111", "v_NSRT000118", "v_NSRT000131", "v_NSRT000186", "v_NSRT000200", "v_NSRT000203", "v_NSRT000204", "v_NSRT000216", "v_NSRT000260", "v_NSRT000267", "v_NSRT000289", "v_NSRT000314", "v_NSRT000316", "v_NSRT000318", "v_NSRT000319", "v_NSRT000323", "v_NSRT000324", "v_NSRT000326", "v_NSRT000340", "v_NSRT000343", "v_NSRT000356", "v_NSRT000360", "v_NSRT000361", "v_NSRT000362", "v_NSRT000366", "v_NSRT000372", "v_NSRT000376", "v_NSRT000378", "v_NSRT000380", "v_NSRT000384", "v_NSRT000385", "v_NSRT000391", "v_NSRT000394", "v_NSRT000397", "v_NSRT000400", "v_NSRT000401", "v_NSRT000404", "v_NSRT000405", "v_NSRT000407", "v_NSRT000409", "v_NSRT000410", "v_NSRT000411", "v_NSRT000413", "v_NSRT000414", "v_NSRT000418", "v_NSRT000419", "v_NSRT000420", "v_NSRT000422", "v_NSRT000423", "v_NSRT000424", "v_NSRT000428", "v_NSRT000430", "v_NSRT000440", "v_NSRT000441", "v_NSRT000442", "v_NSRT000443", "v_NSRT000446", "v_NSRT000450", "v_NSRT000454", "v_NSRT000459", "v_NSRT000460", "v_NSRT000465", "v_NSRT000467", "v_NSRT000471", "v_NSRT000472", "v_NSRT000476", "v_NSRT000479", "v_NSRT000484", "v_NSRT000487", "v_NSRT000495", "v_NSRT000496", "v_NSRT000498", "v_NSRT000500", "v_NSRT000508", "v_NSRT000560", "v_NSRT000561", "v_NSRT000566", "v_NSRT000569", "v_NSRT000585", "v_NSRT000586", "v_NSRT000005", "v_NSRT000018", "v_NSRT000022", "v_NSRT000047", "v_NSRT000052", "v_NSRT000066", "v_NSRT000068", "v_NSRT000122", "v_NSRT000147", "v_NSRT000148", "v_NSRT000149", "v_NSRT000153", "v_NSRT000176", "v_NSRT000186", "v_NSRT000188", "v_NSRT000196", "v_NSRT000198", "v_NSRT000205", "v_NSRT000206", "v_NSRT000223", "v_NSRT000232", "v_NSRT000239", "v_NSRT000240", "v_NSRT000241", "v_NSRT000247", "v_NSRT000252", "v_NSRT000265", "v_NSRT000306", "v_NSRT000309", "v_NSRT000321", "v_NSRT000325", "v_NSRT000328", "v_NSRT000329", "v_NSRT000331", "v_NSRT000337", "v_NSRT000341", "v_NSRT000342", "v_NSRT000345", "v_NSRT000352", "v_NSRT000353", "v_NSRT000357", "v_NSRT000358", "v_NSRT000359", "v_NSRT000364", "v_NSRT000368", "v_NSRT000369", "v_NSRT000370", "v_NSRT000379", "v_NSRT000386", "v_NSRT000392", "v_NSRT000398", "v_NSRT000407", "v_NSRT000415", "v_NSRT000417", "v_NSRT000421", "v_NSRT000425", "v_NSRT000431", "v_NSRT000437", "v_NSRT000438", "v_NSRT000439", "v_NSRT000445", "v_NSRT000447", "v_NSRT000449", "v_NSRT000453", "v_NSRT000457", "v_NSRT000461", "v_NSRT000464", "v_NSRT000466", "v_NSRT000468", "v_NSRT000473", "v_NSRT000474", "v_NSRT000475", "v_NSRT000477", "v_NSRT000478", "v_NSRT000480", "v_NSRT000481", "v_NSRT000482", "v_NSRT000483", "v_NSRT000485", "v_NSRT000486", "v_NSRT000488", "v_NSRT000489", "v_NSRT000490", "v_NSRT000491", "v_NSRT000493", "v_NSRT000529", "v_NSRT000531", "v_NSRT000532", "v_NSRT000534", "v_NSRT000537", "v_NSRT000539", "v_NSRT000540", "v_NSRT000541", "v_NSRT000542", "v_NSRT000543", "v_NSRT000544", "v_NSRT000545", "v_NSRT000546", "v_NSRT000555", "v_NSRT000558", "v_NSRT000008", "v_NSRT000030", "v_NSRT000037", "v_NSRT000115", "v_NSRT000141", "v_NSRT000143", "v_NSRT000150", "v_NSRT000185", "v_NSRT000202", "v_NSRT000220", "v_NSRT000268", "v_NSRT000305", "v_NSRT000315", "v_NSRT000330", "v_NSRT000346", "v_NSRT000371", "v_NSRT000373", "v_NSRT000436", "v_NSRT000470", "v_NSRT000492", "v_NSRT000499", "v_NSRT000547", "v_NSRT000572", "v_NSRT000597", "v_NSRT000598", "v_NSRT000599", "v_NSRT000600", "v_NSRT000601", "v_NSRT000602", "v_NSRT000603", "v_NSRT000604", "v_NSRT000605", "v_NSRT000606", "v_NSRT000607", "v_NSRT000608", "v_NSRT000609", "v_NSRT000610", "v_NSRT000611", "v_NSRT000612", "v_NSRT000613", "v_NSRT000614", "v_NSRT000615", "v_NSRT000616", "v_NSRT000617", "v_NSRT000618", "v_NSRT000619", "v_NSRT000620", "v_NSRT000621", "v_NSRT000622", "v_NSRT000623", "v_NSRT000035", "v_NSRT000080", "v_NSRT000139", "v_NSRT000189", "v_NSRT000226", "v_NSRT000245", "v_NSRT000256", "v_NSRT000286", "v_NSRT000301", "v_NSRT000303", "v_NSRT000304", "v_NSRT000347", "v_NSRT000351", "v_NSRT000387", "v_NSRT000388", "v_NSRT000408", "v_NSRT000420", "v_NSRT000014", "v_NSRT000171", "v_NSRT000162", "v_NSRT000514", "v_NSRT000545", "v_NSRT000082", "v_NSRT000348", "v_NSRT000272", "v_NSRT000019", "v_NSRT000248", "v_NSRT000505", "v_NSRT000078", "v_NSRT000389", "v_NSRT000159", "v_NSRT000235", "v_NSRT000242", "v_NSRT000194", "v_NSRT000201", "v_NSRT000142", "v_NSRT000044", "v_NSRT000174", "v_NSRT000167", "v_NSRT000554", "v_NSRT000062", "v_NSRT000124", "v_NSRT000429", "v_NSRT000462", "v_NSRT000307", "v_NSRT000017", "v_NSRT000521", "v_NSRT000382", "v_NSRT000501", "v_NSRT000158", "v_NSRT000123", "v_NSRT000091", "v_NSRT000578", "v_NSRT000444", "v_NSRT000152", "v_NSRT000166", "v_NSRT000342", "v_NSRT000434", "v_NSRT000509", "v_NSRT000550", "v_NSRT000374", "v_NSRT000244", "v_NSRT000281", "v_NSRT000136", "v_NSRT000169", "v_NSRT000112", "v_NSRT000519", "v_NSRT000399", "v_NSRT000469", "v_NSRT000276", "v_NSRT000163", "v_NSRT000523", "v_NSRT000053", "v_NSRT000144", "v_NSRT000512", "v_NSRT000363", "v_NSRT000390", "v_NSRT000322", "v_NSRT000134", "v_NSRT000403", "v_NSRT000180", "v_NSRT000293", "v_NSRT000092", "v_NSRT000176", "v_NSRT000086", "v_NSRT000402", "v_NSRT000349", "v_NSRT000565", "v_NSRT000510", "v_NSRT000334", "v_NSRT000515", "v_NSRT000338", "v_NSRT000095", "v_NSRT000006", "v_NSRT000010", "v_NSRT000027", "v_NSRT000043", "v_NSRT000050", "v_NSRT000069", "v_NSRT000084", "v_NSRT000097", "v_NSRT000098", "v_NSRT000102", "v_NSRT000104", "v_NSRT000105", "v_NSRT000110", "v_NSRT000113", "v_NSRT000120", "v_NSRT000128", "v_NSRT000130", "v_NSRT000132", "v_NSRT000146", "v_NSRT000156", "v_NSRT000165", "v_NSRT000168", "v_NSRT000169", "v_NSRT000172", "v_NSRT000179", "v_NSRT000184", "v_NSRT000187", "v_NSRT000207", "v_NSRT000209", "v_NSRT000215", "v_NSRT000228", "v_NSRT000243", "v_NSRT000266", "v_NSRT000285", "v_NSRT000297", "v_NSRT000310", "v_NSRT000312", "v_NSRT000313", "v_NSRT000339", "v_NSRT000355", "v_NSRT000377", "v_NSRT000396", "v_NSRT000406", "v_NSRT000452", "v_NSRT000515", "v_NSRT000518", "v_NSRT000023", "v_NSRT000025", "v_NSRT000028", "v_NSRT000031", "v_NSRT000057", "v_NSRT000059", "v_NSRT000063", "v_NSRT000065", "v_NSRT000072", "v_NSRT000085", "v_NSRT000090", "v_NSRT000094", "v_NSRT000095", "v_NSRT000106", "v_NSRT000117", "v_NSRT000129", "v_NSRT000133", "v_NSRT000137", "v_NSRT000145", "v_NSRT000160", "v_NSRT000197", "v_NSRT000208", "v_NSRT000210", "v_NSRT000211", "v_NSRT000222", "v_NSRT000233", "v_NSRT000238", "v_NSRT000258", "v_NSRT000270", "v_NSRT000274", "v_NSRT000275", "v_NSRT000284", "v_NSRT000291", "v_NSRT000292", "v_NSRT000294", "v_NSRT000311", "v_NSRT000344", "v_NSRT000375", "v_NSRT000381", "v_NSRT000411", "v_NSRT000455", "v_NSRT000502", "v_NSRT000517", "v_NSRT000553", "v_NSRT000562", "v_NSRT000567", "v_NSRT000575", "v_NSRT000579", "v_NSRT000582", "v_NSRT000587", "v_NSRT000645", "v_NSRT000647", "v_NSRT000648", "v_NSRT000649", "v_NSRT000650", "v_NSRT000653", "v_NSRT000655", "v_NSRT000657", "v_NSRT000659", "v_NSRT000661", "v_NSRT000662", "v_NSRT000663", "v_NSRT000664", "v_NSRT000665", "v_NSRT000666", "v_NSRT000667", "v_NSRT000669", "v_NSRT000670", "v_NSRT000671", "v_NSRT000672", "v_NSRT000673", "v_NSRT000674", "v_NSRT000675", "v_NSRT000677", "v_NSRT000678", "v_NSRT000679", "v_NSRT000681", "v_NSRT000683", "v_NSRT000684", "v_NSRT000685", "v_NSRT000686", "v_NSRT000687", "v_NSRT000688", "v_NSRT000689", "v_NSRT000690", "v_NSRT000691", "v_NSRT000692", "v_NSRT000693", "v_NSRT000694", "v_NSRT000695", "v_NSRT000696", "v_NSRT000697", "v_NSRT000698", "v_NSRT000700", "v_NSRT000701", "v_NSRT000702", "v_NSRT000703", "v_NSRT000743", "v_NSRT000747", "v_NSRT000761", "v_NSRT000668", "v_NSRT000676", "v_NSRT000704", "v_NSRT000705", "v_NSRT000706", "v_NSRT000707", "v_NSRT000708", "v_NSRT000709", "v_NSRT000711", "v_NSRT000712", "v_NSRT000714", "v_NSRT000715", "v_NSRT000716", "v_NSRT000720", "v_NSRT000721", "v_NSRT000722", "v_NSRT000723", "v_NSRT000725", "v_NSRT000726", "v_NSRT000729", "v_NSRT000731", "v_NSRT000732", "v_NSRT000733", "v_NSRT000734", "v_NSRT000735", "v_NSRT000736", "v_NSRT000737", "v_NSRT000738", "v_NSRT000739", "v_NSRT000740", "v_NSRT000741", "v_NSRT000742", "v_NSRT000744", "v_NSRT000745", "v_NSRT000746", "v_NSRT000748", "v_NSRT000749", "v_NSRT000750", "v_NSRT000751", "v_NSRT000752", "v_NSRT000753", "v_NSRT000754", "v_NSRT000755", "v_NSRT000756", "v_NSRT000757", "v_NSRT000758", "v_NSRT000759", "v_NSRT000760", "v_NSRT000763", "v_NSRT000764", "v_NSRT000160", "v_NSRT000640", "v_NSRT000402", "v_NSRT000058", "v_NSRT000222", "v_NSRT000772", "v_NSRT000766", "v_NSRT000682", "v_NSRT000783", "v_NSRT000774", "v_NSRT000809", "v_NSRT000699", "v_NSRT000805", "v_NSRT000808", "v_NSRT000076", "v_NSRT000793", "v_NSRT000775", "v_NSRT000641", "v_NSRT000280", "v_NSRT000251", "v_NSRT000234", "v_NSRT000121", "v_NSRT000045", "v_NSRT000365", "v_NSRT000107", "v_NSRT000182", "v_NSRT000219", "v_NSRT000634", "v_NSRT000123", "v_NSRT000178", "v_NSRT000114", "v_NSRT000140", "v_NSRT000161", "v_NSRT000494", "v_NSRT000535", "v_NSRT000117", "v_NSRT000137", "v_NSRT000642", "v_NSRT000337", "v_NSRT000282", "v_NSRT000034", "v_NSRT000218", "v_NSRT000393", "v_NSRT000626", "v_NSRT000639", "v_NSRT000041", "v_NSRT000213", "v_NSRT000162", "v_NSRT000436", "v_NSRT000294", "v_NSRT000786", "v_NSRT000656", "v_NSRT000274", "v_NSRT000719", "v_NSRT000658", "v_NSRT000802", "v_NSRT000762", "v_NSRT000070", "v_NSRT000646", "v_NSRT000785", "v_NSRT000724", "v_NSRT000801", "v_NSRT000660", "v_NSRT000654", "v_NSRT000448", "v_NSRT000680", "v_NSRT000771", "v_NSRT000727", "v_NSRT000717", "v_NSRT000728", "v_NSRT000796", "v_NSRT000791", "v_NSRT000800", "v_NSRT000810", "v_NSRT000730", "v_NSRT000768", "v_NSRT000776", "v_NSRT000806", "v_NSRT000782", "v_NSRT000784", "v_NSRT000710", "v_NSRT000778", "v_NSRT000788", "v_NSRT000651", "v_NSRT000780", "v_NSRT000789", "v_NSRT000770", "v_NSRT000769", "v_NSRT000799", "v_NSRT000807", "v_NSRT000795", "v_NSRT000781", "v_NSRT000797", "v_NSRT000767", "v_NSRT000777", "v_NSRT000794", "v_NSRT000713", "v_NSRT000792", "v_NSRT000804", "v_NSRT000790", "v_NSRT000786", "v_NSRT000656", "v_NSRT000274", "v_NSRT000719", "v_NSRT000658", "v_NSRT000802", "v_NSRT000762", "v_NSRT000070", "v_NSRT000646", "v_NSRT000785", "v_NSRT000724", "v_NSRT000801", "v_NSRT000660", "v_NSRT000654", "v_NSRT000448", "v_NSRT000680", "v_NSRT000771", "v_NSRT000727", "v_NSRT000717", "v_NSRT000728", "v_NSRT000796", "v_NSRT000791", "v_NSRT000800", "v_NSRT000810", "v_NSRT000730", "v_NSRT001767", "v_NSRT001988", "v_NSRT001097", "v_NSRT000827", "v_NSRT000718", "v_NSRT000910", "v_NSRT001161", "v_NSRT000852", "v_NSRT001244", "v_NSRT001143", "v_NSRT001172", "v_NSRT001048", "v_NSRT001043", "v_NSRT001279", "v_NSRT000892", "v_NSRT001999", "v_NSRT002005", "v_NSRT001325", "v_NSRT001968", "v_NSRT001210", "v_NSRT001207", "v_NSRT001284", "v_NSRT000855", "v_NSRT001121", "v_NSRT001151", "v_NSRT001194", "v_NSRT002004", "v_NSRT001926", "v_NSRT001135", "v_NSRT001946", "v_NSRT001032", "v_NSRT000874", "v_NSRT001341", "v_NSRT001320", "v_NSRT001002", "v_NSRT001403", "v_NSRT000960", "v_NSRT001955", "v_NSRT001348", "v_NSRT001499", "v_NSRT001925", "v_NSRT001167", "v_NSRT001823", "v_NSRT001854", "v_NSRT001219", "v_NSRT001948", "v_NSRT001463", "v_NSRT001674", "v_NSRT001889", "v_NSRT000847", "v_NSRT001257", "v_NSRT000853", "v_NSRT001366", "v_NSRT001633", "v_NSRT001357", "v_NSRT001224", "v_NSRT001775", "v_NSRT001933", "v_NSRT000887", "v_NSRT001834", "v_NSRT001839", "v_NSRT000845", "v_NSRT001343", "v_NSRT001293", "v_NSRT001276", "v_NSRT001707", "v_NSRT001855", "v_NSRT000866", "v_NSRT001831", "v_NSRT001802", "v_NSRT001203", "v_NSRT001078", "v_NSRT001198", "v_NSRT000843", "v_NSRT000981", "v_NSRT000822", "v_NSRT001205", "v_NSRT001008", "v_NSRT001803", "v_NSRT001128", "v_NSRT001024", "v_NSRT001215", "v_NSRT001843", "v_NSRT001849", "v_NSRT001949", "v_NSRT001126", "v_NSRT001297", "v_NSRT002009", "v_NSRT002035", "v_NSRT000823", "v_NSRT000990", "v_NSRT000833", "v_NSRT001387", "v_NSRT000871", "v_NSRT000918", "v_NSRT000876", "v_NSRT000962", "v_NSRT000945", "v_NSRT000914", "v_NSRT000907", "v_NSRT000933", "v_NSRT001723", "v_NSRT001618", "v_NSRT001820", "v_NSRT001612", "v_NSRT001527", "v_NSRT001256", "v_NSRT001214", "v_NSRT001815", "v_NSRT001701", "v_NSRT001888", "v_NSRT001914", "v_NSRT000863", "v_NSRT001928", "v_NSRT000857", "v_NSRT001734", "v_NSRT001413", "v_NSRT000830", "v_NSRT001290", "v_NSRT001311", "v_NSRT001147", "v_NSRT001133", "v_NSRT001202", "v_NSRT001754", "v_NSRT001991", "v_NSRT001760", "v_NSRT001269", "v_NSRT001587", "v_NSRT001249", "v_NSRT001782", "v_NSRT001239", "v_NSRT001828", "v_NSRT001894", "v_NSRT001593", "v_NSRT001170", "v_NSRT001893", "v_NSRT001792", "v_NSRT001728", "v_NSRT000826", "v_NSRT001230", "v_NSRT001267", "v_NSRT001500", "v_NSRT001697", "v_NSRT001517", "v_NSRT001178", "v_NSRT002000", "v_NSRT001566", "v_NSRT001735", "v_NSRT000977", "v_NSRT000879", "v_NSRT001155", "v_NSRT001740", "v_NSRT002015", "v_NSRT001717", "v_NSRT001583", "v_NSRT001468", "v_NSRT001505", "v_NSRT001529", "v_NSRT001570", "v_NSRT000926", "v_NSRT001662", "v_NSRT001832", "v_NSRT002012", "v_NSRT001744", "v_NSRT001845", "v_NSRT002014", "v_NSRT000851", "v_NSRT002019", "v_NSRT001944", "v_NSRT001838", "v_NSRT002020", "v_NSRT001996", "v_NSRT001880", "v_NSRT001936", "v_NSRT001719", "v_NSRT001822", "v_NSRT001826", "v_NSRT000932", "v_NSRT000886", "v_NSRT000844", "v_NSRT001337", "v_NSRT000829", "v_NSRT000828", "v_NSRT000835", "v_NSRT001356", "v_NSRT000878", "v_NSRT001193", "v_NSRT001328", "v_NSRT000909", "v_NSRT001686", "v_NSRT001627", "v_NSRT000846", "v_NSRT001493", "v_NSRT000971", "v_NSRT000825", "v_NSRT001401", "v_NSRT000954", "v_NSRT000861", "v_NSRT001200", "v_NSRT001705", "v_NSRT001576", "v_NSRT000869", "v_NSRT001626", "v_NSRT001132", "v_NSRT001245", "v_NSRT000896", "v_NSRT001691", "v_NSRT001165", "v_NSRT000936", "v_NSRT000891", "v_NSRT000849", "v_NSRT001891", "v_NSRT000858", "v_NSRT001876", "v_NSRT001875", "v_NSRT001110", "v_NSRT001960", "v_NSRT001306", "v_NSRT000985", "v_NSRT001296", "v_NSRT000986", "v_NSRT000831", "v_NSRT000859", "v_NSRT000840", "v_NSRT001488", "v_NSRT001028", "v_NSRT001869", "v_NSRT001861", "v_NSRT001963", "v_NSRT001476", "v_NSRT000832", "v_NSRT001184", "v_NSRT000867", "v_NSRT000946", "v_NSRT001472", "v_NSRT001060", "v_NSRT000924", "v_NSRT000994", "v_NSRT001229", "v_NSRT000873", "v_NSRT000942", "v_NSRT000824", "v_NSRT000950", "v_NSRT000991", "v_NSRT000899", "v_NSRT001011", "v_NSRT000941", "v_NSRT001122", "v_NSRT000895", "v_NSRT001837", "v_NSRT001659", "v_NSRT001308", "v_NSRT001681", "v_NSRT001489", "v_NSRT001303", "v_NSRT001590", "v_NSRT001238", "v_NSRT001579", "v_NSRT001332", "v_NSRT001180", "v_NSRT000839", "v_NSRT001392", "v_NSRT001372", "v_NSRT001483", "v_NSRT001607", "v_NSRT000975", "v_NSRT001494", "v_NSRT001275", "v_NSRT001598", "v_NSRT001638", "v_NSRT002026", "v_NSRT002027", "v_NSRT001804", "v_NSRT001858", "v_NSRT001811", "v_NSRT001806", "v_NSRT001594", "v_NSRT001817", "v_NSRT001649", "v_NSRT001872", "v_NSRT001808", "v_NSRT001833", "v_NSRT000966", "v_NSRT000998", "v_NSRT001331", "v_NSRT001183", "v_NSRT000908", "v_NSRT001314", "v_NSRT000842", "v_NSRT000915", "v_NSRT000860", "v_NSRT000865", "v_NSRT000834", "v_NSRT000882", "v_NSRT000862", "v_NSRT001801", "v_NSRT000868", "v_NSRT001800", "v_NSRT001599", "v_NSRT001479", "v_NSRT000877", "v_NSRT000897", "v_NSRT000904", "v_NSRT000952", "v_NSRT000999", "v_NSRT001025", "v_NSRT001061", "v_NSRT001067", "v_NSRT001070", "v_NSRT001076", "v_NSRT001087", "v_NSRT001104", "v_NSRT001109", "v_NSRT001120", "v_NSRT001125", "v_NSRT001130", "v_NSRT001144", "v_NSRT001150", "v_NSRT001160", "v_NSRT001168", "v_NSRT001182", "v_NSRT001189", "v_NSRT001206", "v_NSRT001213", "v_NSRT001217", "v_NSRT001218", "v_NSRT001222", "v_NSRT001223", "v_NSRT001242", "v_NSRT001289", "v_NSRT001291", "v_NSRT001294", "v_NSRT001305", "v_NSRT001412", "v_NSRT001418", "v_NSRT001419", "v_NSRT001422", "v_NSRT001423", "v_NSRT001426", "v_NSRT001439", "v_NSRT001442", "v_NSRT001443", "v_NSRT001450", "v_NSRT001458", "v_NSRT001470", "v_NSRT001480", "v_NSRT001484", "v_NSRT001487", "v_NSRT001492", "v_NSRT001502", "v_NSRT001508", "v_NSRT001512", "v_NSRT001514", "v_NSRT001516", "v_NSRT001525", "v_NSRT001530", "v_NSRT001531", "v_NSRT001545", "v_NSRT001554", "v_NSRT001555", "v_NSRT001558", "v_NSRT001565", "v_NSRT001568", "v_NSRT001578", "v_NSRT001581", "v_NSRT001584", "v_NSRT001589", "v_NSRT001603", "v_NSRT001604", "v_NSRT001606", "v_NSRT001608", "v_NSRT001610", "v_NSRT001614", "v_NSRT001615", "v_NSRT001616", "v_NSRT001619", "v_NSRT001622", "v_NSRT001623", "v_NSRT001631", "v_NSRT001634", "v_NSRT001637", "v_NSRT001639", "v_NSRT001640", "v_NSRT001642", "v_NSRT001643", "v_NSRT001646", "v_NSRT001647", "v_NSRT001648", "v_NSRT001651", "v_NSRT001655", "v_NSRT001656", "v_NSRT001658", "v_NSRT001660", "v_NSRT001661", "v_NSRT001665", "v_NSRT001671", "v_NSRT001675", "v_NSRT001676", "v_NSRT001678", "v_NSRT001687", "v_NSRT001703", "v_NSRT001708", "v_NSRT001710", "v_NSRT001713", "v_NSRT001714", "v_NSRT001720", "v_NSRT001722", "v_NSRT001727", "v_NSRT001732", "v_NSRT001755", "v_NSRT001764", "v_NSRT001780", "v_NSRT001794", "v_NSRT001818", "v_NSRT001841", "v_NSRT001848", "v_NSRT001852", "v_NSRT001882", "v_NSRT001898", "v_NSRT001908", "v_NSRT001913", "v_NSRT001915", "v_NSRT001920", "v_NSRT001932", "v_NSRT001939", "v_NSRT001978", "v_NSRT001985", "v_NSRT002002", "v_NSRT002003", "v_NSRT002013", "v_NSRT002018", "v_NSRT002029", "v_NSRT002033", "v_NSRT002037", "v_NSRT002046", "v_NSRT002048", "v_NSRT002055", "v_NSRT002058", "v_NSRT002059", "v_NSRT002061", "v_NSRT002062", "v_NSRT002064", "v_NSRT002072", "v_NSRT002078", "v_NSRT002079", "v_NSRT002080", "v_NSRT002124", "v_NSRT002208", "v_NSRT002279", "v_NSRT002283", "v_NSRT000841", "v_NSRT000854", "v_NSRT000881", "v_NSRT000919", "v_NSRT000949", "v_NSRT000973", "v_NSRT000976", "v_NSRT001149", "v_NSRT001179", "v_NSRT001190", "v_NSRT001216", "v_NSRT001231", "v_NSRT001240", "v_NSRT001259", "v_NSRT001268", "v_NSRT001272", "v_NSRT001286", "v_NSRT001287", "v_NSRT001342", "v_NSRT001373", "v_NSRT001390", "v_NSRT001411", "v_NSRT001435", "v_NSRT001495", "v_NSRT001496", "v_NSRT001551", "v_NSRT001561", "v_NSRT001563", "v_NSRT001573", "v_NSRT001575", "v_NSRT001588", "v_NSRT001592", "v_NSRT001602", "v_NSRT001611", "v_NSRT001624", "v_NSRT001653", "v_NSRT001654", "v_NSRT001666", "v_NSRT001700", "v_NSRT001726", "v_NSRT001738", "v_NSRT001840", "v_NSRT001857", "v_NSRT001912", "v_NSRT001945", "v_NSRT002069", "v_NSRT002083", "v_NSRT002098", "v_NSRT002129", "v_NSRT002230", "v_NSRT000913", "v_NSRT000958", "v_NSRT000978", "v_NSRT000982", "v_NSRT001016", "v_NSRT001027", "v_NSRT001034", "v_NSRT001035", "v_NSRT001047", "v_NSRT001056", "v_NSRT001059", "v_NSRT001063", "v_NSRT001079", "v_NSRT001115", "v_NSRT001141", "v_NSRT001285", "v_NSRT001300", "v_NSRT001319", "v_NSRT001334", "v_NSRT001344", "v_NSRT001406", "v_NSRT001410", "v_NSRT001420", "v_NSRT001504", "v_NSRT001536", "v_NSRT001541", "v_NSRT001595", "v_NSRT001739", "v_NSRT001743", "v_NSRT001761", "v_NSRT001770", "v_NSRT001772", "v_NSRT001793", "v_NSRT001805", "v_NSRT001816", "v_NSRT001824", "v_NSRT001966", "v_NSRT001969", "v_NSRT002001", "v_NSRT002023", "v_NSRT002043", "v_NSRT002053", "v_NSRT002076", "v_NSRT002105", "v_NSRT002132", "v_NSRT002184", "v_NSRT002188", "v_NSRT002198", "v_NSRT002211", "v_NSRT002223", "v_NSRT000009", "v_NSRT000848", "v_NSRT000850", "v_NSRT000880", "v_NSRT000884", "v_NSRT000888", "v_NSRT000922", "v_NSRT000929", "v_NSRT000931", "v_NSRT000959", "v_NSRT000961", "v_NSRT000963", "v_NSRT000965", "v_NSRT000968", "v_NSRT000979", "v_NSRT000983", "v_NSRT000987", "v_NSRT000997", "v_NSRT001009", "v_NSRT001013", "v_NSRT001033", "v_NSRT001042", "v_NSRT001051", "v_NSRT001074", "v_NSRT001077", "v_NSRT001081", "v_NSRT001090", "v_NSRT001095", "v_NSRT001101", "v_NSRT001103", "v_NSRT001119", "v_NSRT001146", "v_NSRT001188", "v_NSRT001212", "v_NSRT001233", "v_NSRT001237", "v_NSRT001246", "v_NSRT001247", "v_NSRT001254", "v_NSRT001260", "v_NSRT001266", "v_NSRT001274", "v_NSRT001277", "v_NSRT001278", "v_NSRT001299", "v_NSRT001309", "v_NSRT001315", "v_NSRT001345", "v_NSRT001349", "v_NSRT001351", "v_NSRT001353", "v_NSRT001359", "v_NSRT001365", "v_NSRT001368", "v_NSRT001369", "v_NSRT001371", "v_NSRT001384", "v_NSRT001388", "v_NSRT001399", "v_NSRT001400", "v_NSRT001407", "v_NSRT001408", "v_NSRT001416", "v_NSRT001440", "v_NSRT001444", "v_NSRT001475", "v_NSRT001477", "v_NSRT001478", "v_NSRT001506", "v_NSRT001510", "v_NSRT001534", "v_NSRT001548", "v_NSRT001571", "v_NSRT001601", "v_NSRT001609", "v_NSRT001617", "v_NSRT001652", "v_NSRT001663", "v_NSRT001670", "v_NSRT001672", "v_NSRT001677", "v_NSRT001688", "v_NSRT001692", "v_NSRT001725", "v_NSRT001730", "v_NSRT001731", "v_NSRT001757", "v_NSRT001758", "v_NSRT001769", "v_NSRT001774", "v_NSRT001787", "v_NSRT001789", "v_NSRT001846", "v_NSRT001860", "v_NSRT001865", "v_NSRT001897", "v_NSRT001901", "v_NSRT001905", "v_NSRT001907", "v_NSRT001942", "v_NSRT001954", "v_NSRT001967", "v_NSRT001971", "v_NSRT001975", "v_NSRT001986", "v_NSRT001990", "v_NSRT001993", "v_NSRT002006", "v_NSRT002031", "v_NSRT002049", "v_NSRT002054", "v_NSRT002071", "v_NSRT002084", "v_NSRT002085", "v_NSRT002088", "v_NSRT002092", "v_NSRT002094", "v_NSRT002099", "v_NSRT002109", "v_NSRT002112", "v_NSRT002119", "v_NSRT002130", "v_NSRT002134", "v_NSRT002136", "v_NSRT002137", "v_NSRT002144", "v_NSRT002156", "v_NSRT002168", "v_NSRT002174", "v_NSRT002179", "v_NSRT002185", "v_NSRT002187", "v_NSRT002191", "v_NSRT002204", "v_NSRT002217", "v_NSRT002219", "v_NSRT002228", "v_NSRT002232", "v_NSRT002237", "v_NSRT002238", "v_NSRT002246", "v_NSRT002247", "v_NSRT002248", "v_NSRT002250", "v_NSRT002251", "v_NSRT002259", "v_NSRT002263", "v_NSRT002265", "v_NSRT002271", "v_NSRT002274", "v_NSRT002275", "v_NSRT000838", "v_NSRT000856", "v_NSRT000864", "v_NSRT000889", "v_NSRT000890", "v_NSRT000953", "v_NSRT001004", "v_NSRT001102", "v_NSRT001106", "v_NSRT002218", "v_NSRT000300", "v_NSRT001010", "v_NSRT001017", "v_NSRT001062", "v_NSRT001136", "v_NSRT001159", "v_NSRT001162", "v_NSRT001243", "v_NSRT001258", "v_NSRT001261", "v_NSRT001316", "v_NSRT001330", "v_NSRT001338", "v_NSRT001347", "v_NSRT001382", "v_NSRT001383", "v_NSRT001396", "v_NSRT001397", "v_NSRT001462", "v_NSRT001467", "v_NSRT001501", "v_NSRT001522", "v_NSRT001557", "v_NSRT001580", "v_NSRT001600", "v_NSRT001620", "v_NSRT001621", "v_NSRT001636", "v_NSRT001664", "v_NSRT001716", "v_NSRT001718", "v_NSRT001751", "v_NSRT001768", "v_NSRT001777", "v_NSRT001799", "v_NSRT001866", "v_NSRT001868", "v_NSRT001871", "v_NSRT001877", "v_NSRT001906", "v_NSRT001909", "v_NSRT001918", "v_NSRT001924", "v_NSRT001929", "v_NSRT001979", "v_NSRT002022", "v_NSRT002056", "v_NSRT002101", "v_NSRT002194", "v_NSRT002257", "v_NSRT002277", "v_NSRT000875", "v_NSRT000912", "v_NSRT000937", "v_NSRT000969", "v_NSRT000980", "v_NSRT000988", "v_NSRT000989", "v_NSRT001068", "v_NSRT001082", "v_NSRT001085", "v_NSRT001201", "v_NSRT001204", "v_NSRT001236", "v_NSRT001271", "v_NSRT001323", "v_NSRT001326", "v_NSRT001486", "v_NSRT001521", "v_NSRT001550", "v_NSRT001553", "v_NSRT001641", "v_NSRT001679", "v_NSRT001683", "v_NSRT001712", "v_NSRT001721", "v_NSRT001747", "v_NSRT001795", "v_NSRT001874", "v_NSRT001904", "v_NSRT001911", "v_NSRT001998", "v_NSRT002090", "v_NSRT002095", "v_NSRT002108", "v_NSRT002128", "v_NSRT002138", "v_NSRT002142", "v_NSRT002151", "v_NSRT002160", "v_NSRT002165", "v_NSRT002181", "v_NSRT002190", "v_NSRT002200", "v_NSRT002214", "v_NSRT002220", "v_NSRT002229", "v_NSRT002236", "v_NSRT002249", "v_NSRT002253", "v_NSRT002269", "v_NSRT002104", "v_NSRT002111", "v_NSRT002152", "v_NSRT002162", "v_NSRT002171", "v_NSRT002199", "v_NSRT002224", "v_NSRT002227", "v_NSRT002241", "v_NSRT002276"],
      //     fields: ["tm"]
      //   }),
      // });

      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // const json = await response.json();
      // console.log('Fetched data:', json);

      // const transformedMap = new Map(
      //   json.data.map(item => {
      //     const nodeId = item.key.split("_")[1];
      //     return [nodeId, item.data]; // [key, value]
      //   })
      // );
      // Generate the key list dynamically

      async function fetchAllNSRTData() {
        // 1. Generate keys v_NSRT000001 → v_NSRT005000
        const keys = [];
        for (let i = 1; i <= 5000; i++) {
          keys.push(`v_NSRT${String(i).padStart(6, "0")}`);
        }

        const batchSize = 200; // API can handle ~200 keys safely
        const transformedMap = new Map();

        for (let i = 0; i < keys.length; i += batchSize) {
          const batch = keys.slice(i, i + batchSize);

          try {
            const response = await fetch(
              "https://api.ms-tech.in/v14/get-multiple-hashes-4g",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keys: batch, fields: ["tm"] }),
              }
            );

            const json = await response.json();

            if (json?.data && Array.isArray(json.data)) {
              json.data.forEach((item) => {
                const nodeId = item.key.split("_")[1]; // v_NSRT000123 → NSRT000123
                transformedMap.set(nodeId, item.data);
              });
            }
          } catch (err) {
            console.error("Batch failed:", err);
          }
        }

        return transformedMap;
      }
      const transformedMap = await fetchAllNSRTData();




      const [starterResponse, meterResponse, tankResponse] = await Promise.all([
        fetch(API_URL + '/httpnodes').then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        }),
        fetch(API_URL + '/getlatestinstantanous').then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        }),
        fetch(API_URL + '/getlatesttank').then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
      ]);

      // Check status codes
      if (starterResponse.statusCode !== 200 ||
        meterResponse.statusCode !== 200 ||
        tankResponse.statusCode !== 200) {
        throw new Error('Invalid API response status');
      }

      // Extract data
      const starterData = starterResponse.data;
      const meterData = meterResponse.data;
      const tankData = tankResponse.data;

      // Filter starterData by allowedNodeIds
      // const filteredStarter = starterData.filter(item => allowedNodeIds.has(item.node_id));
      const filteredStarter = starterData;

      // Merge filteredStarter with meterData on node_id = gwid
      const mergedWithMeter = filteredStarter.map(starter => {
        const meter = meterData.find(m => m.gwid === starter.node_id) || {};
        const match = transformedMap.get(starter.node_id);
        return {
          ...starter,
          meterno: meter.meterno || null,
          realtimeclock: meter.realtimeclock || null,
          tm: match ? match.tm : null
        };
      });

      // Merge with tankData on rr_no
      const finalData = mergedWithMeter.map(item => {
        const tank = tankData.find(t => t.rr_no === item.rr_no) || {};
        return {
          ...item,
          tank_node: tank.tank_node || null,
          battery_percentage: tank.battery_percentage || null
        };
      });

      // Sort by realtimeclock (descending, nulls last)
      const sortedData = finalData.sort((a, b) => {
        const dateA = a.realtimeclock ? dayjs(a.realtimeclock, 'YYYY-M-D H:m:s') : null;
        const dateB = b.realtimeclock ? dayjs(b.realtimeclock, 'YYYY-M-D H:m:s') : null;
        if (!dateA || !dateA.isValid()) return 1;
        if (!dateB || !dateB.isValid()) return -1;
        return dateB.valueOf() - dateA.valueOf();
      });

      setRowData(sortedData);
      setFilterRow(sortedData);
      fetchWater()
      fetchNodes()

      const getUniqueOptions = (arr, key) => {
        const unique = [...new Set(
          arr?.map(item => item[key]?.toLowerCase())
        )];

        return unique.map(val => ({ label: val.toUpperCase(), value: val.toLowerCase() }));
      };


      // setDistrictOptions(getUniqueOptions(filtered, 'district'));
      setDistrictOptions([{ label: 'Bangalore', value: 'Bangalore' }])
      setTalukOptions(getUniqueOptions(sortedData, 'taluk'));

      const gps = [...new Set(
        sortedData
          ?.map(item => item.GPName)
          ?.filter(gp => gp !== "Arebommanhalli")
      )].sort();
      const villages = [...new Set(sortedData?.map(item => item.village))].sort();

      setGpOptions(gps?.map(item => ({ label: item, value: item })));
      setVillageOptions(villages?.map(item => ({ label: item, value: item })));
      // }


    }



    const fetchWater = async () => {
      const today = dayjs();
      const water = await fetch(API_URL + `/getInstalledWater`);
      const response = await water.json();
      const data = response.data?.filter(item => {
        const waterDate = dayjs(item.latest_water_date, 'YYYY-M-D H:m:s');
        return waterDate.isValid() &&
          waterDate.year() === today.year() &&
          waterDate.month() === today.month() &&
          waterDate.date() === today.date();
      });
      const waterData = response.data || [];
      setWaterData(data)

      setWaterTodayCount(data?.length ?? 0);
      setRowData(prev =>
        prev.map(row => {
          const match = waterData.find(item => item.node_id === row.node_id);
          return {
            ...row,
            latest_water_date: match ? match.latest_water_date : null, // add new key
          };
        })
      );
      setFilterRow(prev =>
        prev.map(row => {
          const match = waterData.find(item => item.node_id === row.node_id);
          return {
            ...row,
            latest_water_date: match ? match.latest_water_date : null, // add new key
          };
        })
      );
    }




    fetchData(); // Initial fetch on mount

    const fetchWaterInstalled = async () => {
      try {
        await fetch(`https://testhotel2.prysmcable.com/v35/getAllWaterMeter`, {
          method: "GET",
          headers: {
            "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap",
            "Content-Type": "application/json"
          }
        })
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json()
          })
          .then(response => {
            const data = response.data || [];
            setWaterInstCount(data.length ?? 0);
            setInstalledWater(data)
          })
      } catch (error) {
        console.log(error)
      }
    }
    fetchWaterInstalled();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Every 5 mins

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [])

  const fetchNodes = async () => {
    try {
      const res = await fetch('https://testhotel2.prysmcable.com/v35/getAllStarterNodes', {
        method: "GET",
        headers: {
          "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap", // replace with your API key
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      const waterData = data.data || [];

      setRowData(prev =>
        prev.map(row => {
          // Get last 4 characters of row.node_id
          const rowSuffix = row.node_id.slice(-4);

          // Find matching item in waterData using last 4 characters
          const match = waterData.find(item => item.node_id.slice(-4) === rowSuffix);

          return {
            ...row,
            lat: match ? match.latitude : null,
            long: match ? match.longitude : null,
            starterInstalled: match ? match.updated_at : null
          };
        })
      );

      setFilterRow(prev =>
        prev.map(row => {
          const rowSuffix = row.node_id.slice(-4);
          const match = waterData.find(item => item.node_id.slice(-4) === rowSuffix);

          return {
            ...row,
            lat: match ? match.latitude : null,
            long: match ? match.longitude : null
          };
        })
      );

    } catch (err) {
      console.error("Error fetching recent nodes:", err);
    }
  }


  // Apply all filters
  useEffect(() => {
    let filtered = [...rowData]
    let waterDatas = [...waterData]
    let installedwaters = Array.isArray(installedWater) ? [...installedWater] : [];
    const today = dayjs();




    // if (selectedDistrict) {
    //   filtered = filtered.filter(item => item.district === selectedDistrict.value)
    // }
    console.log("selectedTaluk", selectedTaluk, filtered)
    if (selectedTaluk) {
      filtered = filtered.filter(item => item.taluk === selectedTaluk.value.toUpperCase())
      const gps = [
        ...new Set(
          rowData
            ?.filter(item => item.taluk === selectedTaluk.value.toUpperCase() && item.GPName)
            .map(item => item.GPName)?.filter(gp => gp !== "Arebommanhalli")
        )
      ].sort();
      setGpOptions(gps.map(item => ({ label: item, value: item })));
      waterDatas = waterDatas.filter(item => item.taluk === selectedTaluk.value.toUpperCase())
      const watertoday = waterDatas.filter(item => {
        const waterDate = dayjs(item.latest_water_date, 'YYYY-M-D H:m:s');
        return waterDate.isValid() &&
          waterDate.year() === today.year() &&
          waterDate.month() === today.month() &&
          waterDate.date() === today.date();
      });
      setWaterTodayCount(watertoday?.length ?? 0);
      installedwaters = installedwaters.filter(item => item.taluk === selectedTaluk.value.toUpperCase())
      setWaterInstCount(installedwaters?.length ?? 0);

      // Filter Villages for the selected Taluk and remove duplicates
      const villages = [
        ...new Set(
          rowData
            ?.filter(item => item.taluk === selectedTaluk.value.toUpperCase() && item.village)
            .map(item => item.village)
        )
      ].sort();
      setVillageOptions(villages.map(item => ({ label: item, value: item })));
    }

    if (nodeIdFilter) {
      filtered = filtered.filter(item =>
        item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
      )
    }

    if (selectedGP) {
      filtered = filtered.filter(item => item.GPName === selectedGP.value);
      waterDatas = waterDatas.filter(item => item.GPName === selectedGP.value)
      const watertoday = waterDatas.filter(item => {
        const waterDate = dayjs(item.latest_water_date, 'YYYY-M-D H:m:s');
        return waterDate.isValid() &&
          waterDate.year() === today.year() &&
          waterDate.month() === today.month() &&
          waterDate.date() === today.date();
      });
      setWaterTodayCount(watertoday?.length ?? 0);
      installedwaters = installedwaters.filter(item => item.GPName === selectedGP.value)
      setWaterInstCount(installedwaters?.length ?? 0);

      const villages = [
        ...new Set(
          rowData
            ?.filter(item => item.GPName === selectedGP.value && item.village)
            .map(item => item.village)
        )
      ].sort();
      setVillageOptions(villages.map(item => ({ label: item, value: item })));
    }

    if (selectedVillage) {
      filtered = filtered.filter(item => item.village === selectedVillage.value);
      waterDatas = waterDatas.filter(item => item.village === selectedVillage.value)
      const watertoday = waterDatas.filter(item => {
        const waterDate = dayjs(item.latest_water_date, 'YYYY-M-D H:m:s');
        return waterDate.isValid() &&
          waterDate.year() === today.year() &&
          waterDate.month() === today.month() &&
          waterDate.date() === today.date();
      });
      setWaterTodayCount(watertoday?.length ?? 0);
      installedwaters = installedwaters.filter(item => item.village === selectedVillage.value)
      setWaterInstCount(installedwaters?.length ?? 0);
    }

    setFilterRow(filtered)
    setWaterTodayCount(waterDatas?.length ?? 0)
    setWaterInstCount(installedwaters?.length ?? 0)

  }, [selectedDistrict, selectedTaluk, nodeIdFilter, rowData, selectedGP, selectedVillage, waterData, installedWater])

  const handleCellRightClick = (event) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return;

    event.event.preventDefault(); // Prevent browser context menu
    const now = Date.now()
    const delta = now - lastRightClickRef.current
    lastRightClickRef.current = now
    if (delta < 400) {
      const nodeId = event.data?.node_id;
      if (nodeId) {
        navigate('/dashboard/energyByNodeIdhttp', {
          state: { node_id: nodeId }
        });
      }
    }
  };
  useEffect(() => {
    if (selectedGP) {
      const filteredVillages = rowData
        .filter(item => item.GPName === selectedGP.value)
        .map(item => item.village);

      const uniqueVillages = [...new Set(filteredVillages)]
        .sort()
        .map(v => ({
          label: v,
          value: v
        }));

      setVillageOptions(uniqueVillages);
      setSelectedVillage(null); // clear village when GP changes
    } else {
      // if GP not selected, show all villages sorted
      const allVillages = [...new Set(rowData.map(item => item.village))]
        .sort()
        .map(v => ({
          label: v,
          value: v
        }));
      setVillageOptions(allVillages);
    }
  }, [selectedGP, rowData]);
  const [tmTodayCount, setTmTodayCount] = useState(0);



  useEffect(() => {
    const today = dayjs();

    const todayEntries = [];
    const notTodayEntries = [];

    filterRow.forEach(item => {
      const tmDate = dayjs(item.tm, 'YYYY-M-D H:m:s');
      if (tmDate.isValid() &&
        tmDate.year() === today.year() &&
        tmDate.month() === today.month() &&
        tmDate.date() === today.date()) {
        todayEntries.push(item);
      } else {
        notTodayEntries.push(item);
      }
    });



    setTmTodayCount(todayEntries.length);
  }, [filterRow]);

  const [waterTodayCount, setWaterTodayCount] = useState(0);


  const [commandModalData, setCommandModalData] = useState([]);
  const [view, setView] = useState(false);

  const cardItems = [
    {
      label: 'Installed Starter Nodes',
      value: filterRow.length,
      color: '#4a90e2',
      icon: <FaBolt />,
    },
    {
      label: 'getTime Starter Nodes',
      value: tmTodayCount,
      color: '#50c878',
      icon: <FaClock />,
    },
    {
      label: 'Water Meter Installed',
      value: waterInstCount,
      color: '#f5a623',
      icon: <FaTint />,
    },

    {
      label: 'Water Meters Communicated',
      value: waterTodayCount,
      color: '#f5a623',
      icon: <FaTint />,
    },

  ];
  const today = dayjs().format('YYYY-MM-DD');
  const onExport = () => {
    gridApi.exportDataAsCsv({
      processCellCallback: (params) => {
        if (
          params.column.getColId() === 'tm' || // Node Status
          params.column.getColId() === 'realtimeclock' || // Last Seen (Energy)
          params.column.getColId() === 'latest_water_date' // Last Seen (Water)
        ) {
          const date = dayjs(params.value, 'YYYY-M-D H:m:s');
          return date.isValid() ? date.format('YYYY-MM-DD') : 'Not Communicated';
        }
        return params.value;
      }
    });
  };
  const [opens, setOpens] = useState('0');
  const toggles = id => {
    if (opens === id) {
      setOpens();
    } else {
      setOpens(id);
    }
  };

  return (
    <>
      {/* <Breadcrumb>
        <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem>
        <BreadcrumbItem active><a href="/dashboard/energymeterhttp">Energy Meter</a></BreadcrumbItem>
      </Breadcrumb> */}

      <h1>Dashboard</h1>

      <Row style={{ alignItems: 'center', display: 'flex', margin: "20px 0px" }}>
        <FilterSelect label="District" options={districtOptions} selected={selectedDistrict} onChange={setSelectedDistrict} control={control} name="district" />
        <FilterSelect label="Taluk" options={talukOptions} selected={selectedTaluk} onChange={setSelectedTaluk} control={control} name="taluk" />
        <FilterSelect label="GPName" options={gpOptions} selected={selectedGP} onChange={setSelectedGP} control={control} name="GPName" />
        <FilterSelect label="Village" options={villageOptions} selected={selectedVillage} onChange={setSelectedVillage} control={control} name="Village" />
        <Col md='2' sm='8'>
          <div className='mb-1'>
            <Label className='form-label'>Search</Label>
            <Input
              type='text'
              placeholder='Search anything...'
              onChange={(e) => {
                if (gridRef.current) {
                  gridRef.current.setQuickFilter(e.target.value);
                }
              }}
            />
          </div>
        </Col>
        {/* <Accordion open={open} toggle={toggleAccordion}>
          <AccordionItem>
            <AccordionHeader targetId="1">Energy Consumption Details On - {date ? new Date(date).toLocaleDateString() : 'N/A'}</AccordionHeader>

            <AccordionBody accordionId="1">
              <Row>
                <Col md='3' sm='6' xs='12'>
                  <div className='d-flex align-items-center'>
                    <div className='me-1'>
                      <FaBolt size={20} />
                    </div>
                    <div>
                      <h4 className='mb-0'>{dashboardSummary ? dashboardSummary.total_energy_consumed_today_kwh : '0'} kWh</h4>
                      <small className='text-muted'>Total Energy Consumed Today</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </AccordionBody>
          </AccordionItem>
        </Accordion> */}


        {/* Count Display */}
        {/* <Col md='12' sm='8' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div><h4 style={{ margin: '10px 0px' }}>Total Installed Count - {filterRow.length}</h4></div>
          <div><h4 style={{ margin: '10px 10px' }}>Node Status - {tmTodayCount}</h4></div>
          <div><h4 style={{ margin: '10px 10px' }}>Water Communicated - {waterTodayCount}</h4></div>

        </Col> */}
        {/* {filterRow && (
          <Card
            body
            style={{
              marginBottom: '30px',
              padding: '30px 40px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.06)',
              fontFamily: "'Poppins', sans-serif",
              color: '#2d3748',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <h4
              style={{
                marginBottom: '30px',
                fontWeight: '600',
                textAlign: 'center',
                fontSize: '1.4rem',
                color: '#2d3748',
                letterSpacing: '1px',
              }}
            >
              📊 Installation & Communication Summary
            </h4>
            <Row style={{ margin: 0, gap: '20px', justifyContent: 'center' }}>
              {cardItems.map(({ label, value, color, icon }, idx) => (
                <Col
                  key={idx}
                  md={2}
                  sm={6}
                  xs={12}
                  style={{
                    backgroundColor: '#f9f9fb',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div style={{ fontSize: '2rem', color, marginBottom: '10px' }}>{icon}</div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#718096',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {value}
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        )} */}

        {filterRow && (
          <Accordion open={opens} toggle={toggles} style={{ margin: '10px 0px' }}>
            <AccordionItem>
              <AccordionHeader targetId="1" style={{ fontWeight: '600', fontSize: '1.2rem' }}>
                📊 Installation & Communication Summary
              </AccordionHeader>
              <AccordionBody accordionId="1">
                <Card
                  body
                  style={{
                    marginBottom: '20px',
                    padding: '30px 40px',
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.06)',
                    fontFamily: "'Poppins', sans-serif",
                    color: '#2d3748',
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Row style={{ margin: 0, gap: '20px', justifyContent: 'center' }}>
                    {cardItems.map(({ label, value, color, icon }, idx) => (
                      <Col
                        key={idx}
                        md={2}
                        sm={6}
                        xs={12}
                        style={{
                          backgroundColor: '#f9f9fb',
                          borderRadius: '16px',
                          padding: '20px',
                          marginBottom: '20px',
                          textAlign: 'center',
                          transition: 'transform 0.2s',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <div style={{ fontSize: '2rem', color, marginBottom: '10px' }}>{icon}</div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#718096',
                            textTransform: 'uppercase',
                            marginBottom: '8px',
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            color,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {value}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        )}

      </Row>
      {/* <Row>
        <Button color="primary" className="mb-2 w-25" onClick={() => { downloadData() }} >
          Download Report
        </Button>



      </Row> */}
      {/* Grid */}
      <div className="ag-theme-alpine" style={{ height: '674px', width: '100%' }}>
        {filterRow.length > 0 ? (
          <AgGridReact
            ref={gridRef}
            rowData={filterRow}
            columnDefs={columnDefs}
            animateRows
            rowSelection="multiple"
            pagination
            paginationPageSize={12}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellContextMenu={handleCellRightClick}
            defaultExcelExportParams={{
              processCellCallback: (params) => {
                if (
                  params.column.getColId() === "tm" ||
                  params.column.getColId() === "realtimeclock" ||
                  params.column.getColId() === "latest_water_date"
                ) {
                  const date = dayjs(params.value, "YYYY-M-D H:m:s");
                  return date.isValid() ? date.format("DD-MM-YYYY") : "Not Communicated";
                }
                return params.value;
              }
            }}
            defaultCsvExportParams={{
              processCellCallback: (params) => {
                if (
                  params.column.getColId() === "tm" ||
                  params.column.getColId() === "realtimeclock" ||
                  params.column.getColId() === "latest_water_date"
                ) {
                  const date = dayjs(params.value, "YYYY-M-D H:m:s");
                  return date.isValid() ? date.format("DD-MM-YYYY") : "Not Communicated";
                }
                return params.value;
              }
            }}

          />
        ) : <Loader />}
      </div>
      {/* Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} style={{
        maxWidth: '95%',
        width: '95%',
        maxHeight: '90vh',
      }}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          Detailed Data for Node ID: {selectedNode}
        </ModalHeader>
        <ModalBody>
          <button className='btn btn-primary mb-2' onClick={async () => {
            setView(!view);

          }}>{view ? `View Get Time` : `View Get Command`}</button>
          {view ? <Table bordered responsive size="sm">
            <thead>
              <tr>
                {/* <th>IMEI</th> */}
                {/* <th>MEM</th> */}
                <th>CSQ</th>
                <th>CPSI</th>
                <th>Time</th>
                <th>CV</th>
                {/* <th>CID</th> */}
                <th>posttime</th>
              </tr>
            </thead>
            <tbody>
              {commandModalData.map((item, index) => (
                <tr key={index}>
                  {/* <td>{item.imei}</td> */}
                  {/* <td>{item.mem}</td> */}
                  <td>{item.csq}</td>
                  <td>
                    {item.cpsi?.startsWith("LTE")
                      ? (() => {
                        const parts = item.cpsi.split(',');
                        const eutran = parts[6];
                        const lastFour = parts.slice(-4);
                        return `${eutran || ""}, ${lastFour.join(',')}`;
                      })()
                      : item.cpsi}</td>
                  <td>{item.tm}</td>
                  <td>{item.cv}</td>
                  {/* <td>{item.cid}</td> */}
                  <td>{item?.posttime ?? "NA"}</td>
                </tr>
              ))}
            </tbody>
          </Table> : <Table bordered responsive size="sm">
            <thead>
              <tr>
                {/* <th>IMEI</th> */}
                {/* <th>MEM</th> */}
                <th>CSQ</th>
                <th>CPSI</th>
                <th>Time</th>
                <th>CV</th>
                <th>IP Time</th>
                <th>Water Time</th>
                {/* <th>CID</th> */}
                <th>Send Time</th>
              </tr>
            </thead>
            <tbody>
              {modalData.map((item, index) => (
                <tr key={index}>
                  {/* <td>{item.imei}</td> */}
                  {/* <td>{item.mem}</td> */}
                  <td>{item.csq}</td>
                  <td>
                    {item.cpsi?.startsWith("LTE")
                      ? (() => {
                        const parts = item.cpsi.split(',');
                        const eutran = parts[6];
                        const lastFour = parts.slice(-4);
                        return `${eutran || ""}, ${lastFour.join(',')}`;
                      })()
                      : item.cpsi}</td>
                  <td>{item.tm}</td>
                  <td>{item.cv}</td>
                  <td>{item.ip_time}</td>
                  <td>{item.water_time}</td>
                  {/* <td>{item.cid}</td> */}
                  <td>{item.senddata_time}</td>
                </tr>
              ))}
            </tbody>
          </Table>}
        </ModalBody>
      </Modal>

      <Modal isOpen={modalOpenWater} toggle={() => setModalOpenWater(!modalOpenWater)} style={{
        maxWidth: '93%',
        width: '93%',
        height: '90vh',
        // overflowY: 'scroll',
      }}>
        <ModalHeader toggle={() => setModalOpenWater(!modalOpenWater)}>
          Detailed Data for Node ID: {selectedNode}
        </ModalHeader>
        <ModalBody>
          <WaterMeterNodeHttp node_id={selectedNode} />
        </ModalBody>
      </Modal>

      {selectedData != null && <Modal isOpen={modalOpenEnergy} toggle={() => { setSelectedData(null); setModalOpenEnergy(!modalOpenEnergy) }} style={{
        maxWidth: '93%',
        width: '93%',
        height: '90vh',
        // overflowY: 'scroll',
      }}>
        <ModalHeader toggle={() => { setModalOpenEnergy(!modalOpenEnergy); setSelectedData(null) }}>
          Detailed Data for Node ID: {selectedData?.node_id}
        </ModalHeader>
        <ModalBody>
          {/* <EnergyMeterNodeHttp node_id={selectedNode} /> */}
          <LoadPop date={today} node_id={selectedData?.node_id} rr_no={selectedData.rr_no} GP={selectedData.GPName} />
        </ModalBody>
      </Modal>}
    </>
  )
}

const FilterSelect = ({ label, options, selected, onChange, control, name }) => (
  <Col md='2' sm='8'>
    <div className='mb-1'>
      <Label className='form-label'>{`Select ${label}`}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            isClearable
            value={selected}
            options={options}
            classNamePrefix='select'
            theme={selectThemeColors}
            className={classnames('react-select')}
            {...field}
            onChange={(val) => {
              field.onChange(val)
              onChange(val)
            }}
          />
        )}
      />
    </div>
  </Col>
)

export default OverView


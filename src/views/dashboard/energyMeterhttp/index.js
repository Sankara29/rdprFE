
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
  const [installedWater, setInstalledWater] = useState(0);
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
    { headerName: "battery", field: 'battery_percentage', maxWidth: 120 },


    {
      headerName: "Node Status", field: "tm", maxWidth: 240,
      valueGetter: (params) => params.data?.tm,
      valueFormatter: (params) => {


        const date = dayjs(params.value, 'YYYY-M-D H:m:s'); // handles "2025-7-21 11:3:00"
        return date.isValid() ? date.format('MMM-DD-YYYY H:m') : 'Not Communicated';
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
      headerName: 'Last Seen (Energy)',
      field: 'realtimeclock',
      maxWidth: 110,
      valueGetter: (params) => params.data?.realtimeclock,
      valueFormatter: (params) => {
        const noCommList = ['3300001', '1416910', '1608783', '1608780'];
        const meterno = params.data?.meterno;

        if (noCommList.includes(meterno)) return 'Not Communicated';

        const date = dayjs(params.value, 'YYYY-M-D H:m:s'); // handles "2025-7-21 11:3:00"
        return date.isValid() ? date.format('MMM-DD-YYYY') : '';
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
      headerName: 'Last Seen (water)',
      field: 'latest_water_date',
      maxWidth: 180,
      valueGetter: (params) => params.data?.latest_water_date,
      valueFormatter: (params) => {
        const noCommList = ['3300001', '1416910', '1608783', '1608780'];
        const meterno = params.data?.meterno;

        if (noCommList.includes(meterno)) return 'Not Communicated';

        const date = dayjs(params.value, 'YYYY-M-D H:m:s'); // handles "2025-7-21 11:3:00"
        return date.isValid() ? date.format('MMM-DD-YYYY') : 'Not Communicated';
      }, exportValueGetter: (params) => {
        const date = dayjs(params.value, "YYYY-M-D H:m:s");
        return date.isValid() ? date.format("YYYY-MM-DD") : "Not Communicated";
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



      const response = await fetch('https://api.ms-tech.in/v14/get-multiple-hashes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keys: ["v_NSRT000003", "v_NSRT000012", "v_NSRT000029", "v_NSRT000033", "v_NSRT000051", "v_NSRT000071", "v_NSRT000076", "v_NSRT000083", "v_NSRT000099", "v_NSRT000125", "v_NSRT000192", "v_NSRT000193", "v_NSRT000205", "v_NSRT000217", "v_NSRT000221", "v_NSRT000225", "v_NSRT000230", "v_NSRT000231", "v_NSRT000236", "v_NSRT000237", "v_NSRT000246", "v_NSRT000255", "v_NSRT000259", "v_NSRT000263", "v_NSRT000264", "v_NSRT000290", "v_NSRT000295", "v_NSRT000298", "v_NSRT000511", "v_NSRT000513", "v_NSRT000516", "v_NSRT000520", "v_NSRT000522", "v_NSRT000524", "v_NSRT000526", "v_NSRT000548", "v_NSRT000556", "v_NSRT000557", "v_NSRT000559", "v_NSRT000563", "v_NSRT000564", "v_NSRT000568", "v_NSRT000570", "v_NSRT000571", "v_NSRT000573", "v_NSRT000574", "v_NSRT000576", "v_NSRT000577", "v_NSRT000580", "v_NSRT000583", "v_NSRT000004", "v_NSRT000007", "v_NSRT000016", "v_NSRT000018", "v_NSRT000020", "v_NSRT000026", "v_NSRT000032", "v_NSRT000039", "v_NSRT000042", "v_NSRT000048", "v_NSRT000049", "v_NSRT000054", "v_NSRT000056", "v_NSRT000064", "v_NSRT000067", "v_NSRT000074", "v_NSRT000077", "v_NSRT000096", "v_NSRT000100", "v_NSRT000105", "v_NSRT000111", "v_NSRT000118", "v_NSRT000131", "v_NSRT000186", "v_NSRT000200", "v_NSRT000203", "v_NSRT000204", "v_NSRT000216", "v_NSRT000260", "v_NSRT000267", "v_NSRT000289", "v_NSRT000314", "v_NSRT000316", "v_NSRT000318", "v_NSRT000319", "v_NSRT000323", "v_NSRT000324", "v_NSRT000326", "v_NSRT000340", "v_NSRT000343", "v_NSRT000356", "v_NSRT000360", "v_NSRT000361", "v_NSRT000362", "v_NSRT000366", "v_NSRT000372", "v_NSRT000376", "v_NSRT000378", "v_NSRT000380", "v_NSRT000384", "v_NSRT000385", "v_NSRT000391", "v_NSRT000394", "v_NSRT000397", "v_NSRT000400", "v_NSRT000401", "v_NSRT000404", "v_NSRT000405", "v_NSRT000407", "v_NSRT000409", "v_NSRT000410", "v_NSRT000411", "v_NSRT000413", "v_NSRT000414", "v_NSRT000418", "v_NSRT000419", "v_NSRT000420", "v_NSRT000422", "v_NSRT000423", "v_NSRT000424", "v_NSRT000428", "v_NSRT000430", "v_NSRT000440", "v_NSRT000441", "v_NSRT000442", "v_NSRT000443", "v_NSRT000446", "v_NSRT000450", "v_NSRT000454", "v_NSRT000459", "v_NSRT000460", "v_NSRT000465", "v_NSRT000467", "v_NSRT000471", "v_NSRT000472", "v_NSRT000476", "v_NSRT000479", "v_NSRT000484", "v_NSRT000487", "v_NSRT000495", "v_NSRT000496", "v_NSRT000498", "v_NSRT000500", "v_NSRT000508", "v_NSRT000560", "v_NSRT000561", "v_NSRT000566", "v_NSRT000569", "v_NSRT000585", "v_NSRT000586", "v_NSRT000005", "v_NSRT000018", "v_NSRT000022", "v_NSRT000047", "v_NSRT000052", "v_NSRT000066", "v_NSRT000068", "v_NSRT000122", "v_NSRT000147", "v_NSRT000148", "v_NSRT000149", "v_NSRT000153", "v_NSRT000176", "v_NSRT000186", "v_NSRT000188", "v_NSRT000196", "v_NSRT000198", "v_NSRT000205", "v_NSRT000206", "v_NSRT000223", "v_NSRT000232", "v_NSRT000239", "v_NSRT000240", "v_NSRT000241", "v_NSRT000247", "v_NSRT000252", "v_NSRT000265", "v_NSRT000306", "v_NSRT000309", "v_NSRT000321", "v_NSRT000325", "v_NSRT000328", "v_NSRT000329", "v_NSRT000331", "v_NSRT000337", "v_NSRT000341", "v_NSRT000342", "v_NSRT000345", "v_NSRT000352", "v_NSRT000353", "v_NSRT000357", "v_NSRT000358", "v_NSRT000359", "v_NSRT000364", "v_NSRT000368", "v_NSRT000369", "v_NSRT000370", "v_NSRT000379", "v_NSRT000386", "v_NSRT000392", "v_NSRT000398", "v_NSRT000407", "v_NSRT000415", "v_NSRT000417", "v_NSRT000421", "v_NSRT000425", "v_NSRT000431", "v_NSRT000437", "v_NSRT000438", "v_NSRT000439", "v_NSRT000445", "v_NSRT000447", "v_NSRT000449", "v_NSRT000453", "v_NSRT000457", "v_NSRT000461", "v_NSRT000464", "v_NSRT000466", "v_NSRT000468", "v_NSRT000473", "v_NSRT000474", "v_NSRT000475", "v_NSRT000477", "v_NSRT000478", "v_NSRT000480", "v_NSRT000481", "v_NSRT000482", "v_NSRT000483", "v_NSRT000485", "v_NSRT000486", "v_NSRT000488", "v_NSRT000489", "v_NSRT000490", "v_NSRT000491", "v_NSRT000493", "v_NSRT000529", "v_NSRT000531", "v_NSRT000532", "v_NSRT000534", "v_NSRT000537", "v_NSRT000539", "v_NSRT000540", "v_NSRT000541", "v_NSRT000542", "v_NSRT000543", "v_NSRT000544", "v_NSRT000545", "v_NSRT000546", "v_NSRT000555", "v_NSRT000558", "v_NSRT000008", "v_NSRT000030", "v_NSRT000037", "v_NSRT000115", "v_NSRT000141", "v_NSRT000143", "v_NSRT000150", "v_NSRT000185", "v_NSRT000202", "v_NSRT000220", "v_NSRT000268", "v_NSRT000305", "v_NSRT000315", "v_NSRT000330", "v_NSRT000346", "v_NSRT000371", "v_NSRT000373", "v_NSRT000436", "v_NSRT000470", "v_NSRT000492", "v_NSRT000499", "v_NSRT000547", "v_NSRT000572", "v_NSRT000597", "v_NSRT000598", "v_NSRT000599", "v_NSRT000600", "v_NSRT000601", "v_NSRT000602", "v_NSRT000603", "v_NSRT000604", "v_NSRT000605", "v_NSRT000606", "v_NSRT000607", "v_NSRT000608", "v_NSRT000609", "v_NSRT000610", "v_NSRT000611", "v_NSRT000612", "v_NSRT000613", "v_NSRT000614", "v_NSRT000615", "v_NSRT000616", "v_NSRT000617", "v_NSRT000618", "v_NSRT000619", "v_NSRT000620", "v_NSRT000621", "v_NSRT000622", "v_NSRT000623", "v_NSRT000035", "v_NSRT000080", "v_NSRT000139", "v_NSRT000189", "v_NSRT000226", "v_NSRT000245", "v_NSRT000256", "v_NSRT000286", "v_NSRT000301", "v_NSRT000303", "v_NSRT000304", "v_NSRT000347", "v_NSRT000351", "v_NSRT000387", "v_NSRT000388", "v_NSRT000408", "v_NSRT000420", "v_NSRT000014", "v_NSRT000171", "v_NSRT000162", "v_NSRT000514", "v_NSRT000545", "v_NSRT000082", "v_NSRT000348", "v_NSRT000272", "v_NSRT000019", "v_NSRT000248", "v_NSRT000505", "v_NSRT000078", "v_NSRT000389", "v_NSRT000159", "v_NSRT000235", "v_NSRT000242", "v_NSRT000194", "v_NSRT000201", "v_NSRT000142", "v_NSRT000044", "v_NSRT000174", "v_NSRT000167", "v_NSRT000554", "v_NSRT000062", "v_NSRT000124", "v_NSRT000429", "v_NSRT000462", "v_NSRT000307", "v_NSRT000017", "v_NSRT000521", "v_NSRT000382", "v_NSRT000501", "v_NSRT000158", "v_NSRT000123", "v_NSRT000091", "v_NSRT000578", "v_NSRT000444", "v_NSRT000152", "v_NSRT000166", "v_NSRT000342", "v_NSRT000434", "v_NSRT000509", "v_NSRT000550", "v_NSRT000374", "v_NSRT000244", "v_NSRT000281", "v_NSRT000136", "v_NSRT000169", "v_NSRT000112", "v_NSRT000519", "v_NSRT000399", "v_NSRT000469", "v_NSRT000276", "v_NSRT000163", "v_NSRT000523", "v_NSRT000053", "v_NSRT000144", "v_NSRT000512", "v_NSRT000363", "v_NSRT000390", "v_NSRT000322", "v_NSRT000134", "v_NSRT000403", "v_NSRT000180", "v_NSRT000293", "v_NSRT000092", "v_NSRT000176", "v_NSRT000086", "v_NSRT000402", "v_NSRT000349", "v_NSRT000565", "v_NSRT000510", "v_NSRT000334", "v_NSRT000515", "v_NSRT000338", "v_NSRT000095", "v_NSRT000006", "v_NSRT000010", "v_NSRT000027", "v_NSRT000043", "v_NSRT000050", "v_NSRT000069", "v_NSRT000084", "v_NSRT000097", "v_NSRT000098", "v_NSRT000102", "v_NSRT000104", "v_NSRT000105", "v_NSRT000110", "v_NSRT000113", "v_NSRT000120", "v_NSRT000128", "v_NSRT000130", "v_NSRT000132", "v_NSRT000146", "v_NSRT000156", "v_NSRT000165", "v_NSRT000168", "v_NSRT000169", "v_NSRT000172", "v_NSRT000179", "v_NSRT000184", "v_NSRT000187", "v_NSRT000207", "v_NSRT000209", "v_NSRT000215", "v_NSRT000228", "v_NSRT000243", "v_NSRT000266", "v_NSRT000285", "v_NSRT000297", "v_NSRT000310", "v_NSRT000312", "v_NSRT000313", "v_NSRT000339", "v_NSRT000355", "v_NSRT000377", "v_NSRT000396", "v_NSRT000406", "v_NSRT000452", "v_NSRT000515", "v_NSRT000518", "v_NSRT000023", "v_NSRT000025", "v_NSRT000028", "v_NSRT000031", "v_NSRT000057", "v_NSRT000059", "v_NSRT000063", "v_NSRT000065", "v_NSRT000072", "v_NSRT000085", "v_NSRT000090", "v_NSRT000094", "v_NSRT000095", "v_NSRT000106", "v_NSRT000117", "v_NSRT000129", "v_NSRT000133", "v_NSRT000137", "v_NSRT000145", "v_NSRT000160", "v_NSRT000197", "v_NSRT000208", "v_NSRT000210", "v_NSRT000211", "v_NSRT000222", "v_NSRT000233", "v_NSRT000238", "v_NSRT000258", "v_NSRT000270", "v_NSRT000274", "v_NSRT000275", "v_NSRT000284", "v_NSRT000291", "v_NSRT000292", "v_NSRT000294", "v_NSRT000311", "v_NSRT000344", "v_NSRT000375", "v_NSRT000381", "v_NSRT000411", "v_NSRT000455", "v_NSRT000502", "v_NSRT000517", "v_NSRT000553", "v_NSRT000562", "v_NSRT000567", "v_NSRT000575", "v_NSRT000579", "v_NSRT000582", "v_NSRT000587", "v_NSRT000645", "v_NSRT000647", "v_NSRT000648", "v_NSRT000649", "v_NSRT000650", "v_NSRT000653", "v_NSRT000655", "v_NSRT000657", "v_NSRT000659", "v_NSRT000661", "v_NSRT000662", "v_NSRT000663", "v_NSRT000664", "v_NSRT000665", "v_NSRT000666", "v_NSRT000667", "v_NSRT000669", "v_NSRT000670", "v_NSRT000671", "v_NSRT000672", "v_NSRT000673", "v_NSRT000674", "v_NSRT000675", "v_NSRT000677", "v_NSRT000678", "v_NSRT000679", "v_NSRT000681", "v_NSRT000683", "v_NSRT000684", "v_NSRT000685", "v_NSRT000686", "v_NSRT000687", "v_NSRT000688", "v_NSRT000689", "v_NSRT000690", "v_NSRT000691", "v_NSRT000692", "v_NSRT000693", "v_NSRT000694", "v_NSRT000695", "v_NSRT000696", "v_NSRT000697", "v_NSRT000698", "v_NSRT000700", "v_NSRT000701", "v_NSRT000702", "v_NSRT000703", "v_NSRT000743", "v_NSRT000747", "v_NSRT000761", "v_NSRT000668", "v_NSRT000676", "v_NSRT000704", "v_NSRT000705", "v_NSRT000706", "v_NSRT000707", "v_NSRT000708", "v_NSRT000709", "v_NSRT000711", "v_NSRT000712", "v_NSRT000714", "v_NSRT000715", "v_NSRT000716", "v_NSRT000720", "v_NSRT000721", "v_NSRT000722", "v_NSRT000723", "v_NSRT000725", "v_NSRT000726", "v_NSRT000729", "v_NSRT000731", "v_NSRT000732", "v_NSRT000733", "v_NSRT000734", "v_NSRT000735", "v_NSRT000736", "v_NSRT000737", "v_NSRT000738", "v_NSRT000739", "v_NSRT000740", "v_NSRT000741", "v_NSRT000742", "v_NSRT000744", "v_NSRT000745", "v_NSRT000746", "v_NSRT000748", "v_NSRT000749", "v_NSRT000750", "v_NSRT000751", "v_NSRT000752", "v_NSRT000753", "v_NSRT000754", "v_NSRT000755", "v_NSRT000756", "v_NSRT000757", "v_NSRT000758", "v_NSRT000759", "v_NSRT000760", "v_NSRT000763", "v_NSRT000764", "v_NSRT000160", "v_NSRT000640", "v_NSRT000402", "v_NSRT000058", "v_NSRT000222", "v_NSRT000772", "v_NSRT000766", "v_NSRT000682", "v_NSRT000783", "v_NSRT000774", "v_NSRT000809", "v_NSRT000699", "v_NSRT000805", "v_NSRT000808", "v_NSRT000076", "v_NSRT000793", "v_NSRT000775", "v_NSRT000641", "v_NSRT000280", "v_NSRT000251", "v_NSRT000234", "v_NSRT000121", "v_NSRT000045", "v_NSRT000365", "v_NSRT000107", "v_NSRT000182", "v_NSRT000219", "v_NSRT000634", "v_NSRT000123", "v_NSRT000178", "v_NSRT000114", "v_NSRT000140", "v_NSRT000161", "v_NSRT000494", "v_NSRT000535", "v_NSRT000117", "v_NSRT000137", "v_NSRT000642", "v_NSRT000337", "v_NSRT000282", "v_NSRT000034", "v_NSRT000218", "v_NSRT000393", "v_NSRT000626", "v_NSRT000639", "v_NSRT000041", "v_NSRT000213", "v_NSRT000162", "v_NSRT000436", "v_NSRT000294", "v_NSRT000786", "v_NSRT000656", "v_NSRT000274", "v_NSRT000719", "v_NSRT000658", "v_NSRT000802", "v_NSRT000762", "v_NSRT000070", "v_NSRT000646", "v_NSRT000785", "v_NSRT000724", "v_NSRT000801", "v_NSRT000660", "v_NSRT000654", "v_NSRT000448", "v_NSRT000680", "v_NSRT000771", "v_NSRT000727", "v_NSRT000717", "v_NSRT000728", "v_NSRT000796", "v_NSRT000791", "v_NSRT000800", "v_NSRT000810", "v_NSRT000730", "v_NSRT000768"],
          fields: ["tm"]
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const json = await response.json();
      console.log('Fetched data:', json);

      const transformedMap = new Map(
        json.data.map(item => {
          const nodeId = item.key.split("_")[1];
          return [nodeId, item.data]; // [key, value]
        })
      );
      const allowedNodeIds = new Set(["NSRT000003", "NSRT000012", "NSRT000029", "NSRT000033", "NSRT000051", "NSRT000071", "NSRT000076", "NSRT000083", "NSRT000099", "NSRT000125", "NSRT000192", "NSRT000193", "NSRT000205", "NSRT000217", "NSRT000221", "NSRT000225", "NSRT000230", "NSRT000231", "NSRT000236", "NSRT000237", "NSRT000246", "NSRT000255", "NSRT000259", "NSRT000263", "NSRT000264", "NSRT000290", "NSRT000295", "NSRT000298", "NSRT000511", "NSRT000513", "NSRT000516", "NSRT000520", "NSRT000522", "NSRT000524", "NSRT000526", "NSRT000548", "NSRT000556", "NSRT000557", "NSRT000559", "NSRT000563", "NSRT000564", "NSRT000568", "NSRT000570", "NSRT000571", "NSRT000573", "NSRT000574", "NSRT000576", "NSRT000577", "NSRT000580", "NSRT000583", "NSRT000004", "NSRT000007", "NSRT000016", "NSRT000018", "NSRT000020", "NSRT000026", "NSRT000032", "NSRT000039", "NSRT000042", "NSRT000048", "NSRT000049", "NSRT000054", "NSRT000056", "NSRT000064", "NSRT000067", "NSRT000074", "NSRT000077", "NSRT000096", "NSRT000100", "NSRT000105", "NSRT000111", "NSRT000118", "NSRT000131", "NSRT000186", "NSRT000200", "NSRT000203", "NSRT000204", "NSRT000216", "NSRT000260", "NSRT000267", "NSRT000289", "NSRT000314", "NSRT000316", "NSRT000318", "NSRT000319", "NSRT000323", "NSRT000324", "NSRT000326", "NSRT000340", "NSRT000343", "NSRT000356", "NSRT000360", "NSRT000361", "NSRT000362", "NSRT000366", "NSRT000372", "NSRT000376", "NSRT000378", "NSRT000380", "NSRT000384", "NSRT000385", "NSRT000391", "NSRT000394", "NSRT000397", "NSRT000400", "NSRT000401", "NSRT000404", "NSRT000405", "NSRT000407", "NSRT000409", "NSRT000410", "NSRT000411", "NSRT000413", "NSRT000414", "NSRT000418", "NSRT000419", "NSRT000420", "NSRT000422", "NSRT000423", "NSRT000424", "NSRT000428", "NSRT000430", "NSRT000440", "NSRT000441", "NSRT000442", "NSRT000443", "NSRT000446", "NSRT000450", "NSRT000454", "NSRT000459", "NSRT000460", "NSRT000465", "NSRT000467", "NSRT000471", "NSRT000472", "NSRT000476", "NSRT000479", "NSRT000484", "NSRT000487", "NSRT000495", "NSRT000496", "NSRT000498", "NSRT000500", "NSRT000508", "NSRT000560", "NSRT000561", "NSRT000566", "NSRT000569", "NSRT000585", "NSRT000586", "NSRT000005", "NSRT000018", "NSRT000022", "NSRT000047", "NSRT000052", "NSRT000066", "NSRT000068", "NSRT000122", "NSRT000147", "NSRT000148", "NSRT000149", "NSRT000153", "NSRT000176", "NSRT000186", "NSRT000188", "NSRT000196", "NSRT000198", "NSRT000205", "NSRT000206", "NSRT000223", "NSRT000232", "NSRT000239", "NSRT000240", "NSRT000241", "NSRT000247", "NSRT000252", "NSRT000265", "NSRT000306", "NSRT000309", "NSRT000321", "NSRT000325", "NSRT000328", "NSRT000329", "NSRT000331", "NSRT000337", "NSRT000341", "NSRT000342", "NSRT000345", "NSRT000352", "NSRT000353", "NSRT000357", "NSRT000358", "NSRT000359", "NSRT000364", "NSRT000368", "NSRT000369", "NSRT000370", "NSRT000379", "NSRT000386", "NSRT000392", "NSRT000398", "NSRT000407", "NSRT000415", "NSRT000417", "NSRT000421", "NSRT000425", "NSRT000431", "NSRT000437", "NSRT000438", "NSRT000439", "NSRT000445", "NSRT000447", "NSRT000449", "NSRT000453", "NSRT000457", "NSRT000461", "NSRT000464", "NSRT000466", "NSRT000468", "NSRT000473", "NSRT000474", "NSRT000475", "NSRT000477", "NSRT000478", "NSRT000480", "NSRT000481", "NSRT000482", "NSRT000483", "NSRT000485", "NSRT000486", "NSRT000488", "NSRT000489", "NSRT000490", "NSRT000491", "NSRT000493", "NSRT000529", "NSRT000531", "NSRT000532", "NSRT000534", "NSRT000537", "NSRT000539", "NSRT000540", "NSRT000541", "NSRT000542", "NSRT000543", "NSRT000544", "NSRT000545", "NSRT000546", "NSRT000555", "NSRT000558", "NSRT000008", "NSRT000030", "NSRT000037", "NSRT000115", "NSRT000141", "NSRT000143", "NSRT000150", "NSRT000185", "NSRT000202", "NSRT000220", "NSRT000268", "NSRT000305", "NSRT000315", "NSRT000330", "NSRT000346", "NSRT000371", "NSRT000373", "NSRT000436", "NSRT000470", "NSRT000492", "NSRT000499", "NSRT000547", "NSRT000572", "NSRT000597", "NSRT000598", "NSRT000599", "NSRT000600", "NSRT000601", "NSRT000602", "NSRT000603", "NSRT000604", "NSRT000605", "NSRT000606", "NSRT000607", "NSRT000608", "NSRT000609", "NSRT000610", "NSRT000611", "NSRT000612", "NSRT000613", "NSRT000614", "NSRT000615", "NSRT000616", "NSRT000617", "NSRT000618", "NSRT000619", "NSRT000620", "NSRT000621", "NSRT000622", "NSRT000623", "NSRT000035", "NSRT000080", "NSRT000139", "NSRT000189", "NSRT000226", "NSRT000245", "NSRT000256", "NSRT000286", "NSRT000301", "NSRT000303", "NSRT000304", "NSRT000347", "NSRT000351", "NSRT000387", "NSRT000388", "NSRT000408", "NSRT000420", 'NSRT000014', "NSRT000171", "NSRT000162", "NSRT000514", "NSRT000545", "NSRT000082", "NSRT000348", "NSRT000272", "NSRT000019", "NSRT000248", "NSRT000505", "NSRT000078", "NSRT000389", "NSRT000159", "NSRT000235", "NSRT000242", "NSRT000194", "NSRT000201", "NSRT000142", "NSRT000044", "NSRT000174", "NSRT000167", "NSRT000554", "NSRT000062", "NSRT000124", "NSRT000429", "NSRT000462", "NSRT000307", "NSRT000017", "NSRT000521", "NSRT000382", "NSRT000501", "NSRT000158", "NSRT000123", "NSRT000091", "NSRT000578", "NSRT000444", "NSRT000152", "NSRT000166", "NSRT000342", "NSRT000434", "NSRT000509", "NSRT000550", "NSRT000374", "NSRT000244", "NSRT000281", "NSRT000136", "NSRT000169", "NSRT000112", "NSRT000519", "NSRT000399", "NSRT000469", "NSRT000276", "NSRT000163", "NSRT000523", "NSRT000053", "NSRT000144", "NSRT000512", "NSRT000363", "NSRT000390", "NSRT000322", "NSRT000134", "NSRT000403", "NSRT000180", "NSRT000293", "NSRT000092", "NSRT000176", "NSRT000086", "NSRT000402", "NSRT000349", "NSRT000565", "NSRT000510", "NSRT000334", "NSRT000515", "NSRT000338", "NSRT000095", "NSRT000006", "NSRT000010", "NSRT000027", "NSRT000043", "NSRT000050", "NSRT000069", "NSRT000084", "NSRT000097", "NSRT000098", "NSRT000102", "NSRT000104", "NSRT000105", "NSRT000110", "NSRT000113", "NSRT000120", "NSRT000128", "NSRT000130", "NSRT000132", "NSRT000146", "NSRT000156", "NSRT000165", "NSRT000168", "NSRT000169", "NSRT000172", "NSRT000179", "NSRT000184", "NSRT000187", "NSRT000207", "NSRT000209", "NSRT000215", "NSRT000228", "NSRT000243", "NSRT000266", "NSRT000285", "NSRT000297", "NSRT000310", "NSRT000312", "NSRT000313", "NSRT000339", "NSRT000355", "NSRT000377", "NSRT000396", "NSRT000406", "NSRT000452", "NSRT000515", "NSRT000518", "NSRT000023", "NSRT000025", "NSRT000028", "NSRT000031", "NSRT000057", "NSRT000059", "NSRT000063", "NSRT000065", "NSRT000072", "NSRT000085", "NSRT000090", "NSRT000094", "NSRT000095", "NSRT000106", "NSRT000117", "NSRT000129", "NSRT000133", "NSRT000137", "NSRT000145", "NSRT000160", "NSRT000197", "NSRT000208", "NSRT000210", "NSRT000211", "NSRT000222", "NSRT000233", "NSRT000238", "NSRT000258", "NSRT000270", "NSRT000274", "NSRT000275", "NSRT000284", "NSRT000291", "NSRT000292", "NSRT000294", "NSRT000311", "NSRT000344", "NSRT000375", "NSRT000381", "NSRT000411", "NSRT000455", "NSRT000502", "NSRT000517", "NSRT000553", "NSRT000562", "NSRT000567", "NSRT000575", "NSRT000579", "NSRT000582", "NSRT000587", "NSRT000645", "NSRT000647", "NSRT000648", "NSRT000649", "NSRT000650", "NSRT000653", "NSRT000655", "NSRT000657", "NSRT000659", "NSRT000661", "NSRT000662", "NSRT000663", "NSRT000664", "NSRT000665", "NSRT000666", "NSRT000667", "NSRT000669", "NSRT000670", "NSRT000671", "NSRT000672", "NSRT000673", "NSRT000674", "NSRT000675", "NSRT000677", "NSRT000678", "NSRT000679", "NSRT000681", "NSRT000683", "NSRT000684", "NSRT000685", "NSRT000686", "NSRT000687", "NSRT000688", "NSRT000689", "NSRT000690", "NSRT000691", "NSRT000692", "NSRT000693", "NSRT000694", "NSRT000695", "NSRT000696", "NSRT000697", "NSRT000698", "NSRT000700", "NSRT000701", "NSRT000702", "NSRT000703", "NSRT000743", "NSRT000747", "NSRT000761", "NSRT000668", "NSRT000676", "NSRT000704", "NSRT000705", "NSRT000706", "NSRT000707", "NSRT000708", "NSRT000709", "NSRT000711", "NSRT000712", "NSRT000714", "NSRT000715", "NSRT000716", "NSRT000720", "NSRT000721", "NSRT000722", "NSRT000723", "NSRT000725", "NSRT000726", "NSRT000729", "NSRT000731", "NSRT000732", "NSRT000733", "NSRT000734", "NSRT000735", "NSRT000736", "NSRT000737", "NSRT000738", "NSRT000739", "NSRT000740", "NSRT000741", "NSRT000742", "NSRT000744", "NSRT000745", "NSRT000746", "NSRT000748", "NSRT000749", "NSRT000750", "NSRT000751", "NSRT000752", "NSRT000753", "NSRT000754", "NSRT000755", "NSRT000756", "NSRT000757", "NSRT000758", "NSRT000759", "NSRT000760", "NSRT000763", "NSRT000764", "NSRT000160", "NSRT000640", "NSRT000402", "NSRT000058", "NSRT000222", "NSRT000772", "NSRT000766", "NSRT000682", "NSRT000783", "NSRT000774", "NSRT000809", "NSRT000699", "NSRT000805", "NSRT000808", "NSRT000076", "NSRT000793", "NSRT000775", "NSRT000641", "NSRT000280", "NSRT000251", "NSRT000234", "NSRT000121", "NSRT000045", "NSRT000365", "NSRT000107", "NSRT000182", "NSRT000219", "NSRT000634", "NSRT000123", "NSRT000178", "NSRT000114", "NSRT000140", "NSRT000161", "NSRT000494", "NSRT000535", "NSRT000117", "NSRT000137", "NSRT000642", "NSRT000337", "NSRT000282", "NSRT000034", "NSRT000218", "NSRT000393", "NSRT000626", "NSRT000639", "NSRT000041", "NSRT000213", "NSRT000162", "NSRT000436", "NSRT000294", "NSRT000786", "NSRT000656", "NSRT000274", "NSRT000719", "NSRT000658", "NSRT000802", "NSRT000762", "NSRT000070", "NSRT000646", "NSRT000785", "NSRT000724", "NSRT000801", "NSRT000660", "NSRT000654", "NSRT000448", "NSRT000680", "NSRT000771", "NSRT000727", "NSRT000717", "NSRT000728", "NSRT000796", "NSRT000791", "NSRT000800", "NSRT000810", "NSRT000730", "NSRT000768"]);

      // const insta = await fetch(API_URL + `/getInstalledNode`)


      // if (!insta.ok) throw new Error(`HTTP error! status: ${insta.status}`);
      // const instadata = await insta.json()
      // const filtered = instadata?.data?.filter(item => allowedNodeIds.has(item.node_id));
      // console.log(filtered)


      // // if (filtered && filtered?.length) {
      //   const sortedData = filtered
      //     ?.map(item => {
      //       const match = transformedMap.get(item.node_id); // lookup by node_id
      //       return {
      //         ...item,
      //         realtimeclock: item.realtimeclock,
      //         tm: match ? match.tm : null // safely map tm if found
      //       };
      //     })
      //     ?.sort((a, b) => {
      //       const dateA = dayjs(a.realtimeclock, 'YYYY-M-D H:m:s');
      //       const dateB = dayjs(b.realtimeclock, 'YYYY-M-D H:m:s');

      //       if (!dateA.isValid()) return 1;
      //       if (!dateB.isValid()) return -1;

      //       return dateB.valueOf() - dateA.valueOf(); // descending
      //     });

      //   setRowData(sortedData);
      //   setFilterRow(sortedData);


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
      const filteredStarter = starterData.filter(item => allowedNodeIds.has(item.node_id));

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

      const getUniqueOptions = (arr, key) =>
        [...new Set(arr?.map(item => item[key]))]?.map(val => ({ label: val, value: val }));

      // setDistrictOptions(getUniqueOptions(filtered, 'district'));
      setDistrictOptions([{ label: 'Bangalore', value: 'Bangalore' }])
      setTalukOptions(getUniqueOptions(sortedData, 'taluk'));

      const gps = [...new Set(sortedData?.map(item => item.GPName))].sort();
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
            setInstalledWater(data.length)
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
            long: match ? match.longitude : null
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


    if (selectedDistrict) {
      filtered = filtered.filter(item => item.district === selectedDistrict.value)
    }

    if (selectedTaluk) {
      filtered = filtered.filter(item => item.taluk === selectedTaluk.value)
      const gps = [
        ...new Set(
          rowData
            ?.filter(item => item.taluk === selectedTaluk.value && item.GPName)
            .map(item => item.GPName)
        )
      ].sort();
      setGpOptions(gps.map(item => ({ label: item, value: item })));

      // Filter Villages for the selected Taluk and remove duplicates
      const villages = [
        ...new Set(
          rowData
            ?.filter(item => item.taluk === selectedTaluk.value && item.village)
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
      setWaterTodayCount(waterDatas?.length ?? 0);

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
    }

    setFilterRow(filtered)
    setWaterTodayCount(waterDatas?.length ?? 0)
  }, [selectedDistrict, selectedTaluk, nodeIdFilter, rowData, selectedGP, selectedVillage, waterData])

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
      value: installedWater,
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

  return (
    <>
      {/* <Breadcrumb>
        <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem>
        <BreadcrumbItem active><a href="/dashboard/energymeterhttp">Energy Meter</a></BreadcrumbItem>
      </Breadcrumb> */}

      <h1>Project Status</h1>

      <Row style={{ alignItems: 'center', display: 'flex' }}>
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
        {filterRow && (
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


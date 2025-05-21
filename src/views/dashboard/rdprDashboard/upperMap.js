// // MapComponent.js
// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix for default icon issue
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });


// const customIcon = (iconUrl) =>
//     new L.Icon({
//         iconUrl,
//         iconSize: [25, 41],
//         iconAnchor: [12, 41],
//     });

// // Custom icon paths
// const iconBlue = 'path/to/blue-icon.png';
// const iconRed = 'path/to/red-icon.png';
// const iconGreen = 'path/to/green-icon.png';
// const iconPurple = 'path/to/purple-icon.png';

// const MapComponent = () => {
//     const markers = [
//         { position: [12.9715987, 77.5945627], type: 'blue' },
//         { position: [12.9615987, 77.5845627], type: 'red' },
//         { position: [12.9515987, 77.5745627], type: 'green' },
//         { position: [12.9415987, 77.5645627], type: 'purple' },
//     ];

//     const iconMap = {
//         blue: iconBlue,
//         red: iconRed,
//         green: iconGreen,
//         purple: iconPurple,
//     };

//     return (
//         <div style={{ marginTop:'-100px'  }}>

//         <Card  style={{marginTop:'100px'}}>
//             <CardBody style={{ padding: 10,height: '620px', width: '480px',border: '1px solid #ddd' }}>


//                     <MapContainer center={[12.9715987, 77.5945627]} zoom={13} style={{ height: '100%', width: '100%' }}>
//                         <TileLayer
//                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                         />
//                         {markers.map((marker, index) => (
//                             <Marker key={index} position={marker.position} icon={customIcon(iconMap[marker.type])}>
//                                 <Popup>
//                                     <Card style={{ width: '200px' }}>
//                                         <CardBody>
//                                             <CardTitle tag="h5">Devanahalli</CardTitle>
//                                             <CardText>
//                                                 Gram Panchayat: 23
//                                                 <br />
//                                                 Village: 12
//                                                 <br />
//                                                 Pumps: 10
//                                                 <br />
//                                                 Tank: 50
//                                             </CardText>
//                                         </CardBody>
//                                     </Card>
//                                 </Popup>
//                             </Marker>
//                         ))}
//                     </MapContainer>



//             </CardBody>
//         </Card>
//         </div>

//     );
// };

// export default MapComponent;






import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import { getData } from "../service";
import { useNavigate } from "react-router-dom";

const NodeMap = () => {
    const [feeders, setFeeders] = useState([]);
    const [nodeDetails, setNodeDetails] = useState([]);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const router = useNavigate();
    const [liveData, setLiveData] = useState(null)
    const [bill, setBill] = useState(null)

    useEffect(() => {
        const auth = sessionStorage.getItem('auth');
        const currentUrl = window.location.href;

        // If there's no auth and the current URL is not 'https://rdpr.vercel.app/'
        if (!auth && currentUrl.startsWith('https://rdpr-mst-survey.vercel.app/')) {
            navigate('/');
        }
    }, []);

    const fetchData = async () => {
        try {
            const locations = await fetch(`https://testhotel2.prysmcable.com/v25/getAllStarterNodes`);
            const location = await locations.json();
            const feederData = location.data;
            setFeeders(feederData);

            const response = await fetch('https://testpms.ms-tech.in/v15/getInstalledNode');
            const jsonData = await response.json();
            setNodeDetails(jsonData?.data || []);


            const res = await fetch('https://testpms.ms-tech.in/v15/getLiveWaterEnergy')
            const data = await res.json();
            setLiveData(data?.data || [])

            const bill = await fetch('https://testpms.ms-tech.in/v15/getBillingReport')
            const billData = await bill.json();
            // console.log(billData.data, "$$$$$$$$$$$")
            setBill(billData?.data)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, []);

    const getMarkerIcon = (status) => {
        const match = nodeDetails.find(item =>
            item.node_id?.slice(-4) === status?.slice(-4)
        );
        let iconPath = "/red.png";

        if (match) {
            const dataTime = new Date(match.captureddatetime);
            const now = new Date();
            const diffMins = (now - dataTime) / 1000 / 60;
            iconPath = diffMins <= 45 ? "/blue.png" : "/red.png";
        }

        return L.icon({
            iconUrl: iconPath,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
        });
    };

    const handleMarkerClick = async (feederId, locationDetails) => {
        setDetails(null)
        setLoading(true);
        try {
            const match = nodeDetails.find(item =>
                item.node_id?.slice(-4) === feederId?.slice(-4)
            );
            const dataTime = match ? new Date(match.captureddatetime) : null;
            const now = new Date();
            const diffMins = match ? (now - dataTime) / 1000 / 60 : Infinity;

            const communicated = diffMins <= 45;

            const detailsMatch = liveData.find(item => item.node_id?.slice(-4) === feederId?.slice(-4));
            const billsMatch = bill.length > 0 && bill?.filter(item => item.gwid?.slice(-4) === feederId?.slice(-4));
            const detailData = {
                node_id: match?.node_id || "N/A",
                meter: match?.meterno || "N/A",
                rr_no: match?.rr_no || "N/A",
                district: match?.district || "N/A",
                taluk: match?.taluk || "N/A",
                village: match?.village || "N/A",
                GPName: match?.GPName || "N/A",
                live_Energy: detailsMatch?.live_energy_data || "Nill",
                live_Water: detailsMatch?.live_water_data || "Nill",
                billing: Array.isArray(billsMatch) && billsMatch.length
                    ? billsMatch[billsMatch.length - 1]?.cumKwhImp ?? "N/A"
                    : "N/A",
                billingDate: Array.isArray(billsMatch) && billsMatch.length
                    ? billsMatch[billsMatch.length - 1]?.month_start ?? "N/A"
                    : "N/A",
                location: `https://www.google.com/maps/search/?api=1&query=${match.latitude},${match.longitude}` || "N/A",
                communicated,
            };

            setDetails(detailData);

            // Only add if not already selected
            const isAlreadySelected = selectedLocations.some(loc =>
                loc.node_id === detailData.node_id
            );
            if (!isAlreadySelected) {
                setSelectedLocations(prev => [...prev, { ...locationDetails, ...detailData }]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const headers = ["Village", "Latitude", "Longitude", "Node ID", "RR No", "Location"];
        const rows = selectedLocations.map(loc =>
            [
                loc.village,
                loc.latitude,
                loc.longitude,
                loc.node_id,
                loc.rr_no,
                `"${loc.location}"` // Wrap location in quotes
            ]
        );

        const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "selected_locations.csv";
        a.click();
        URL.revokeObjectURL(url);
    };


    const openInGoogleMaps = (lat, lng) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
    };

    return (
        <div style={{ width: "80%", height: "80%", position: "relative", borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: "95%", margin: '10px 0px', alignItems: 'center' }}>
                {/* <h4 onClick={() => router(-1)} style={{ cursor: "pointer" }}>&#x2B05; Back</h4> */}
                <h4>Map View</h4>
                {/* <button onClick={handleDownload} style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>Download CSV</button> */}
            </div>

            <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: "100%", width: "100%", borderRadius: '10px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {feeders.map(feeder => (
                    // <Marker
                    //   key={feeder.id}
                    //   position={[feeder.latitude, feeder.longitude]}
                    //   icon={getMarkerIcon(feeder.node_id)}
                    //   eventHandlers={{
                    //     click: () => handleMarkerClick(feeder.node_id, feeder),
                    //   }}
                    // >
                    <Marker
                        key={feeder.id}
                        position={[feeder.latitude, feeder.longitude]}
                        icon={L.divIcon({
                            html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="background: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">
          ${feeder.village || "Unknown"}
        </div>
        <img src="${getMarkerIcon(feeder.node_id).options.iconUrl}" width="30" height="30" />
      </div>
    `,
                            className: "custom-div-icon",
                            iconSize: [30, 42],
                            iconAnchor: [15, 42],
                            popupAnchor: [0, -30],
                        })}
                        eventHandlers={{
                            click: () => handleMarkerClick(feeder.node_id, feeder),
                        }}
                    >
                        <Popup>
                            {loading ? (
                                <p>Loading details...</p>
                            ) : details ? (
                                <>
                                    <p><b>Node Id:</b> {details.node_id}</p>
                                    <p><b>Meter No:</b> {details.meter}</p>
                                    <p><b>RR No:</b> {details.rr_no}</p>
                                    <p><b>District:</b> {details.district}</p>
                                    <p><b>Taluk:</b> {details.taluk}</p>
                                    <p><b>Village:</b> {details.village}</p>
                                    <p><b>GP Name:</b> {details.GPName}</p>
                                    <p><b>Live Energy:</b> {details.live_Energy}</p>
                                    <p><b>Live Water:</b> {details.live_Water}</p>
                                    <p>
                                        <b>Last Billing:</b>{" "}
                                        {isFinite(Number(details.billing))
                                            ? (Number(details.billing) / 1000).toFixed(2) + " Kwh"
                                            : "Nill"}
                                    </p>
                                    <p>
                                        <b>Last Billing Date:</b>{" "}
                                        {details.billingDate}
                                    </p>

                                    <p>
                                        <b>Communicated:</b>{" "}
                                        <span style={{ color: details.communicated ? "green" : "red" }}>
                                            ● {details.communicated ? "Yes" : "No"}
                                        </span>
                                    </p>
                                    <button onClick={() => openInGoogleMaps(feeder.latitude, feeder.longitude)}
                                        style={{ marginTop: "5px", padding: "5px", background: "#007bff", color: "white", border: "none", borderRadius: '6px' }}>
                                        View Direction
                                    </button>
                                </>
                            ) : <p>No data found</p>}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Floating Selected Info Panel */}
            {/* {selectedLocations.length > 0 && (
                <div style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    width: "300px",
                    maxHeight: "300px",
                    overflowY: "auto",
                    background: "#fff",
                    padding: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    borderRadius: "10px",
                    zIndex: 1000
                }}>
                    <h4>Selected Locations</h4>
                    <ul style={{ paddingLeft: "20px" }}>
                        {selectedLocations.map((loc, idx) => (
                            <li key={idx}>
                                <b>{loc.village}</b> – {loc.latitude}, {loc.longitude}
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    );
};

export default NodeMap;
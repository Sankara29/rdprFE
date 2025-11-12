// // Rewritten NodeMap using @react-google-maps/api

// import React, { useState, useEffect } from "react";
// import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";
// import { useNavigate } from "react-router-dom";


// const containerStyle = {
//     width: "100%",
//     height: "100%"
// };

// const center = {
//     lat: 12.9716,
//     lng: 77.5946
// };

// const NodeMap = () => {
//     const [feeders, setFeeders] = useState([]);
//     const [details, setDetails] = useState(null);
//     const [selected, setSelected] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [selectedLocations, setSelectedLocations] = useState([]);
//     const router = useNavigate();


//     const [nodeDetails, setNodeDetails] = useState([]);

//     const fetchData = async () => {
//         try {
//             const installed = await fetch("https://testpms.ms-tech.in/v15/httpnodes")
//             const installedData = await installed.json();
//             const location = await fetch(`https://testhotel2.prysmcable.com/v35/getAllStarterNodes`, {
//                 method: "GET",
//                 headers: {
//                     "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap",
//                     "Content-Type": "application/json"
//                 }
//             });
//             const locationData = await location.json();

//             const instantanous = await fetch("https://testpms.ms-tech.in/v15/getlatestinstantanous")
//             const instantanousData = await instantanous.json();
//             const mergedData = installedData.data.map(loc => {
//                 const match = instantanousData.data.find(item => !item.node_id?.startsWith("NSGW") && item.gwid?.slice(-4) === loc.node_id?.slice(-4));
//                 const nodeLoc = locationData.data.find(item => item.node_id?.slice(-4) === loc.node_id?.slice(-4));
//                 console.log("Merging for node_id:", loc.node_id, "Found match:", match, "Found location:", nodeLoc);
//                 return { ...loc, ...match, ...nodeLoc };
//             });
//             // setFeeders(mergedData);
//             console.log(mergedData);
//             setNodeDetails(mergedData);

//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//         const interval = setInterval(fetchData, 300000);
//         return () => clearInterval(interval);
//     }, []);

//     const handleMarkerClick = async (feeder, lat, lng) => {
//         setDetails(null);
//         setSelected({ lat, lng });
//         setLoading(true);
//         try {
//             const match = nodeDetails.find(item =>
//                 !item.node_id?.startsWith("NSGW") &&
//                 item.node_id?.slice(-4) === feeder?.node_id?.slice(-4)
//             );

//             const dataTime = match ? new Date(match.realtimeclock) : null;
//             const now = new Date();
//             const startOfToday = new Date();
//             startOfToday.setHours(0, 0, 0, 0);

//             // Check if dataTime is within today
//             const isToday = dataTime && dataTime >= startOfToday && dataTime <= now;
//             // const diffMins = match ? (now - dataTime) / 1000 / 60 : Infinity;
//             // const communicated = diffMins <= 45;
//             const communicated = isToday;



//             const detailData = {
//                 node_id: feeder?.node_id ?? (match?.node_id || "N/A"),


//                 rr_no: match?.rr_no || "N/A",
//                 district: match?.district || "N/A",
//                 taluk: match?.taluk || "N/A",
//                 village: match?.village || "N/A",
//                 GPName: match?.GPName || "N/A",
//                 location: `https://www.google.com/maps/search/?api=1&query=${match?.latitude},${match?.longitude}`,
//                 communicated
//             };

//             setDetails(detailData);

//             const isAlreadySelected = selectedLocations.some(loc => loc.node_id === detailData.node_id);
//             if (!isAlreadySelected) {
//                 setSelectedLocations(prev => [...prev, { ...feeder, ...detailData }]);
//             }
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDownload = () => {
//         const headers = ["Village", "Latitude", "Longitude", "Node ID", "RR No", "Location"];
//         const rows = selectedLocations.map(loc => [
//             loc.village,
//             loc.latitude,
//             loc.longitude,
//             loc.node_id,
//             loc.rr_no,
//             `"${loc.location}"`
//         ]);
//         const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
//         const blob = new Blob([csv], { type: "text/csv" });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "selected_locations.csv";
//         a.click();
//         URL.revokeObjectURL(url);
//     };
//     const getMarkerIcon = (status) => {
//         const match = nodeDetails.find(item =>
//             !item.node_id?.startsWith("NSGW") &&
//             item.node_id?.slice(-4) === status?.slice(-4)
//         );

//         // console.log("Match for marker icon:", match);
//         let iconPath = "/red.png";

//         if (match) {
//             const dataTime = new Date(match.realtimeclock);
//             const now = new Date();
//             const startOfToday = new Date();
//             startOfToday.setHours(0, 0, 0, 0);

//             const isToday = dataTime && dataTime >= startOfToday && dataTime <= now;
//             const diffMins = (now - dataTime) / 1000 / 60;
//             iconPath = isToday ? "/blue.png" : "/red.png";
//         }

//         if (!(window.google && window.google.maps)) return undefined;

//         return {
//             url: iconPath,
//             scaledSize: new window.google.maps.Size(30, 30),
//             anchor: new window.google.maps.Point(15, 30),
//         };
//     };
//     return (
//         <div style={{ width: "100%", height: "80vh" }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
//                 <h4 onClick={() => router(-1)} style={{ cursor: "pointer" }}></h4>
//                 <h2>Starter Node Installed</h2>
//                 <button onClick={handleDownload} style={{ marginTop: "5px", padding: "5px", background: "#007bff", color: "white", border: "none", borderRadius: '6px' }}>Download CSV</button>
//             </div>
//             <LoadScript googleMapsApiKey="AIzaSyBcVEASQUZyZzPauv09vgorl5Lr990eRyU">
//                 <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
//                     {nodeDetails.map((feeder, idx) => (
//                         <Marker
//                             key={idx}
//                             position={{ lat: parseFloat(feeder.latitude), lng: parseFloat(feeder.longitude) }}
//                             icon={getMarkerIcon(feeder.node_id)}
//                             onClick={() => handleMarkerClick(feeder, parseFloat(feeder.latitude), parseFloat(feeder.longitude))}
//                         // label={feeder.village || "Unknown"}
//                         />

//                     ))}

//                     {selected && details && (
//                         <InfoWindow position={selected} onCloseClick={() => setSelected(null)} >
//                             <div style={{ maxWidth: 250 }}>
//                                 {loading ? (<p>Loading details...</p>) : (
//                                     <>
//                                         <p><b>Node Id:</b> {details.node_id}</p>

//                                         <p><b>RR No:</b> {details.rr_no}</p>
//                                         <p><b>District:</b> {details.district}</p>
//                                         <p><b>Taluk:</b> {details.taluk}</p>
//                                         <p><b>Village:</b> {details.village}</p>
//                                         <p><b>GP Name:</b> {details.GPName}</p>
//                                         <button onClick={() => window.open(details.location, "_blank")} style={{ marginTop: "5px", padding: "5px", background: "#007bff", color: "white", border: "none", borderRadius: '6px' }}>View Direction</button>
//                                     </>
//                                 )}
//                             </div>
//                         </InfoWindow>
//                     )}
//                 </GoogleMap>
//             </LoadScript>

//             {/* {selectedLocations.length > 0 && (
//                 <div style={{ position: "absolute", bottom: 20, right: 30, background: "white", padding: 10, maxHeight: 300, overflowY: "auto", borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
//                     <h4>Selected Locations</h4>
//                     <ul>
//                         {selectedLocations.map((loc, idx) => (
//                             <li key={idx}><b>{loc.village}</b> – {loc.latitude}, {loc.longitude}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )} */}
//         </div>
//     );
// };

// export default NodeMap;

import React, { useState, useEffect, useMemo } from "react";
import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const containerStyle = {
    width: "100%",
    height: "100%"
};

const center = {
    lat: 12.9716,
    lng: 77.5946
};

const NodeMap = () => {
    const [feeders, setFeeders] = useState([]); // raw httpnodes data
    const [nodeDetails, setNodeDetails] = useState([]);
    const [details, setDetails] = useState(null);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);

    // Filters
    const [filters, setFilters] = useState({
        GPName: "",
        village: "",
        rr_no: "",
        taluk: ""
    });

    const router = useNavigate();

    const fetchData = async () => {
        try {
            const installed = await fetch("https://testpms.ms-tech.in/v15/httpnodes");
            const installedData = await installed.json();
            setFeeders(installedData.data || []);

            const location = await fetch(`https://testhotel2.prysmcable.com/v35/getAllStarterNodes`, {
                method: "GET",
                headers: {
                    "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap",
                    "Content-Type": "application/json"
                }
            });
            const locationData = await location.json();

            const instantanous = await fetch("https://testpms.ms-tech.in/v15/getlatestinstantanous");
            const instantanousData = await instantanous.json();

            const mergedData = installedData.data.map(loc => {
                const match = instantanousData.data.find(item => !item.node_id?.startsWith("NSGW") && item.gwid?.slice(-4) === loc.node_id?.slice(-4));
                const nodeLoc = locationData.data.find(item => item.node_id?.slice(-4) === loc.node_id?.slice(-4));
                return { ...loc, ...match, ...nodeLoc };
            });

            setNodeDetails(mergedData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, []);

    // Derived unique filter options
    const uniqueOptions = useMemo(() => {
        const getUnique = key => [...new Set(feeders.map(f => f[key]).filter(Boolean))];
        return {
            GPNames: getUnique("GPName"),
            villages: getUnique("village"),
            rrNos: getUnique("rr_no"),
            taluks: getUnique("taluk")
        };
    }, [feeders]);

    // Filtered node details
    const filteredNodes = useMemo(() => {
        return nodeDetails.filter(node => {
            return (
                (!filters.GPName || node.GPName === filters.GPName) &&
                (!filters.village || node.village === filters.village) &&
                (!filters.rr_no || node.rr_no === filters.rr_no) &&
                (!filters.taluk || node.taluk === filters.taluk)
            );
        });
    }, [nodeDetails, filters]);

    const handleMarkerClick = async (feeder, lat, lng) => {
        setDetails(null);
        setSelected({ lat, lng });
        setLoading(true);
        try {
            const match = nodeDetails.find(item =>
                !item.node_id?.startsWith("NSGW") &&
                item.node_id?.slice(-4) === feeder?.node_id?.slice(-4)
            );

            const dataTime = match ? new Date(match.realtimeclock) : null;
            const now = new Date();
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const isToday = dataTime && dataTime >= startOfToday && dataTime <= now;

            const detailData = {
                node_id: feeder?.node_id ?? (match?.node_id || "N/A"),
                rr_no: match?.rr_no || "N/A",
                district: match?.district || "N/A",
                taluk: match?.taluk || "N/A",
                village: match?.village || "N/A",
                GPName: match?.GPName || "N/A",
                location: `https://www.google.com/maps/search/?api=1&query=${match?.latitude},${match?.longitude}`,
                communicated: isToday
            };

            setDetails(detailData);

            const isAlreadySelected = selectedLocations.some(loc => loc.node_id === detailData.node_id);
            if (!isAlreadySelected) {
                setSelectedLocations(prev => [...prev, { ...feeder, ...detailData }]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const headers = ["Village", "Latitude", "Longitude", "Node ID", "RR No", "Location"];
        const rows = selectedLocations.map(loc => [
            loc.village,
            loc.latitude,
            loc.longitude,
            loc.node_id,
            loc.rr_no,
            `"${loc.location}"`
        ]);
        const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "selected_locations.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const getMarkerIcon = status => {
        const match = nodeDetails.find(item =>
            !item.node_id?.startsWith("NSGW") && item.node_id?.slice(-4) === status?.slice(-4)
        );
        let iconPath = "/red.png";

        if (match) {
            const dataTime = new Date(match.realtimeclock);
            const now = new Date();
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const isToday = dataTime && dataTime >= startOfToday && dataTime <= now;
            iconPath = isToday ? "/blue.png" : "/red.png";
        }

        if (!(window.google && window.google.maps)) return undefined;
        return {
            url: iconPath,
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 30)
        };
    };
    const dropdownStyle = {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: "white",
        fontSize: "14px",
        cursor: "pointer",
        flex: "1 1 200px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    };


    return (
        <div style={{ width: "100%", height: "80vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                <h4 onClick={() => router(-1)} style={{ cursor: "pointer" }}></h4>
                <h2>Starter Node Installed</h2>
                {/* <button
                    onClick={handleDownload}
                    style={{
                        marginTop: "5px",
                        padding: "5px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px"
                    }}
                >
                    Download CSV
                </button> */}
                <h4></h4>
            </div>

            {/* Filter Section */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    padding: "12px 20px",
                    background: "#f8f9fa",
                    borderRadius: "10px",
                    margin: "10px 20px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    alignItems: "center",
                }}
            >
                {/* Taluk Select */}
                <select
                    value={filters.taluk}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFilters({
                            taluk: value,
                            GPName: "",
                            village: "",
                            rr_no: ""
                        });
                    }}
                    style={dropdownStyle}
                >
                    <option value="">All Taluks</option>
                    {[...new Set(feeders.map((f) => f.taluk).filter(Boolean))].map((t, i) => (
                        <option key={i} value={t}>
                            {t}
                        </option>
                    ))}
                </select>

                {/* GPName Select (Filtered by Taluk) */}
                <select
                    value={filters.GPName}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFilters((prev) => ({
                            ...prev,
                            GPName: value,
                            village: "",
                            rr_no: ""
                        }));
                    }}
                    style={dropdownStyle}
                >
                    <option value="">All GP Names</option>
                    {feeders
                        .filter((f) =>
                            filters.taluk ? f.taluk === filters.taluk : true
                        )
                        .map((f) => f.GPName)
                        .filter(Boolean)
                        .filter((v, i, a) => a.indexOf(v) === i) // unique
                        .map((g, i) => (
                            <option key={i} value={g}>
                                {g}
                            </option>
                        ))}
                </select>

                {/* Village Select (Filtered by GPName + Taluk) */}
                <select
                    value={filters.village}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFilters((prev) => ({
                            ...prev,
                            village: value,
                            rr_no: ""
                        }));
                    }}
                    style={dropdownStyle}
                >
                    <option value="">All Villages</option>
                    {feeders
                        .filter((f) =>
                            filters.taluk ? f.taluk === filters.taluk : true
                        )
                        .filter((f) =>
                            filters.GPName ? f.GPName === filters.GPName : true
                        )
                        .map((f) => f.village)
                        .filter(Boolean)
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .map((v, i) => (
                            <option key={i} value={v}>
                                {v}
                            </option>
                        ))}
                </select>

                {/* RR No Select (Filtered by Village + GPName + Taluk) */}
                <select
                    value={filters.rr_no}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, rr_no: e.target.value }))
                    }
                    style={dropdownStyle}
                >
                    <option value="">All RR Nos</option>
                    {feeders
                        .filter((f) =>
                            filters.taluk ? f.taluk === filters.taluk : true
                        )
                        .filter((f) =>
                            filters.GPName ? f.GPName === filters.GPName : true
                        )
                        .filter((f) =>
                            filters.village ? f.village === filters.village : true
                        )
                        .map((f) => f.rr_no)
                        .filter(Boolean)
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .map((r, i) => (
                            <option key={i} value={r}>
                                {r}
                            </option>
                        ))}
                </select>

                {/* Reset Filters Button */}
                <button
                    onClick={() =>
                        setFilters({ taluk: "", GPName: "", village: "", rr_no: "" })
                    }
                    style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    Reset Filters
                </button>
            </div>


            <LoadScript googleMapsApiKey="AIzaSyBcVEASQUZyZzPauv09vgorl5Lr990eRyU">
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                    {filteredNodes.map((feeder, idx) => (
                        <Marker
                            key={idx}
                            position={{
                                lat: parseFloat(feeder.latitude),
                                lng: parseFloat(feeder.longitude)
                            }}
                            icon={getMarkerIcon(feeder.node_id)}
                            onClick={() =>
                                handleMarkerClick(
                                    feeder,
                                    parseFloat(feeder.latitude),
                                    parseFloat(feeder.longitude)
                                )
                            }
                        />
                    ))}

                    {selected && details && (
                        <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
                            <div style={{ maxWidth: 250 }}>
                                {loading ? (
                                    <p>Loading details...</p>
                                ) : (
                                    <>
                                        <p>
                                            <b>Node Id:</b> {details.node_id}
                                        </p>
                                        <p>
                                            <b>RR No:</b> {details.rr_no}
                                        </p>
                                        <p>
                                            <b>District:</b> {details.district}
                                        </p>
                                        <p>
                                            <b>Taluk:</b> {details.taluk}
                                        </p>
                                        <p>
                                            <b>Village:</b> {details.village}
                                        </p>
                                        <p>
                                            <b>GP Name:</b> {details.GPName}
                                        </p>
                                        <button
                                            onClick={() => window.open(details.location, "_blank")}
                                            style={{
                                                marginTop: "5px",
                                                padding: "5px",
                                                background: "#007bff",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "6px"
                                            }}
                                        >
                                            View Direction
                                        </button>
                                    </>
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>

            {/* {selectedLocations.length > 0 && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 20,
                        right: 30,
                        background: "white",
                        padding: 10,
                        maxHeight: 300,
                        overflowY: "auto",
                        borderRadius: 10,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
                    }}
                >
                    <h4>Selected Locations</h4>
                    <ul>
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

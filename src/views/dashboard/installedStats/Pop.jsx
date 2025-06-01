

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// const styles = {
//     container: {
//         padding: "10px",
//         backgroundColor: "#f9f9f9",
//         fontFamily: "Arial, sans-serif",
//         width: "100%",
//         // height: "450px",
//     },
//     toggleWrapper: {
//         display: "flex",
//         justifyContent: "center",
//         margin: "15px 0",
//     },
//     toggleGroup: {
//         display: "flex",
//         backgroundColor: "#e0e0e0",
//         borderRadius: "50px",
//         padding: "4px",
//         gap: "5px",
//     },
//     toggleButton: (active) => ({
//         padding: "8px 18px",
//         borderRadius: "50px",
//         border: "none",
//         backgroundColor: active ? "#4CAF50" : "transparent",
//         color: active ? "#fff" : "#333",
//         fontSize: "14px",
//         fontWeight: active ? "bold" : "normal",
//         cursor: "pointer",
//         transition: "all 0.3s ease",
//     }),
//     transitionBox: {
//         width: "100%",
//         // maxWidth: "1100px",
//         margin: "0 auto",
//         minHeight: "60vh",
//     },
//     heading: {
//         textAlign: "center",
//         margin: "10px 0",
//         fontSize: "18px",
//     },
//     gridWrapper: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
//         gap: "15px",
//         padding: "5px",
//     },
//     imageCard: {
//         borderRadius: "8px",
//         overflow: "hidden",
//         boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
//         cursor: "pointer",
//     },
//     table: {
//         width: "100%",
//         borderCollapse: "collapse",
//     },
//     th: {
//         backgroundColor: "#4CAF50",
//         color: "#fff",
//         padding: "6px",
//         fontSize: "13px",
//     },
//     td: {
//         padding: "6px",
//         fontSize: "12px",
//         borderBottom: "1px solid #ddd",
//     },
//     modalOverlay: {
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         backgroundColor: "rgba(0,0,0,0.8)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 1000,
//     },
//     modalContent: {
//         backgroundColor: "#fff",
//         padding: "10px",
//         borderRadius: "8px",
//         maxWidth: "80vw",
//         maxHeight: "80vh",
//         position: "relative",
//     },
//     closeButton: {
//         position: "absolute",
//         top: 8,
//         right: 12,
//         fontSize: "24px",
//         background: "none",
//         border: "none",
//         cursor: "pointer",
//     },
//     modalImage: {
//         maxWidth: "100%",
//         maxHeight: "70vh",
//         objectFit: "contain",
//     }
// };

// const Pop = ({ rrno, data, image }) => {
//     const navigate = useNavigate();
//     const [selectedTab, setSelectedTab] = useState("images");
//     const [energyMeterImage, setEnergyMeterImage] = useState([]);
//     const [waterMeterImage, setWaterMeterImage] = useState([]);
//     const [neutralImage, setNeutralImage] = useState([]);
//     const [nodeImage, setNodeImage] = useState([]);
//     const [selectedImage, setSelectedImage] = useState(null);

//     useEffect(() => {
//         if (image?.length) {
//             setEnergyMeterImage(image.filter(i => i.imagetype === 1));
//             setWaterMeterImage(image.filter(i => i.imagetype === 2));
//             setNeutralImage(image.filter(i => i.imagetype === 3));
//             setNodeImage(image.filter(i => i.imagetype === 5));
//         }
//     }, [image]);

//     const openModal = (url) => setSelectedImage(url);
//     const closeModal = () => setSelectedImage(null);

//     const renderImageGrid = (title, images) => (
//         <div style={{ marginBottom: "20px" }}>
//             <h3 style={styles.heading}>{title}</h3>
//             {images.length > 0 ? (
//                 <div style={styles.gridWrapper}>
//                     {images.map((img, idx) => (
//                         <div
//                             key={idx}
//                             style={styles.imageCard}
//                             onClick={() => openModal(`https://testhotel2.prysmcable.com/v24/images/${img.documentID}`)}
//                         >
//                             <img
//                                 src={`https://testhotel2.prysmcable.com/v24/images/${img.documentID}`}
//                                 alt={`Image ${idx + 1}`}
//                                 style={{ width: "100%", height: "150px", objectFit: "cover" }}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>No images available</p>
//             )}
//         </div>
//     );

//     const renderTable = (title, meters, headers, getRowData) => (
//         <div style={{ marginBottom: "20px" }}>
//             <h3 style={styles.heading}>{title}</h3>
//             <table style={styles.table}>
//                 <thead>
//                     <tr>
//                         {headers.map((header, i) => (
//                             <th key={i} style={styles.th}>{header}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {meters.map((meter, idx) => (
//                         <tr key={idx} style={{ backgroundColor: idx % 2 ? "#f2f2f2" : "#fff" }}>
//                             {getRowData(meter).map((val, i) => (
//                                 <td key={i} style={styles.td}>{val}</td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );

//     return (
//         <div style={styles.container}>
//             <h2 style={styles.heading}>Survey Details RRNO - {rrno}</h2>

//             <div style={styles.toggleWrapper}>
//                 <div style={styles.toggleGroup}>
//                     {["images", "data"].map((tab) => (
//                         <button
//                             key={tab}
//                             onClick={() => setSelectedTab(tab)}
//                             style={styles.toggleButton(selectedTab === tab)}
//                         >
//                             {tab === "images" ? "Images" : "Meter Data"}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             <div style={styles.transitionBox}>
//                 <AnimatePresence mode="wait">
//                     {selectedTab === "images" && (
//                         <motion.div
//                             key="images"
//                             initial={{ opacity: 0, x: -40 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: 40 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             {renderImageGrid("Node Installation", nodeImage)}
//                             {renderImageGrid("Energy Meter", energyMeterImage)}
//                             {renderImageGrid("Water Meter", waterMeterImage)}
//                             {renderImageGrid("Neutral Installation", neutralImage)}
//                         </motion.div>
//                     )}
//                     {selectedTab === "data" && (
//                         <motion.div
//                             key="data"
//                             initial={{ opacity: 0, x: 40 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -40 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             {data.energyMeter.length > 0 &&
//                                 renderTable("Energy Meters", data.energyMeter,
//                                     ["ID", "Meter No", "Fuse Cut Out", "Starter Node", "Neutral", "Cable Used", "Cable Used (Meter-Neutral)", "Status", "Created By", "GPS", "Remark"],
//                                     (m) => [
//                                         m.id, m.meter_no, m.fuse_cut_out, m.starter_node, m.neutral,
//                                         m.cable_used, m.cable_used_meter_neutral, m.status, m.created_by,
//                                         `${m.latitude}, ${m.longitude}`, m.remark || "-",
//                                         //  <a href={`/map/${m.rr_no}`} style={{ color: "blue" }}>View</a>
//                                     ])}
//                             {data.waterMeter.length > 0 &&
//                                 renderTable("Water Meters", data.waterMeter,
//                                     ["ID", "Meter No", "Status", "Created By", "GPS", "Remark"],
//                                     (m) => [
//                                         m.id, m.meter_no, m.status, m.created_by,
//                                         `${m.latitude}, ${m.longitude}`, m.remark || "-",
//                                         //  <a href={`/map/${m.rr_no}`} style={{ color: "blue" }}>View</a>
//                                     ])}
//                             {data.starterNode.length > 0 &&
//                                 renderTable("Starter Node", data.starterNode,
//                                     ["ID", "node_id", "Status", "Created By", "GPS", "Remark"],
//                                     (m) => [
//                                         m.id, m.node_id, m.status, m.created_by,
//                                         `${m.latitude}, ${m.longitude}`, m.remark || "-",
//                                         //  <a href={`/map/${m.rr_no}`} style={{ color: "blue" }}>View</a>
//                                     ])}
//                             {data.neutralMeter.length > 0 &&
//                                 renderTable("Neutral Meters", data.neutralMeter,
//                                     ["ID", "Neutral Installed", "Cable Used (Meter-Neutral)", "Status", "Created By", "GPS", "Remark"],
//                                     (m) => [
//                                         m.id, m.neutral_installed, m.cable_used_meter_neutral,
//                                         m.status, m.created_by, `${m.latitude}, ${m.longitude}`, m.remark || "-",
//                                         // <a href={`/map/${m.rr_no}`} style={{ color: "blue" }}>View</a>
//                                     ])}
//                             {data.energyMeter.length === 0 && data.waterMeter.length === 0 && data.neutralMeter.length === 0 && (
//                                 <h4 style={{ textAlign: 'center', fontSize: '14px' }}>No Data Found...!</h4>
//                             )}
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>

//             {selectedImage && (
//                 <div style={styles.modalOverlay} onClick={closeModal}>
//                     <motion.div
//                         initial={{ scale: 0.8 }}
//                         animate={{ scale: 1 }}
//                         exit={{ scale: 0.8 }}
//                         transition={{ duration: 0.3 }}
//                         style={styles.modalContent}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <button onClick={closeModal} style={styles.closeButton}>&times;</button>
//                         <img src={selectedImage} alt="Selected" style={styles.modalImage} />
//                     </motion.div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Pop;
import React, { useState, useEffect } from "react";

const Pop = ({ rrno, data, image }) => {
    const [selectedTab, setSelectedTab] = useState("images");
    const [selectedImage, setSelectedImage] = useState(null);

    const [groupedImages, setGroupedImages] = useState({
        energy: [], water: [], neutral: [], node: []
    });

    useEffect(() => {
        if (image?.length) {
            setGroupedImages({
                energy: image.filter(i => i.imagetype === 1),
                water: image.filter(i => i.imagetype === 2),
                neutral: image.filter(i => i.imagetype === 3),
                node: image.filter(i => i.imagetype === 5),
            });
        }
    }, [image]);

    const tabList = [
        { id: "images", label: "Images" },
        { id: "data", label: "Meter Data" }
    ];

    const ImageGrid = ({ title, images }) => (
        <div className="section">
            <h3 className="heading">{title}</h3>
            {images.length > 0 ? (
                <div className="gridWrapper">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className="imageCard"
                            onClick={() => setSelectedImage(`https://testhotel2.prysmcable.com/v24/images/${img.documentID}`)}
                        >
                            <img
                                src={`https://testhotel2.prysmcable.com/v24/images/${img.documentID}`}
                                alt={`Image ${idx + 1}`}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="noData">No images available</p>
            )}
        </div>
    );

    const DataTable = ({ title, headers, data, getRowData }) => (
        <div className="section">
            <h3 className="heading">{title}</h3>
            <table className="dataTable">
                <thead>
                    <tr>{headers.map((header, i) => <th key={i}>{header}</th>)}</tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr key={idx} className={idx % 2 ? "oddRow" : ""}>
                            {getRowData(item).map((val, i) => (
                                <td key={i}>{val}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="container" >
            <h2 className="heading">Survey Details RRNO - {rrno}</h2>

            <div className="toggleWrapper">
                <div className="toggleGroup">
                    {tabList.map(({ id, label }) => (
                        <button
                            key={id}
                            className={`toggleButton ${selectedTab === id ? "active" : ""}`}
                            onClick={() => setSelectedTab(id)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`tabContent ${selectedTab}`}>
                {selectedTab === "images" && (
                    <>
                        <ImageGrid title="Node Installation" images={groupedImages.node} />
                        <ImageGrid title="Energy Meter" images={groupedImages.energy} />
                        <ImageGrid title="Water Meter" images={groupedImages.water} />
                        <ImageGrid title="Neutral Installation" images={groupedImages.neutral} />
                    </>
                )}

                {selectedTab === "data" && (
                    <>
                        {data.energyMeter?.length > 0 &&
                            <DataTable
                                title="Energy Meters"
                                headers={["ID", "Meter No", "Fuse Cut Out", "Starter Node", "Neutral", "Cable Used", "Cable Used (Meter-Neutral)", "Status", "Created By", 'InstalledAt', "GPS", "Remark"]}
                                data={data.energyMeter}
                                getRowData={(m) => [
                                    m.id, m.meter_no, m.fuse_cut_out, m.starter_node, m.neutral,
                                    m.cable_used, m.cable_used_meter_neutral, m.status, m.created_by, m.created_at,
                                    `${m.latitude}, ${m.longitude}`, m.remark || "-"
                                ]}
                            />}
                        {data.waterMeter?.length > 0 &&
                            <DataTable
                                title="Water Meters"
                                headers={["ID", "Meter No", "Status", "Created By", 'InstalledAt', "GPS", "Remark"]}
                                data={data.waterMeter}
                                getRowData={(m) => [
                                    m.id, m.meter_no, m.status, m.created_by, m.created_at,
                                    `${m.latitude}, ${m.longitude}`, m.remark || "-"
                                ]}
                            />}
                        {data.starterNode?.length > 0 &&
                            <DataTable
                                title="Starter Node"
                                headers={["ID", "Node ID", "Status", "Created By", 'InstalledAt', "GPS", "Remark"]}
                                data={data.starterNode}
                                getRowData={(m) => [
                                    m.id, m.node_id, m.status, m.created_by, m.created_at,
                                    `${m.latitude}, ${m.longitude}`, m.remark || "-"
                                ]}
                            />}
                        {data.neutralMeter?.length > 0 &&
                            <DataTable
                                title="Neutral Meters"
                                headers={["ID", "Neutral Installed", "Cable Used (Meter-Neutral)", "Status", "Created By", 'InstalledAt', "GPS", "Remark"]}
                                data={data.neutralMeter}
                                getRowData={(m) => [
                                    m.id, m.neutral_installed, m.cable_used_meter_neutral,
                                    m.status, m.created_by, m.created_at, `${m.latitude}, ${m.longitude}`, m.remark || "-"
                                ]}
                            />}
                        {data.energyMeter.length === 0 && data.waterMeter.length === 0 && data.neutralMeter.length === 0 && (
                            <h4 className="noData">No Data Found...!</h4>
                        )}
                    </>
                )}
            </div>

            {selectedImage && (
                <div className="modalOverlay" onClick={() => setSelectedImage(null)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <button className="closeButton" onClick={() => setSelectedImage(null)}>&times;</button>
                        <img className="modalImage" src={selectedImage} alt="Selected" />
                    </div>
                </div>
            )}

            {/* Embedded CSS */}
            <style>{`
                .container {
                   
            width:100%;
                    background-color: #f9f9f9;
                    font-family: Arial, sans-serif;
                 
                }
                .heading {
                    text-align: center;
                    margin: 10px 0;
                    font-size: 18px;
                }
                .toggleWrapper {
                    display: flex;
                    justify-content: center;
                    margin: 15px 0;
                }
                .toggleGroup {
                    display: flex;
                    background-color: #e0e0e0;
                    border-radius: 50px;
                    padding: 4px;
                    gap: 5px;
                }
                .toggleButton {
                    padding: 8px 18px;
                    border-radius: 50px;
                    border: none;
                    background-color: transparent;
                    color: #333;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .toggleButton.active {
                    background-color: #4CAF50;
                    color: white;
                    font-weight: bold;
                    border-radius:50px;
                }
                .tabContent {
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .section {
                    margin-bottom: 20px;
                }
                .gridWrapper {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 15px;
                    padding: 5px;
                }
                .imageCard {
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
                    cursor: pointer;
                }
                .imageCard img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                }
                .dataTable {
                    width: 100%;
                    border-collapse: collapse;
                }
                .dataTable th {
                    background-color: #4CAF50;
                    color: white;
                    padding: 6px;
                    font-size: 13px;
                }
                .dataTable td {
                    padding: 6px;
                    font-size: 12px;
                    border-bottom: 1px solid #ddd;
                }
                .dataTable .oddRow {
                    background-color: #f2f2f2;
                }
                .noData {
                    text-align: center;
                    color: #888;
                    font-size: 13px;
                }
                .modalOverlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0,0,0,0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modalContent {
                    background-color: white;
                    padding: 10px;
                    border-radius: 8px;
                    max-width: 80vw;
                    max-height: 80vh;
                    position: relative;
                }
                .closeButton {
                    position: absolute;
                    top: 8px;
                    right: 12px;
                    font-size: 24px;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                .modalImage {
                    max-width: 100%;
                    max-height: 70vh;
                    object-fit: contain;
                }
            `}</style>
        </div>
    );
};

export default Pop;

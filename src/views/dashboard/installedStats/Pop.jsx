
// import React, { useState, useEffect } from "react";

// const Pop = ({ rrno, data, image }) => {
//     const [selectedTab, setSelectedTab] = useState("images");
//     const [selectedImage, setSelectedImage] = useState(null);

//     const [groupedImages, setGroupedImages] = useState({
//         energy: [], water: [], neutral: [], node: []
//     });
//     const [imageUrls, setImageUrls] = useState([]);




//     useEffect(() => {
//         if (image?.length) {
//             setGroupedImages({
//                 energy: image.filter(i => i.imagetype === 1),
//                 water: image.filter(i => i.imagetype === 2),
//                 neutral: image.filter(i => i.imagetype === 3),
//                 node: image.filter(i => i.imagetype === 5),
//             });
//         }
//     }, [image]);

//     const tabList = [
//         { id: "images", label: "Images" },
//         { id: "data", label: "Meter Data" }
//     ];

//     const ImageGrid = ({ title, images }) => {
//         useEffect(() => {
//             async function loadImages() {
//                 const urls = await Promise.all(
//                     images.map(async (img) => {
//                         const res = await fetch(
//                             `https://testhotel2.prysmcable.com/v35/images/${img.documentID}`,
//                             {
//                                 headers: {
//                                     "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap",
//                                 },
//                             }
//                         );
//                         const blob = await res.blob();
//                         return URL.createObjectURL(blob);
//                     })
//                 );
//                 setImageUrls(urls);
//             }

//             if (images?.length) loadImages();
//         }, [images]);
//         return (
//             <div className="section">
//                 <h3 className="heading">{title}</h3>
//                 {images.length > 0 ? (
//                     <div className="gridWrapper">
//                         {images.map((img, idx) => (
//                             <div
//                                 key={idx}
//                                 className="imageCard"
//                                 onClick={() => setSelectedImage(`https://testhotel2.prysmcable.com/v35/images/${img.documentID}`)}
//                             >
//                                 <img
//                                     // src={`https://testhotel2.prysmcable.com/v24/images/${img.documentID}`}
//                                     src={imageUrls[idx]}
//                                     alt={`Image ${idx + 1}`}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="noData">No images available</p>
//                 )}
//             </div>
//         )
//     };

//     const DataTable = ({ title, headers, data, getRowData }) => (
//         <div className="section">
//             <h3 className="heading">{title}</h3>
//             <table className="dataTable">
//                 <thead>
//                     <tr>{headers.map((header, i) => <th key={i}>{header}</th>)}</tr>
//                 </thead>
//                 <tbody>
//                     {data.map((item, idx) => (
//                         <tr key={idx} className={idx % 2 ? "oddRow" : ""}>
//                             {getRowData(item).map((val, i) => (
//                                 <td key={i}>{val}</td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );

//     return (
//         <div className="container" >
//             <h2 className="heading">Survey Details RRNO - {rrno}</h2>

//             <div className="toggleWrapper">
//                 <div className="toggleGroup">
//                     {tabList.map(({ id, label }) => (
//                         <button
//                             key={id}
//                             className={`toggleButton ${selectedTab === id ? "active" : ""}`}
//                             onClick={() => setSelectedTab(id)}
//                         >
//                             {label}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             <div className={`tabContent ${selectedTab}`}>
//                 {selectedTab === "images" && (
//                     <>
//                         <ImageGrid title="Node Installation" images={groupedImages.node} />
//                         <ImageGrid title="Energy Meter" images={groupedImages.energy} />
//                         <ImageGrid title="Water Meter" images={groupedImages.water} />
//                         <ImageGrid title="Neutral Installation" images={groupedImages.neutral} />
//                     </>
//                 )}

//                 {selectedTab === "data" && (
//                     <>
//                         {data.energyMeter?.length > 0 &&
//                             <DataTable
//                                 title="Energy Meters"
//                                 headers={["ID", "Meter No", "Fuse Cut Out", "Starter Node", "Neutral", "Cable Used", "Cable Used (Meter-Neutral)", "Status", "Created By", 'InstalledAt', "GPS", "Remark"]}
//                                 data={data.energyMeter}
//                                 getRowData={(m) => [
//                                     m.id, m.meter_no, m.fuse_cut_out, m.starter_node, m.neutral,
//                                     m.cable_used, m.cable_used_meter_neutral, m.status, m.created_by, m.created_at,
//                                     `${m.latitude}, ${m.longitude}`, m.remark || "-"
//                                 ]}
//                             />}
//                         {data.waterMeter?.length > 0 &&
//                             <DataTable
//                                 title="Water Meters"
//                                 headers={["ID", "Meter No", "Status", "Created By", 'InstalledAt', "GPS", "Remark"]}
//                                 data={data.waterMeter}
//                                 getRowData={(m) => [
//                                     m.id, m.meter_no, m.status, m.created_by, m.created_at,
//                                     `${m.latitude}, ${m.longitude}`, m.remark || "-"
//                                 ]}
//                             />}
//                         {data.starterNode?.length > 0 &&
//                             <DataTable
//                                 title="Starter Node"
//                                 headers={["ID", "Node ID", "Status", "Created By", 'InstalledAt', "GPS", "Remark"]}
//                                 data={data.starterNode}
//                                 getRowData={(m) => [
//                                     m.id, m.node_id, m.status, m.created_by, m.created_at,
//                                     `${m.latitude}, ${m.longitude}`, m.remark || "-"
//                                 ]}
//                             />}
//                         {data.neutralMeter?.length > 0 &&
//                             <DataTable
//                                 title="Neutral Meters"
//                                 headers={["ID", "Neutral Installed", "Cable Used (Meter-Neutral)", "Status", "Created By", 'InstalledAt', "GPS", "Remark"]}
//                                 data={data.neutralMeter}
//                                 getRowData={(m) => [
//                                     m.id, m.neutral_installed, m.cable_used_meter_neutral,
//                                     m.status, m.created_by, m.created_at, `${m.latitude}, ${m.longitude}`, m.remark || "-"
//                                 ]}
//                             />}
//                         {data.energyMeter.length === 0 && data.waterMeter.length === 0 && data.neutralMeter.length === 0 && (
//                             <h4 className="noData">No Data Found...!</h4>
//                         )}
//                     </>
//                 )}
//             </div>

//             {selectedImage && (
//                 <div className="modalOverlay" onClick={() => setSelectedImage(null)}>
//                     <div className="modalContent" onClick={(e) => e.stopPropagation()}>
//                         <button className="closeButton" onClick={() => setSelectedImage(null)}>&times;</button>
//                         <img className="modalImage" src={selectedImage} alt="Selected" />
//                     </div>
//                 </div>
//             )}

//             {/* Embedded CSS */}
//             <style>{`
//                 .container {

//             width:100%;
//                     background-color: #f9f9f9;
//                     font-family: Arial, sans-serif;

//                 }
//                 .heading {
//                     text-align: center;
//                     margin: 10px 0;
//                     font-size: 18px;
//                 }
//                 .toggleWrapper {
//                     display: flex;
//                     justify-content: center;
//                     margin: 15px 0;
//                 }
//                 .toggleGroup {
//                     display: flex;
//                     background-color: #e0e0e0;
//                     border-radius: 50px;
//                     padding: 4px;
//                     gap: 5px;
//                 }
//                 .toggleButton {
//                     padding: 8px 18px;
//                     border-radius: 50px;
//                     border: none;
//                     background-color: transparent;
//                     color: #333;
//                     font-size: 14px;
//                     cursor: pointer;
//                     transition: all 0.3s ease;
//                 }
//                 .toggleButton.active {
//                     background-color: #4CAF50;
//                     color: white;
//                     font-weight: bold;
//                     border-radius:50px;
//                 }
//                 .tabContent {
//                     animation: fadeIn 0.3s ease;
//                 }
//                 @keyframes fadeIn {
//                     from { opacity: 0; transform: translateY(10px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }
//                 .section {
//                     margin-bottom: 20px;
//                 }
//                 .gridWrapper {
//                     display: grid;
//                     grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
//                     gap: 15px;
//                     padding: 5px;
//                 }
//                 .imageCard {
//                     border-radius: 8px;
//                     overflow: hidden;
//                     box-shadow: 0 3px 6px rgba(0,0,0,0.1);
//                     cursor: pointer;
//                 }
//                 .imageCard img {
//                     width: 100%;
//                     height: 150px;
//                     object-fit: cover;
//                 }
//                 .dataTable {
//                     width: 100%;
//                     border-collapse: collapse;
//                 }
//                 .dataTable th {
//                     background-color: #4CAF50;
//                     color: white;
//                     padding: 6px;
//                     font-size: 13px;
//                 }
//                 .dataTable td {
//                     padding: 6px;
//                     font-size: 12px;
//                     border-bottom: 1px solid #ddd;
//                 }
//                 .dataTable .oddRow {
//                     background-color: #f2f2f2;
//                 }
//                 .noData {
//                     text-align: center;
//                     color: #888;
//                     font-size: 13px;
//                 }
//                 .modalOverlay {
//                     position: fixed;
//                     top: 0; left: 0;
//                     width: 100vw;
//                     height: 100vh;
//                     background-color: rgba(0,0,0,0.8);
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     z-index: 1000;
//                 }
//                 .modalContent {
//                     background-color: white;
//                     padding: 10px;
//                     border-radius: 8px;
//                     max-width: 80vw;
//                     max-height: 80vh;
//                     position: relative;
//                 }
//                 .closeButton {
//                     position: absolute;
//                     top: 8px;
//                     right: 12px;
//                     font-size: 24px;
//                     background: none;
//                     border: none;
//                     cursor: pointer;
//                 }
//                 .modalImage {
//                     max-width: 100%;
//                     max-height: 70vh;
//                     object-fit: contain;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default Pop;


import React, { useState, useEffect, useMemo } from "react";

const Pop = ({ rrno, data, image }) => {
    const [selectedTab, setSelectedTab] = useState("images");
    const [selectedImage, setSelectedImage] = useState(null);

    const [groupedImages, setGroupedImages] = useState({
        energy: [],
        water: [],
        neutral: [],
        node: [],
    });

    useEffect(() => {
        if (image?.length) {
            setGroupedImages({
                energy: image.filter((i) => i.imagetype === 1),
                water: image.filter((i) => i.imagetype === 2),
                neutral: image.filter((i) => i.imagetype === 3),
                node: image.filter((i) => i.imagetype === 5),
            });
        }
    }, [image]);

    const tabList = [
        { id: "images", label: "Images" },
        { id: "data", label: "Meter Data" },
    ];

    const ImageGrid = ({ title, images }) => {
        const [imageUrls, setImageUrls] = useState([]);

        // Memoize images to prevent unnecessary re-renders
        const memoizedImages = useMemo(() => images, [images]);

        useEffect(() => {
            async function loadImages() {
                const urls = await Promise.all(
                    memoizedImages.map(async (img) => {
                        const res = await fetch(
                            `https://testhotel2.prysmcable.com/v35/images/${img.documentID}`,
                            {
                                headers: {
                                    "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap",
                                },
                            }
                        );
                        const blob = await res.blob();
                        return URL.createObjectURL(blob);
                    })
                );
                setImageUrls(urls);
            }

            if (memoizedImages?.length) {
                loadImages();
            } else {
                setImageUrls([]); // Clear URLs if no images
            }

            // Cleanup URLs to prevent memory leaks
            return () => {
                imageUrls.forEach((url) => URL.revokeObjectURL(url));
                setImageUrls([]);
            };
        }, [memoizedImages]);

        return (
            <div className="section">
                <h3 className="heading">{title}</h3>
                {memoizedImages.length > 0 ? (
                    <div className="gridWrapper">
                        {memoizedImages.map((img, idx) => (
                            <div
                                key={img.documentID} // Use unique documentID as key
                                className="imageCard"
                                onClick={() => setSelectedImage(imageUrls[idx])}
                            >
                                <img
                                    src={imageUrls[idx] || "/placeholder.png"} // Fallback placeholder
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
    };

    const DataTable = ({ title, headers, data, getRowData }) => (
        <div className="section">
            <h3 className="heading">{title}</h3>
            <table className="dataTable">
                <thead>
                    <tr>
                        {headers.map((header, i) => (
                            <th key={i}>{header}</th>
                        ))}
                    </tr>
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
        <div className="container">
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
                        {data.energyMeter?.length > 0 && (
                            <DataTable
                                title="Energy Meters"
                                headers={[
                                    "ID",
                                    "Meter No",
                                    "Fuse Cut Out",
                                    "Starter Node",
                                    "Neutral",
                                    "Cable Used",
                                    "Cable Used (Meter-Neutral)",
                                    "Status",
                                    "Created By",
                                    "InstalledAt",
                                    "GPS",
                                    "Remark",
                                ]}
                                data={data.energyMeter}
                                getRowData={(m) => [
                                    m.id,
                                    m.meter_no,
                                    m.fuse_cut_out,
                                    m.starter_node,
                                    m.neutral,
                                    m.cable_used,
                                    m.cable_used_meter_neutral,
                                    m.status,
                                    m.created_by,
                                    m.created_at,
                                    `${m.latitude}, ${m.longitude}`,
                                    m.remark || "-",
                                ]}
                            />
                        )}
                        {data.waterMeter?.length > 0 && (
                            <DataTable
                                title="Water Meters"
                                headers={["ID", "Meter No", "Status", "Created By", "InstalledAt", "GPS", "Remark"]}
                                data={data.waterMeter}
                                getRowData={(m) => [
                                    m.id,
                                    m.meter_no,
                                    m.status,
                                    m.created_by,
                                    m.created_at,
                                    `${m.latitude}, ${m.longitude}`,
                                    m.remark || "-",
                                ]}
                            />
                        )}
                        {data.starterNode?.length > 0 && (
                            <DataTable
                                title="Starter Node"
                                headers={["ID", "Node ID", "Status", "Created By", "InstalledAt", "GPS", "Remark"]}
                                data={data.starterNode}
                                getRowData={(m) => [
                                    m.id,
                                    m.node_id,
                                    m.status,
                                    m.created_by,
                                    m.created_at,
                                    `${m.latitude}, ${m.longitude}`,
                                    m.remark || "-",
                                ]}
                            />
                        )}
                        {data.neutralMeter?.length > 0 && (
                            <DataTable
                                title="Neutral Meters"
                                headers={[
                                    "ID",
                                    "Neutral Installed",
                                    "Cable Used (Meter-Neutral)",
                                    "Status",
                                    "Created By",
                                    "InstalledAt",
                                    "GPS",
                                    "Remark",
                                ]}
                                data={data.neutralMeter}
                                getRowData={(m) => [
                                    m.id,
                                    m.neutral_installed,
                                    m.cable_used_meter_neutral,
                                    m.status,
                                    m.created_by,
                                    m.created_at,
                                    `${m.latitude}, ${m.longitude}`,
                                    m.remark || "-",
                                ]}
                            />
                        )}
                        {data.energyMeter.length === 0 &&
                            data.waterMeter.length === 0 &&
                            data.neutralMeter.length === 0 && (
                                <h4 className="noData">No Data Found...!</h4>
                            )}
                    </>
                )}
            </div>

            {selectedImage && (
                <div className="modalOverlay" onClick={() => setSelectedImage(null)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <button className="closeButton" onClick={() => setSelectedImage(null)}>
                            &times;
                        </button>
                        <img className="modalImage" src={selectedImage} alt="Selected" />
                    </div>
                </div>
            )}

            <style>{`
        .container {
          width: 100%;
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
          border-radius: 50px;
        }
        .tabContent {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
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
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.8);
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
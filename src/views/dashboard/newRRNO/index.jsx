// import React, { useState } from "react";


// const RRNOForm = () => {
//     const [formData, setFormData] = useState({
//         TalukName: "",
//         GPName: "",
//         VillageName: "",
//         ENTERED_RRNO: "",
//         Waterman_Name: "",
//         Contact_number: "",
//         Latitude: "",
//         Longitude: "",
//         district: "",
//         token: "",
//     });

//     const [message, setMessage] = useState("");

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Token validation
//         if (formData.token !== "new_rrno") {
//             setMessage("Invalid token. API call not allowed.");
//             return;
//         }

//         try {
//             const response = await fetch(`https://testhotel2.prysmcable.com//v35/add_rrno`, {
//                 TalukName: formData.TalukName,
//                 GPName: formData.GPName,
//                 VillageName: formData.VillageName,
//                 ENTERED_RRNO: formData.ENTERED_RRNO,
//                 Waterman_Name: formData.Waterman_Name,
//                 Contact_number: formData.Contact_number,
//                 Latitude: formData.Latitude,
//                 Longitude: formData.Longitude,
//                 district: formData.district,
//             }, {
//                 method: "POST",
//                 headers: {
//                     "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap",
//                     "Content-Type": "application/json"
//                 }
//             });

//             setMessage(response.data.message || "RRNO added successfully");
//             setFormData({
//                 TalukName: "",
//                 GPName: "",
//                 VillageName: "",
//                 ENTERED_RRNO: "",
//                 Waterman_Name: "",
//                 Contact_number: "",
//                 Latitude: "",
//                 Longitude: "",
//                 district: "",
//                 token: "",
//             });
//         } catch (err) {
//             setMessage(
//                 err.response?.data?.error || err.response?.data?.message || "Error"
//             );
//         }
//     };

//     // --- Simple Responsive CSS ---
//     const styles = {
//         container: {
//             maxWidth: "600px",
//             margin: "20px auto",
//             padding: "20px",
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//             fontFamily: "Arial, sans-serif",
//         },
//         input: {
//             width: "100%",
//             padding: "10px",
//             margin: "8px 0",
//             boxSizing: "border-box",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//         },
//         label: {
//             fontWeight: "bold",
//             display: "block",
//             marginTop: "10px",
//         },
//         button: {
//             backgroundColor: "#28a745",
//             color: "#fff",
//             border: "none",
//             padding: "10px 20px",
//             marginTop: "15px",
//             cursor: "pointer",
//             borderRadius: "4px",
//             width: "100%",
//         },
//         message: {
//             marginTop: "15px",
//             color: "red",
//             fontWeight: "bold",
//         },
//     };

//     return (
//         <div style={styles.container}>
//             <h2>RRNO Manual Entry</h2>
//             <form onSubmit={handleSubmit}>
//                 {[
//                     "TalukName",
//                     "GPName",
//                     "VillageName",
//                     "ENTERED_RRNO",
//                     "Waterman_Name",
//                     "Contact_number",
//                     "Latitude",
//                     "Longitude",
//                     "district",
//                 ].map((field) => (
//                     <div key={field}>
//                         <label style={styles.label}>{field.replace("_", " ")}</label>
//                         <input
//                             style={styles.input}
//                             type="text"
//                             name={field}
//                             value={formData[field]}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                 ))}

//                 <div>
//                     <label style={styles.label}>Token</label>
//                     <input
//                         style={styles.input}
//                         type="text"
//                         name="token"
//                         value={formData.token}
//                         onChange={handleChange}
//                         placeholder="Enter token"
//                         required
//                     />
//                 </div>

//                 <button style={styles.button} type="submit">
//                     Submit
//                 </button>
//             </form>
//             {message && <div style={styles.message}>{message}</div>}
//         </div>
//     );
// };

// export default RRNOForm;




import React, { useState, useEffect } from "react";

const RRNOForm = () => {
    const [formData, setFormData] = useState({
        district: "",
        TalukName: "",
        GPName: "",
        VillageName: "",
        ENTERED_RRNO: "",
        Waterman_Name: "",
        Contact_number: "",
        Latitude: "",
        Longitude: "",
        token: "",
        file: null,
    });

    const [districts, setDistricts] = useState([]);
    const [taluks, setTaluks] = useState([]);
    const [gps, setGps] = useState([]);
    const [villages, setVillages] = useState([]);
    const [message, setMessage] = useState("");

    const API_KEY = "uprtvubdxwyuhebwsnkrdirmfoqorkap";
    const BASE_URL = "https://testhotel2.prysmcable.com/v35";

    // Fetch districts on load
    useEffect(() => {
        fetch(`${BASE_URL}/districts`, { headers: { "x-api-key": API_KEY } })
            .then((res) => res.json())
            .then((data) => setDistricts(data.data || []))
            .catch(() => setMessage("Failed to load districts"));
    }, []);

    // Fetch taluks when district changes
    useEffect(() => {
        if (!formData.district) return;
        fetch(`${BASE_URL}/taluks?district=${formData.district}`, {
            headers: { "x-api-key": API_KEY },
        })
            .then((res) => res.json())
            .then((data) => setTaluks(data.data || []))
            .catch(() => setMessage("Failed to load taluks"));
    }, [formData.district]);

    // Fetch GPs when taluk changes
    useEffect(() => {
        if (!formData.TalukName) return;
        fetch(`${BASE_URL}/gram-panchayats?taluk=${formData.TalukName}`, {
            headers: { "x-api-key": API_KEY },
        })
            .then((res) => res.json())
            .then((data) => setGps(data.data || []))
            .catch(() => setMessage("Failed to load gram panchayats"));
    }, [formData.TalukName]);

    // Fetch Villages when GP changes
    useEffect(() => {
        if (!formData.GPName) return;
        fetch(`${BASE_URL}/villages?gp=${formData.GPName}`, {
            headers: { "x-api-key": API_KEY },
        })
            .then((res) => res.json())
            .then((data) => setVillages(data.data || []))
            .catch(() => setMessage("Failed to load villages"));
    }, [formData.GPName]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.token !== "new_rrno") {
            setMessage("❌ Invalid token. API call not allowed.");
            return;
        }

        try {
            const body = {
                district: formData.district,
                TalukName: formData.TalukName,
                GPName: formData.GPName,
                VillageName: formData.VillageName,
                ENTERED_RRNO: formData.ENTERED_RRNO,
                Waterman_Name: formData.Waterman_Name,
                Contact_number: formData.Contact_number,
                Latitude: formData.Latitude,
                Longitude: formData.Longitude,
            };
            console.log(body)
            const response = await fetch(`${BASE_URL}/add_rrno`, {
                method: "POST",
                headers: {
                    "x-api-key": API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            setMessage(data.message || "✅ RRNO added successfully");

            setFormData({
                district: "",
                TalukName: "",
                GPName: "",
                VillageName: "",
                ENTERED_RRNO: "",
                Waterman_Name: "",
                Contact_number: "",
                Latitude: "",
                Longitude: "",
                token: "",
                file: null,
            });
            setTaluks([]);
            setGps([]);
            setVillages([]);
        } catch (err) {
            setMessage("❌ Error submitting data");
        }
    };

    // --- Styles ---
    const styles = {
        container: {
            maxWidth: "750px",
            margin: "20px auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            fontFamily: "Arial, sans-serif",
        },
        formGrid: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
        },
        input: {
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
        },
        label: {
            fontWeight: "bold",
            marginBottom: "5px",
            display: "block",
        },
        button: {
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            marginTop: "20px",
            cursor: "pointer",
            borderRadius: "5px",
            width: "100%",
            fontSize: "16px",
        },
        message: {
            marginTop: "15px",
            color: "red",
            fontWeight: "bold",
            textAlign: "center",
        },
        tokenFileRow: {
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                RRNO Manual Entry
            </h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                    {/* District */}
                    <div>
                        <label style={styles.label}>District</label>
                        <select
                            name="district"
                            style={styles.input}
                            value={formData.district}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select District</option>
                            {districts.map((dist) => (
                                <option key={dist} value={dist}>
                                    {dist}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Taluk */}
                    <div>
                        <label style={styles.label}>Taluk</label>
                        <select
                            name="TalukName"
                            style={styles.input}
                            value={formData.TalukName}
                            onChange={handleChange}
                            required
                            disabled={!taluks.length}
                        >
                            <option value="">Select Taluk</option>
                            {taluks.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* GP */}
                    <div>
                        <label style={styles.label}>Gram Panchayat</label>
                        <select
                            name="GPName"
                            style={styles.input}
                            value={formData.GPName}
                            onChange={handleChange}
                            required
                            disabled={!gps.length}
                        >
                            <option value="">Select GP</option>
                            {gps.map((gp) => (
                                <option key={gp} value={gp}>
                                    {gp}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Village */}
                    <div>
                        <label style={styles.label}>Village</label>
                        <select
                            name="VillageName"
                            style={styles.input}
                            value={formData.VillageName}
                            onChange={handleChange}
                            required
                            disabled={!villages.length}
                        >
                            <option value="">Select Village</option>
                            {villages.map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Other inputs */}
                    {[
                        "ENTERED_RRNO",
                        "Waterman_Name",
                        "Contact_number",
                        "Latitude",
                        "Longitude",
                    ].map((field) => (
                        <div key={field}>
                            <label style={styles.label}>{field.replace("_", " ")}</label>
                            <input
                                style={styles.input}
                                type="text"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                </div>

                {/* Token + File Row */}
                <div style={styles.tokenFileRow}>
                    <div style={{ flex: "1" }}>
                        <label style={styles.label}>Token</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="token"
                            value={formData.token}
                            onChange={handleChange}
                            placeholder="Enter token"
                            required
                        />
                    </div>
                    {/* <div style={{ flex: "1" }}>
                        <label style={styles.label}>File</label>
                        <input
                            style={styles.input}
                            type="file"
                            name="file"
                            onChange={handleChange}
                        />
                    </div> */}
                </div>

                <button style={styles.button} type="submit">
                    Submit
                </button>
            </form>

            {message && <div style={styles.message}>{message}</div>}
        </div>
    );
};

export default RRNOForm;

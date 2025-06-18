module.exports = async function handler(req, res) {
    const { gwid } = req.query;
    if (!gwid) {
        res.status(400).json({ error: "Missing 'gwid'" });
        return;
    }
    try {
        const backendRes = await fetch(`http://172.104.244.42:6821/getnodestatus?gwid=${encodeURIComponent(gwid)}`);
        const data = await backendRes.text();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).send(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching from backend" });
    }
}

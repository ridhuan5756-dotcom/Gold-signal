export default async function handler(req, res) {
    // Benarkan akses dari frontend anda
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { type, interval } = req.query;

    try {
        if (type === 'price') {
            // Ambil harga live dari Binance (selamat sebab dibuat di pelayan Vercel)
            const r = await fetch('https://fapi.binance.com/fapi/v1/ticker/price?symbol=XAUUSDT');
            const d = await r.json();
            return res.status(200).json({ price: +d.price });
        } 
        
        if (type === 'kline') {
            // Ambil data candlestick dari Binance
            const r = await fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=XAUUSDT&interval=${interval}&limit=500`);
            const d = await r.json();
            // Format data: [masa, open, high, low, close]
            const rows = d.map(x => [+x[0], +x[1], +x[2], +x[3], +x[4]]);
            return res.status(200).json({ rows });
        }

        res.status(400).json({ error: 'Invalid type' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal ambil data dari pelayan' });
    }
}

import express from "express";
import { supabase } from "./config/supabase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// --- 1. SHIPPING (Limit 10 & Filter Bulan) ---
app.get('/', async (req, res) => {
    const { bulan } = req.query; // Ambil filter dari URL jika ada
    try {
        let query = supabase.from("SHIPPING SARINA").select("*");

        if (bulan) {
            // Filter berdasarkan tahun-bulan (YYYY-MM)
            query = query.gte("Tanggal", `${bulan}-01`).lte("Tanggal", `${bulan}-31`);
        }

        const { data, error } = await query
            .order("Tanggal", { ascending: false })
            .limit(10);

        if (error) throw error;
        res.render("shipping", { dataShipping: data || [], menu: 'shipping', error: null, filterBulan: bulan || '' });
    } catch (err) {
        res.render("shipping", { dataShipping: [], menu: 'shipping', error: err.message, filterBulan: '' });
    }
});

// --- 2. STOK ---
app.get('/stok', async (req, res) => {
    try {
        const { data, error } = await supabase.from("STOK SARINA").select("*").order("ID", { ascending: true });
        if (error) throw error;
        res.render("stok", { dataStok: data || [], menu: 'stok', error: null });
    } catch (err) {
        res.render("stok", { dataStok: [], menu: 'stok', error: err.message });
    }
});

// --- 3. KAS (Limit 10) ---
app.get('/kas', async (req, res) => {
    try {
        const { data, error } = await supabase.from("KAS SARINA").select("*").order("ID", { ascending: false }).limit(10);
        if (error) throw error;
        res.render("kas", { dataKas: data || [], menu: 'kas', error: null });
    } catch (err) {
        res.render("kas", { dataKas: [], menu: 'kas', error: err.message });
    }
});

// --- ROUTE TAMBAH DATA ---
app.post('/shipping/tambah', async (req, res) => {
    const { tanggal, spx, jne, jnt, sameday } = req.body;
    try {
        await supabase.from("SHIPPING SARINA").insert([{ 
            "Tanggal": tanggal, "SPX": parseInt(spx)||0, "JNE": parseInt(jne)||0, 
            "JNT": parseInt(jnt)||0, "SAMEDAY/INSTANT": parseInt(sameday)||0 
        }]);
    } catch (err) { console.error(err.message); }
    res.redirect('/');
});

// --- ROUTE HAPUS ---
app.get('/hapus/:tabel/:id', async (req, res) => {
    const { tabel, id } = req.params;
    const target = tabel === 'shipping' ? "SHIPPING SARINA" : (tabel === 'stok' ? "STOK SARINA" : "KAS SARINA");
    await supabase.from(target).delete().eq("ID", id);
    res.redirect(tabel === 'shipping' ? '/' : `/${tabel}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sarina System Running!`));

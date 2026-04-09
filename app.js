import express from "express";
import { supabase } from "./config/supabase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// --- 1. SHIPPING (Limit 10) ---
app.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("SHIPPING SARINA")
            .select("*")
            .order("Tanggal", { ascending: false })
            .limit(10); // Hanya tampilkan 10 data terbaru

        if (error) throw error;
        res.render("shipping", { dataShipping: data || [], menu: 'shipping', error: null });
    } catch (err) {
        res.render("shipping", { dataShipping: [], menu: 'shipping', error: err.message });
    }
});

// --- 2. STOK (Fix Error) ---
app.get('/stok', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("STOK SARINA")
            .select("*")
            .order("ID", { ascending: true });

        if (error) throw error;
        res.render("stok", { dataStok: data || [], menu: 'stok', error: null });
    } catch (err) {
        res.render("stok", { dataStok: [], menu: 'stok', error: err.message });
    }
});

// --- 3. KAS (Fix Error) ---
app.get('/kas', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("KAS SARINA")
            .select("*")
            .order("Tanggal", { ascending: false })
            .limit(10);

        if (error) throw error;
        res.render("kas", { dataKas: data || [], menu: 'kas', error: null });
    } catch (err) {
        res.render("kas", { dataKas: [], menu: 'kas', error: err.message });
    }
});

// Route Tambah & Hapus tetap sama seperti sebelumnya...
// [Tambahkan sisa route POST dan Hapus dari script sebelumnya di sini]

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sarina Online di Port ${PORT}`));

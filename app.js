import express from "express";
import { supabase } from "./config/supabase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// --- 1. SHIPPING (Halaman Utama) ---
app.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("SHIPPING SARINA")
            .select("*")
            .order("Tanggal", { ascending: false });

        if (error) throw error;
        console.log("✅ Data Shipping Terambil:", data ? data.length : 0, "baris");
        res.render("shipping", { dataShipping: data || [], menu: 'shipping' });
    } catch (err) {
        console.error("❌ Error Shipping:", err.message);
        res.render("shipping", { dataShipping: [], menu: 'shipping' });
    }
});

// Route Tambah Shipping
app.post('/shipping/tambah', async (req, res) => {
    const { tanggal, spx, jne, jnt, sameday } = req.body;
    try {
        const { error } = await supabase
            .from("SHIPPING SARINA")
            .insert([{ 
                "Tanggal": tanggal, 
                "SPX": parseInt(spx) || 0, 
                "JNE": parseInt(jne) || 0, 
                "JNT": parseInt(jnt) || 0,
                "SAMEDAY/INSTANT": parseInt(sameday) || 0 
            }]);
        if (error) throw error;
    } catch (err) {
        console.error("❌ Gagal Tambah Shipping:", err.message);
    }
    res.redirect('/');
});

// --- 2. STOK ---
app.get('/stok', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("STOK SARINA")
            .select("*")
            .order("ID", { ascending: true });
        if (error) throw error;
        res.render("stok", { dataStok: data || [], menu: 'stok' });
    } catch (err) {
        console.error("❌ Error Stok:", err.message);
        res.render("stok", { dataStok: [], menu: 'stok' });
    }
});

// --- 3. KAS ---
app.get('/kas', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("KAS SARINA")
            .select("*")
            .order("ID", { ascending: false });
        if (error) throw error;
        res.render("kas", { dataKas: data || [], menu: 'kas' });
    } catch (err) {
        console.error("❌ Error Kas:", err.message);
        res.render("kas", { dataKas: [], menu: 'kas' });
    }
});

// Route Tambah Kas
app.post('/kas/tambah', async (req, res) => {
    const { ket, masuk, keluar } = req.body;
    try {
        const { error } = await supabase
            .from("KAS SARINA")
            .insert([{ 
                "Keterangan": ket, 
                "Debet": parseInt(masuk) || 0, 
                "Kredit": parseInt(keluar) || 0 
            }]);
        if (error) throw error;
    } catch (err) {
        console.error("❌ Gagal Tambah Kas:", err.message);
    }
    res.redirect('/kas');
});

// --- 4. HAPUS DATA (Universal) ---
app.get('/hapus/:tabel/:id', async (req, res) => {
    const { tabel, id } = req.params;
    let target = "";
    if (tabel === 'shipping') target = "SHIPPING SARINA";
    else if (tabel === 'stok') target = "STOK SARINA";
    else if (tabel === 'kas') target = "KAS SARINA";

    try {
        const { error } = await supabase.from(target).delete().eq("ID", id);
        if (error) throw error;
    } catch (err) {
        console.error("❌ Gagal Hapus:", err.message);
    }
    res.redirect(tabel === 'shipping' ? '/' : `/${tabel}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sarina Online di Port ${PORT}`));

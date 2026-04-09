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
    const { data, error } = await supabase
        .from("SHIPPING SARINA")
        .select("*")
        .order("Tanggal", { ascending: false });

    if (error) console.error("Error Ambil Shipping:", error.message);
    res.render("shipping", { dataShipping: data || [], menu: 'shipping' });
});

// Route Tambah Shipping
app.post('/shipping/tambah', async (req, res) => {
    const { tanggal, spx, jne, jnt, sameday } = req.body;
    
    const { error } = await supabase
        .from("SHIPPING SARINA")
        .insert([{ 
            "Tanggal": tanggal, 
            "SPX": parseInt(spx) || 0, 
            "JNE": parseInt(jne) || 0, 
            "JNT": parseInt(jnt) || 0,
            "SAMEDAY/INSTANT": parseInt(sameday) || 0 
        }]);

    if (error) console.error("Gagal Tambah Shipping:", error.message);
    res.redirect('/');
});

// --- 2. STOK ---
app.get('/stok', async (req, res) => {
    const { data, error } = await supabase
        .from("STOK SARINA")
        .select("*")
        .order("ID", { ascending: true });

    if (error) console.error("Error Ambil Stok:", error.message);
    res.render("stok", { dataStok: data || [], menu: 'stok' });
});

// --- 3. KAS ---
app.get('/kas', async (req, res) => {
    const { data, error } = await supabase
        .from("KAS SARINA")
        .select("*")
        .order("ID", { ascending: false });

    if (error) console.error("Error Ambil Kas:", error.message);
    res.render("kas", { dataKas: data || [], menu: 'kas' });
});

// Route Tambah Kas
app.post('/kas/tambah', async (req, res) => {
    const { ket, masuk, keluar } = req.body;
    const { error } = await supabase
        .from("KAS SARINA")
        .insert([{ 
            "Keterangan": ket, 
            "Debet": parseInt(masuk) || 0, 
            "Kredit": parseInt(keluar) || 0 
        }]);
    
    if (error) console.error("Gagal Tambah Kas:", error.message);
    res.redirect('/kas');
});

// --- 4. HAPUS DATA (Universal) ---
app.get('/hapus/:tabel/:id', async (req, res) => {
    const { tabel, id } = req.params;
    let target = "";

    if (tabel === 'shipping') target = "SHIPPING SARINA";
    else if (tabel === 'stok') target = "STOK SARINA";
    else if (tabel === 'kas') target = "KAS SARINA";

    const { error } = await supabase
        .from(target)
        .delete()
        .eq("ID", id);

    if (error) console.error("Gagal Hapus:", error.message);
    res.redirect(tabel === 'shipping' ? '/' : `/${tabel}`);
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sarina Dashboard Online di Port ${PORT}`));

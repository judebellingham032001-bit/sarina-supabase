import express from "express";
import { supabase } from "./config/supabase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// --- 1. SHIPPING ---
app.get('/', async (req, res) => {
    const { data } = await supabase.from("SHIPPING SARINA").select("*").order("Tanggal", { ascending: false });
    res.render("shipping", { dataShipping: data || [], menu: 'shipping' });
});

// --- 2. STOK ---
app.get('/stok', async (req, res) => {
    const { data } = await supabase.from("STOK SARINA").select("*").order("ID", { ascending: true });
    res.render("stok", { dataStok: data || [], menu: 'stok' });
});

// --- 3. KAS ---
app.get('/kas', async (req, res) => {
    // Sesuaikan order ke kolom "ID" atau "Tanggal"
    const { data } = await supabase.from("KAS SARINA").select("*").order("ID", { ascending: false });
    res.render("kas", { dataKas: data || [], menu: 'kas' });
});

// Logika Tambah Kas (Sesuaikan dengan kolom Debet/Kredit kamu)
app.post('/kas/tambah', async (req, res) => {
    const { ket, masuk, keluar } = req.body;
    await supabase.from("KAS SARINA").insert([{ 
        "Keterangan": ket, 
        "Debet": masuk || 0, 
        "Kredit": keluar || 0 
    }]);
    res.redirect('/kas');
});

// Hapus Universal (Eq ke kolom "ID" huruf besar)
app.get('/hapus/:tabel/:id', async (req, res) => {
    const { tabel, id } = req.params;
    let target = tabel === 'shipping' ? "SHIPPING SARINA" : (tabel === 'stok' ? "STOK SARINA" : "KAS SARINA");
    await supabase.from(target).delete().eq("ID", id);
    res.redirect(tabel === 'shipping' ? '/' : `/${tabel}`);
});

app.listen(3000, () => console.log("🚀 Sarina Online di http://localhost:3000"));
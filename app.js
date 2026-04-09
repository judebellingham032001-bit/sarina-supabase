import express from "express";
import { supabase } from "./config/supabase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Helper untuk format tanggal di sisi Server (Opsional, tapi kita pakai di EJS saja)
const formatTanggal = (dateStr) => {
    const opsi = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', opsi);
};

// --- ROUTES ---
app.get('/', async (req, res) => {
    const { bulan } = req.query;
    let query = supabase.from("SHIPPING SARINA").select("*");
    if (bulan) query = query.gte("Tanggal", `${bulan}-01`).lte("Tanggal", `${bulan}-31`);
    const { data } = await query.order("Tanggal", { ascending: true });
    res.render("shipping", { dataShipping: data || [], menu: 'shipping', filterBulan: bulan || '', formatTanggal });
});

app.get('/kas', async (req, res) => {
    const { bulan } = req.query;
    let query = supabase.from("KAS SARINA").select("*");
    if (bulan) query = query.gte("Tanggal", `${bulan}-01`).lte("Tanggal", `${bulan}-31`);
    const { data } = await query.order("Tanggal", { ascending: true });
    res.render("kas", { dataKas: data || [], menu: 'kas', filterBulan: bulan || '', formatTanggal });
});

app.get('/stok', async (req, res) => {
    const { data } = await supabase.from("STOK SARINA").select("*").order("Nama_Barang", { ascending: true });
    res.render("stok", { dataStok: data || [], menu: 'stok' });
});

// --- API INPUT ---
app.post('/tambah-shipping', async (req, res) => {
    const { tanggal, spx, jne, jnt, same } = req.body;
    const total = (parseInt(spx)||0) + (parseInt(jne)||0) + (parseInt(jnt)||0) + (parseInt(same)||0);
    await supabase.from("SHIPPING SARINA").insert([{ 
        Tanggal: tanggal, SPX: spx, JNE: jne, JNT: jnt, "SAMEDAY/INSTANT": same, "TOTAL Paket": total 
    }]);
    res.redirect('/');
});

app.post('/tambah-kas', async (req, res) => {
    const { tanggal, keterangan, debet, kredit, bukti } = req.body;
    await supabase.from("KAS SARINA").insert([{ 
        Tanggal: tanggal, Keterangan: keterangan, Debet: debet || 0, Kredit: kredit || 0, Bukti: bukti 
    }]);
    res.redirect('/kas');
});

app.get('/hapus/:tabel/:id', async (req, res) => {
    const { tabel, id } = req.params;
    let target = tabel === 'shipping' ? "SHIPPING SARINA" : (tabel === 'stok' ? "STOK SARINA" : "KAS SARINA");
    await supabase.from(target).delete().eq("ID", id);
    res.redirect('back');
});

app.listen(3000, () => console.log("🚀 Sarina System Pro Active!"));

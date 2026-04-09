import express from "express";
import { supabase } from "./config/supabase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// --- 1. SHIPPING (Tampilan & Input) ---
app.get('/', async (req, res) => {
    const { bulan } = req.query; 
    try {
        let query = supabase.from("SHIPPING SARINA").select("*");
        if (bulan) {
            query = query.gte("Tanggal", `${bulan}-01`).lte("Tanggal", `${bulan}-31`);
        }
        const { data, error } = await query.order("Tanggal", { ascending: true });
        res.render("shipping", { dataShipping: data || [], menu: 'shipping', filterBulan: bulan || '' });
    } catch (err) { res.send(err.message); }
});

app.post('/tambah-shipping', async (req, res) => {
    const { tanggal, spx, jne, jnt, same } = req.body;
    const total = parseInt(spx) + parseInt(jne) + parseInt(jnt) + parseInt(same);
    await supabase.from("SHIPPING SARINA").insert([{ 
        Tanggal: tanggal, SPX: spx, JNE: jne, JNT: jnt, "SAMEDAY/INSTANT": same, "TOTAL Paket": total 
    }]);
    res.redirect('/');
});

// --- 2. KAS (Tampilan & Input) ---
app.get('/kas', async (req, res) => {
    const { bulan } = req.query;
    try {
        let query = supabase.from("KAS SARINA").select("*");
        if (bulan) {
            query = query.gte("Tanggal", `${bulan}-01`).lte("Tanggal", `${bulan}-31`);
        }
        const { data, error } = await query.order("Tanggal", { ascending: true });
        res.render("kas", { dataKas: data || [], menu: 'kas', filterBulan: bulan || '' });
    } catch (err) { res.send(err.message); }
});

app.post('/tambah-kas', async (req, res) => {
    const { tanggal, keterangan, debet, kredit, bukti } = req.body;
    await supabase.from("KAS SARINA").insert([{ 
        Tanggal: tanggal, Keterangan: keterangan, Debet: debet || 0, Kredit: kredit || 0, Bukti: bukti 
    }]);
    res.redirect('/kas');
});

// --- 3. STOK (Tampilan & Input) ---
app.get('/stok', async (req, res) => {
    try {
        const { data } = await supabase.from("STOK SARINA").select("*").order("Nama_Barang", { ascending: true });
        res.render("stok", { dataStok: data || [], menu: 'stok' });
    } catch (err) { res.send(err.message); }
});

app.post('/tambah-stok', async (req, res) => {
    const { nama, jumlah } = req.body;
    await supabase.from("STOK SARINA").insert([{ Nama_Barang: nama, Stok: jumlah }]);
    res.redirect('/stok');
});

// --- HAPUS ---
app.get('/hapus/:tabel/:id', async (req, res) => {
    const { tabel, id } = req.params;
    let target = tabel === 'shipping' ? "SHIPPING SARINA" : (tabel === 'stok' ? "STOK SARINA" : "KAS SARINA");
    await supabase.from(target).delete().eq("ID", id);
    res.redirect(tabel === 'shipping' ? '/' : `/${tabel}`);
});

app.listen(3000, () => console.log("Sarina System Ready!"));

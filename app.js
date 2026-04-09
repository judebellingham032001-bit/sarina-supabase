import express from "express";
import { supabase } from "./config/supabase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// --- 1. SHIPPING ---
app.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("SHIPPING SARINA")
            .select("*")
            .order("Tanggal", { ascending: false });

        if (error) throw error;
        res.render("shipping", { dataShipping: data || [], menu: 'shipping' });
    } catch (err) {
        console.error("❌ Error Shipping:", err.message);
        res.render("shipping", { dataShipping: [], menu: 'shipping' });
    }
});

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
        console.error("❌ Gagal Tambah:", err.message);
    }
    res.redirect('/');
});

// --- 2. STOK ---
app.get('/stok', async (req, res) => {
    const { data, error } = await supabase.from("STOK SARINA").select("*").order("ID", { ascending: true });
    res.render("stok", { dataStok: data || [], menu: 'stok' });
});

// --- 3. KAS ---
app.get('/kas', async (req, res) => {
    const { data, error } = await supabase.from("KAS SARINA").select("*").order("ID", { ascending: false });
    res.render("kas", { dataKas: data || [], menu: 'kas' });
});

// --- 4. HAPUS DATA ---
app.get('/hapus/:tabel/:id', async (req, res) => {
    const { tabel, id } = req.params;
    let target = tabel === 'shipping' ? "SHIPPING SARINA" : (tabel === 'stok' ? "STOK SARINA" : "KAS SARINA");
    
    await supabase.from(target).delete().eq("ID", id);
    res.redirect(tabel === 'shipping' ? '/' : `/${tabel}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sarina Dashboard Online di Port ${PORT}`));

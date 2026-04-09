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
        
        // Kirim data ke EJS
        res.render("shipping", { 
            dataShipping: data || [], 
            menu: 'shipping',
            error: null 
        });
    } catch (err) {
        console.error("❌ Database Error:", err.message);
        res.render("shipping", { 
            dataShipping: [], 
            menu: 'shipping', 
            error: err.message 
        });
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
        console.error("❌ Gagal Tambah:", err.message);
    }
    res.redirect('/');
});

// --- 2. HAPUS DATA ---
app.get('/hapus/:tabel/:id', async (req, res) => {
    const { tabel, id } = req.params;
    let target = tabel === 'shipping' ? "SHIPPING SARINA" : (tabel === 'stok' ? "STOK SARINA" : "KAS SARINA");
    try {
        await supabase.from(target).delete().eq("ID", id);
    } catch (err) {
        console.error("❌ Gagal Hapus:", err.message);
    }
    res.redirect(tabel === 'shipping' ? '/' : `/${tabel}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sarina Online di Port ${PORT}`));

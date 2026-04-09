import express from "express";
import { supabase } from "./config/supabase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// HELPER: Format Tanggal Indonesia
const formatTgl = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
};

// --- ROUTE KAS ---
app.get('/kas', async (req, res) => {
    const { bulan, tahun } = req.query;
    try {
        let query = supabase.from("KAS SARINA").select("*");
        if (bulan && tahun) {
            query = query.gte("Tanggal", `${tahun}-${bulan}-01`).lte("Tanggal", `${tahun}-${bulan}-31`);
        } else {
            query = query.limit(10);
        }
        const { data, error } = await query.order("Tanggal", { ascending: false });
        if (error) throw error;

        res.render("kas", { 
            dataKas: data || [], 
            menu: 'kas', 
            selBulan: bulan || '', 
            selTahun: tahun || '',
            formatTgl 
        });
    } catch (err) { res.status(500).send(err.message); }
});

// --- ROUTE SHIPPING ---
app.get('/', async (req, res) => {
    const { bulan, tahun } = req.query;
    try {
        let query = supabase.from("SHIPPING SARINA").select("*");
        if (bulan && tahun) {
            query = query.gte("Tanggal", `${tahun}-${bulan}-01`).lte("Tanggal", `${tahun}-${bulan}-31`);
        } else {
            query = query.limit(10);
        }
        const { data, error } = await query.order("Tanggal", { ascending: false });
        if (error) throw error;

        res.render("shipping", { 
            dataShipping: data || [], 
            menu: 'shipping', 
            selBulan: bulan || '', 
            selTahun: tahun || '',
            formatTgl 
        });
    } catch (err) { res.status(500).send(err.message); }
});

// --- API TAMBAH KAS ---
app.post('/tambah-kas', async (req, res) => {
    const { tanggal, keterangan, debet, kredit, bukti } = req.body;
    await supabase.from("KAS SARINA").insert([{ 
        Tanggal: tanggal, 
        Keterangan: keterangan, 
        Debet: debet || 0, 
        Kredit: kredit || 0, 
        "Bukti Transaksi": bukti 
    }]);
    res.redirect('/kas');
});

// --- API HAPUS ---
app.get('/hapus/:tabel/:id', async (req, res) => {
    const { tabel, id } = req.params;
    const target = tabel === 'kas' ? "KAS SARINA" : "SHIPPING SARINA";
    await supabase.from(target).delete().eq("ID", id);
    res.redirect('back');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server jalan di http://localhost:${PORT}`));

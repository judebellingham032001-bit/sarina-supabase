import express from "express";
import { supabase } from "./config/supabase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// HELPER: Format Tanggal Lengkap (Contoh: 10 April 2026)
const formatTgl = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
};

app.get('/kas', async (req, res) => {
    const { bulan, tahun } = req.query;
    try {
        let query = supabase.from("KAS SARINA").select("*").order("Tanggal", { ascending: true });
        const { data: allData } = await query;

        let totalSaldo = 0;
        const mappedData = allData.map(item => {
            totalSaldo = totalSaldo + (item.Kredit || 0) - (item.Debet || 0);
            return { ...item, saldoBerjalan: totalSaldo };
        });

        let displayData = mappedData;
        if (bulan && tahun) {
            displayData = mappedData.filter(item => item.Tanggal.startsWith(`${tahun}-${bulan}`));
        } else {
            // Default: Ambil 10 transaksi terakhir (Urut: Lama ke Baru)
            displayData = mappedData.slice(-10);
        }

        res.render("kas", { 
            dataKas: displayData, 
            totalSaldo, 
            menu: 'kas', 
            selBulan: bulan || '', 
            selTahun: tahun || '',
            formatTgl 
        });
    } catch (err) { res.status(500).send(err.message); }
});

app.post('/tambah-kas', async (req, res) => {
    const { tanggal, kategori, keterangan, debet, kredit, bukti } = req.body;
    await supabase.from("KAS SARINA").insert([{ 
        Tanggal: tanggal, Kategori: kategori, Keterangan: keterangan, 
        Debet: debet || 0, Kredit: kredit || 0, "Bukti Transaksi": bukti 
    }]);
    res.redirect('/kas');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sarina Pro Online!`));

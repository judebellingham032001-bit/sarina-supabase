import express from "express";
import { supabase } from "./config/supabase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

const formatTgl = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// --- ROUTE KAS ---
app.get('/kas', async (req, res) => {
    const { bulan, tahun } = req.query;
    try {
        // Ambil semua data untuk menghitung saldo (fitur fit sesuai database)
        let query = supabase.from("KAS SARINA").select("*").order("Tanggal", { ascending: true });
        
        const { data: allData, error } = await query;
        if (error) throw error;

        // Hitung Saldo Berjalan
        let totalSaldo = 0;
        const dataWithSaldo = allData.map(item => {
            totalSaldo = totalSaldo + (item.Kredit || 0) - (item.Debet || 0); // Kredit - Debet sesuai gambar kamu
            return { ...item, saldoBerjalan: totalSaldo };
        });

        // Balik urutan untuk tampilan web (terbaru di atas)
        let displayData = [...dataWithSaldo].reverse();

        // Filter jika ada input bulan & tahun
        if (bulan && tahun) {
            displayData = displayData.filter(item => 
                item.Tanggal.startsWith(`${tahun}-${bulan}`)
            );
        } else {
            displayData = displayData.slice(0, 15); // Default tampilkan 15 transaksi terakhir
        }

        res.render("kas", { 
            dataKas: displayData, 
            totalSaldo: totalSaldo, // Kirim saldo akhir ke web
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
        Tanggal: tanggal, 
        Kategori: kategori,
        Keterangan: keterangan, 
        Debet: debet || 0, 
        Kredit: kredit || 0, 
        "Bukti Transaksi": bukti 
    }]);
    res.redirect('/kas');
});

app.get('/hapus/kas/:id', async (req, res) => {
    await supabase.from("KAS SARINA").delete().eq("ID", req.params.id);
    res.redirect('/kas');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sarina Pro Online!`));

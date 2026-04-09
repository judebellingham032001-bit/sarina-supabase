app.get('/kas', async (req, res) => {
    const { bulan, tahun } = req.query;
    try {
        let query = supabase.from("KAS SARINA").select("*");

        if (bulan && tahun) {
            // Filter berdasarkan bulan & tahun pilihan
            const start = `${tahun}-${bulan}-01`;
            const end = `${tahun}-${bulan}-31`;
            query = query.gte("Tanggal", start).lte("Tanggal", end).order("Tanggal", { ascending: true });
        } else {
            // Default: 10 Transaksi Terakhir
            query = query.order("Tanggal", { ascending: false }).limit(10);
        }

        const { data } = await query;
        
        // Balik urutan jika sedang filter supaya yang terbaru di bawah
        const finalData = bulan ? data : data.reverse();

        res.render("kas", { 
            dataKas: finalData || [], 
            menu: 'kas', 
            selBulan: bulan || '', 
            selTahun: tahun || '',
            tglIndo // Gunakan fungsi format tanggal yang sudah ada
        });
    } catch (err) { res.send(err.message); }
});

app.get('/kas', async (req, res) => {
    const { bulan, tahun } = req.query;
    try {
        let query = supabase.from("KAS SARINA").select("*");

        if (bulan && tahun) {
            // Jika ada filter, cari berdasarkan range bulan tersebut
            const start = `${tahun}-${bulan}-01`;
            const end = `${tahun}-${bulan}-31`;
            query = query.gte("Tanggal", start).lte("Tanggal", end).order("Tanggal", { ascending: false });
        } else {
            // DEFAULT: Ambil 10 data paling baru saja
            query = query.order("Tanggal", { ascending: false }).limit(10);
        }

        const { data, error } = await query;
        if (error) throw error;

        res.render("kas", { 
            dataKas: data || [], 
            menu: 'kas', 
            selBulan: bulan || '', 
            selTahun: tahun || '',
            // Fungsi format tanggal langsung di sini
            formatTgl: (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        });
    } catch (err) { res.status(500).send(err.message); }
});

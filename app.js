// --- KAS (Filter & Default 10 Data) ---
app.get('/kas', async (req, res) => {
    const { bulan, tahun } = req.query;
    try {
        let query = supabase.from("KAS SARINA").select("*");
        if (bulan && tahun) {
            query = query.gte("Tanggal", `${tahun}-${bulan}-01`).lte("Tanggal", `${tahun}-${bulan}-31`).order("Tanggal", { ascending: false });
        } else {
            query = query.order("Tanggal", { ascending: false }).limit(10);
        }
        const { data } = await query;
        res.render("kas", { 
            dataKas: data || [], 
            menu: 'kas', 
            selBulan: bulan || '', 
            selTahun: tahun || '',
            formatTgl: (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        });
    } catch (err) { res.send(err.message); }
});

// --- SHIPPING (Filter & Default 10 Data) ---
app.get('/', async (req, res) => {
    const { bulan, tahun } = req.query;
    try {
        let query = supabase.from("SHIPPING SARINA").select("*");
        if (bulan && tahun) {
            query = query.gte("Tanggal", `${tahun}-${bulan}-01`).lte("Tanggal", `${tahun}-${bulan}-31`).order("Tanggal", { ascending: false });
        } else {
            query = query.order("Tanggal", { ascending: false }).limit(10);
        }
        const { data } = await query;
        res.render("shipping", { 
            dataShipping: data || [], 
            menu: 'shipping', 
            selBulan: bulan || '', 
            selTahun: tahun || '',
            formatTgl: (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        });
    } catch (err) { res.send(err.message); }
});

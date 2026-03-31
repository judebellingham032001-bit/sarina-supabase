// ISI FILE script.js
const SUPABASE_URL = 'https://lrcfmhxaeocrzddjqcye.supabase.co';
const SUPABASE_KEY = 'sb_publishable_K0ssZjXCyRtBkQHmuvIoEw_jXqVKUPe'; // <--- Tempel kuncinya langsung di sini!

// Pastikan panggilannya 'supabase.createClient'
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let menuAktif = 'stok';

function pindahMenu(menu) {
    menuAktif = menu;
    const judul = {
        'stok': '📦 Stok Barang',
        'kas': '💰 Catatan Kas',
        'pengiriman': '🚚 Status Pengiriman'
    };
    document.getElementById('judul-halaman').innerText = judul[menu];
    ambilData();
}

async function ambilData() {
    const tbody = document.getElementById('tabel-body');
    const thead = document.getElementById('tabel-head');
    
    let namaTabel = 'data_stok';
    if (menuAktif === 'kas') namaTabel = 'data_kas';
    if (menuAktif === 'pengiriman') namaTabel = 'data_pengiriman';

    const { data, error } = await _supabase.from(namaTabel).select('*');

    if (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="4">Error: ${error.message}</td></tr>`;
        return;
    }

    if (menuAktif === 'stok') {
        thead.innerHTML = `<tr><th>Nama Produk</th><th>Stok</th><th>Satuan</th><th>Status</th></tr>`;
        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${item.nama_barang}</td>
                <td>${item.stok}</td>
                <td>${item.satuan}</td>
                <td style="color: ${item.stok <= 2 ? 'orange' : 'green'}; font-weight:bold;">
                    ${item.stok <= 2 ? 'Tipis' : 'Aman'}
                </td>
            </tr>`).join('');
    } else if (menuAktif === 'kas') {
        thead.innerHTML = `<tr><th>Tanggal</th><th>Keterangan</th><th>Jumlah</th><th>Tipe</th></tr>`;
        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${new Date(item.created_at || Date.now()).toLocaleDateString('id-ID')}</td>
                <td>${item.keterangan || '-'}</td>
                <td>Rp ${parseInt(item.jumlah || 0).toLocaleString('id-ID')}</td>
                <td style="color: ${item.tipe === 'Masuk' ? 'green' : 'red'}; font-weight:bold;">${item.tipe}</td>
            </tr>`).join('');
    } else if (menuAktif === 'pengiriman') {
        thead.innerHTML = `<tr><th>Penerima</th><th>Ekspedisi</th><th>Resi</th><th>Status</th></tr>`;
        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${item.nama_pengirima}</td>
                <td>${item.ekspedisi}</td>
                <td>${item.resi}</td>
                <td style="color: ${item.status === 'Terkirim' ? 'green' : 'orange'}; font-weight:bold;">${item.status || 'Proses'}</td>
            </tr>`).join('');
    }
}

document.addEventListener('DOMContentLoaded', ambilData);

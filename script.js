const SUPABASE_URL = 'https://lrcfmhxaeocrzddjqcye.supabase.co';
const SUPABASE_KEY = 'sb_publishable_K0ssZjXCyRtBkQHmuvIoEw_jXqVKUPe'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let menuAktif = 'stok';

function pindahMenu(menu) {
    menuAktif = menu;
    const judul = { 'stok': '📦 Stok Barang', 'kas': '💰 Catatan Kas', 'pengiriman': '🚚 Pengiriman' };
    document.getElementById('judul-halaman').innerText = judul[menu];
    ambilData();
}

// Fungsi Format Rupiah
const formatRP = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

async function ambilData() {
    const tbody = document.getElementById('tabel-body');
    const thead = document.getElementById('tabel-head');
    let namaTabel = menuAktif === 'stok' ? 'data_stok' : (menuAktif === 'kas' ? 'data_kas' : 'data_pengiriman');

    const { data, error } = await _supabase.from(namaTabel).select('*');
    if (error) { tbody.innerHTML = `<tr><td>Error: ${error.message}</td></tr>`; return; }

    if (menuAktif === 'stok') {
        thead.innerHTML = `<tr><th>Produk</th><th>Stok</th><th>Satuan</th><th>Status</th></tr>`;
        tbody.innerHTML = data.map(item => `
            <tr>
                <td><b>${item.nama_barang}</b></td>
                <td>${item.stok}</td>
                <td>${item.satuan}</td>
                <td><span class="badge ${item.stok <= 2 ? 'bg-warn' : 'bg-success'}">${item.stok <= 2 ? 'Tipis' : 'Aman'}</span></td>
            </tr>`).join('');
    } else if (menuAktif === 'kas') {
        thead.innerHTML = `<tr><th>Tanggal</th><th>Ket</th><th>Jumlah</th><th>Tipe</th></tr>`;
        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                <td>${item.keterangan || '-'}</td>
                <td>${formatRP(item.jumlah)}</td>
                <td><span class="badge ${item.tipe === 'Masuk' ? 'bg-success' : 'bg-danger'}">${item.tipe}</span></td>
            </tr>`).join('');
    } else if (menuAktif === 'pengiriman') {
        thead.innerHTML = `<tr><th>Penerima</th><th>Ekspedisi</th><th>Resi</th><th>Status</th></tr>`;
        tbody.innerHTML = data.map(item => `
            <tr>
                <td><b>${item.nama_pengirima}</b></td>
                <td>${item.ekspedisi}</td>
                <td><code>${item.resi}</code></td>
                <td><span class="badge ${item.status === 'sudah kirim' ? 'bg-success' : 'bg-info'}">${item.status || 'proses'}</span></td>
            </tr>`).join('');
    }
}

// Fungsi Search
function filterTabel() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.getElementById("tabel-body").getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = rows[i].innerText.toLowerCase().includes(input) ? "" : "none";
    }
}

document.addEventListener('DOMContentLoaded', ambilData);

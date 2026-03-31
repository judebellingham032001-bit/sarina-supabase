alert("Halo! MEKI jalan!");
console.log("Script mulai berjalan...");

const SUPABASE_URL = 'https://lrcfmhxaeocrzddjqcye.supabase.co'; // Ganti ini
const SUPABASE_KEY = 'sb_publishable_K0ssZjXCyRtBkQHMuvIoEw_jXqVKUPe'; // Ganti ini
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function ambilData() {
    const { data, error } = await _supabase
        .from('data_stok')
        .select('*');

    if (error) {
        console.error("Error:", error.message);
        return;
    }

    const tbody = document.getElementById('tabel-body');
    tbody.innerHTML = '';

    data.forEach(item => {
        let status = "Aman";
        let warna = "green";

        if (item.stok == 0) { status = "Habis"; warna = "red"; }
        else if (item.stok <= 2) { status = "Tipis"; warna = "orange"; }

        tbody.innerHTML += `
            <tr>
                <td>${item.nama_barang}</td>
                <td>${item.stok}</td>
                <td>${item.satuan}</td>
                <td style="color: ${warna}; font-weight: bold;">${status}</td>
            </tr>`;
    });
}

document.addEventListener('DOMContentLoaded', ambilData);

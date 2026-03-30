import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function HalamanStok() {
  const { data: stok } = await supabase
    .from('laporan_stok_gacor')
    .select('*')

  return (
    <div className="p-8 font-sans bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-2">📦 Dashboard Sarina</h1>
      <p className="text-gray-500 mb-6">Update Otomatis dari Database</p>
      
      <nav className="flex gap-4 mb-8">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-md">Stok Barang</button>
        <button className="bg-gray-100 px-6 py-2 rounded-full text-gray-400 cursor-not-allowed">Kas (Soon)</button>
        <button className="bg-gray-100 px-6 py-2 rounded-full text-gray-400 cursor-not-allowed">Pengiriman (Soon)</button>
      </nav>

      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-bold text-gray-700">Nama Produk</th>
              <th className="p-4 font-bold text-gray-700 text-center">Stok</th>
              <th className="p-4 font-bold text-gray-700">Satuan</th>
              <th className="p-4 font-bold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {stok?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">{item.nama_barang}</td>
                <td className="p-4 text-center font-mono">{item.stok}</td>
                <td className="p-4 text-gray-600 uppercase text-sm">{item.satuan}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status_barang.includes('HABIS') ? 'bg-red-100 text-red-600' :
                    item.status_barang.includes('TIPIS') ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {item.status_barang}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

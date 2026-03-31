'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Inisialisasi Supabase langsung di sini biar simpel buat awal
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [stok, setStok] = useState([])

  useEffect(() => {
    async function ambilData() {
const { data, error } = await supabase.from('data_stok').select('*')
      
      if (error) {
        console.error('Ada error nih, Bos:', error.message)
      } else {
        console.log('Data masuk:', data)
        setStok(data)
      }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Laporan Stok Sarina</h1>
      <ul>
        {stok.map((item, index) => (
          <li key={index}>
            {item.nama_barang}: {item.stok} {item.satuan}
          </li>
        ))}
      </ul>
    </div>
  )
}

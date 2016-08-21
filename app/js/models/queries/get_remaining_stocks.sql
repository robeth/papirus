SELECT sd.id AS id,
       sd.tanggal,
       sd.kode,
       sd.jumlah AS jumlah_in,
       coalesce(i.jumlah,0) AS jumlah_konversi,
       coalesce(p.jumlah, 0) AS jumlah_penjualan,
       sd.jumlah - coalesce(i.jumlah,0)- coalesce(p.jumlah,0) AS sisa
FROM transaction_stok_det sd
LEFT OUTER JOIN
 ( SELECT ki.stok_id,
          sum(ki.jumlah) as jumlah
  FROM transaction_detailin ki
  GROUP BY ki.stok_id ) i ON sd.id = i.stok_id
LEFT OUTER JOIN
 ( SELECT ss.stok_id,
          sum(ss.jumlah) as jumlah
  FROM transaction_detailpenjualan ss
  GROUP BY ss.stok_id ) p ON sd.id = p.stok_id
WHERE sd.kategori_id = :categoryId
ORDER BY sd.tanggal

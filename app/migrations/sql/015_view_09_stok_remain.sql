CREATE OR REPLACE VIEW `stok_remain` AS
SELECT
      `k`.`id` AS `id`,
      `k`.`kode` AS `kode`,
      `k`.`nama` AS `nama`,
      `k`.`satuan` AS `satuan`,
      `k`.`stabil` AS `stabil`,
      `k`.`fluktuatif` AS `fluktuatif`,
       coalesce(`ins`.`jumlah`,0) AS `jumlah_in`,
       coalesce(`op`.`jumlah`,0) AS `jumlah_penjualan`,
       coalesce(`ok`.`jumlah`,0) AS `jumlah_konversi`,
       ((coalesce(`ins`.`jumlah`,0) - coalesce(`op`.`jumlah`,0)) - coalesce(`ok`.`jumlah`,0)) AS `sisa`
FROM (((`transaction_kategori` `k`
        LEFT JOIN `transaction_out_konversi` `ok` on((`k`.`kode` = `ok`.`kode`)))
       LEFT JOIN `transaction_out_penjualan` `op` on((`k`.`kode` = `op`.`kode`)))
      LEFT JOIN `transaction_in_stok` `ins` on((`k`.`kode` = `ins`.`kode`)))

CREATE VIEW `transaction_in_stok` AS
SELECT
      `sd`.`id` AS `id`,
      `sd`.`kode` AS `kode`,
       sum(`sd`.`jumlah`) AS `jumlah`
FROM `transaction_stok_det` `sd`
GROUP BY `sd`.`kode`
ORDER BY `sd`.`kode`

var RawQueries = function(sequelize){
  return {
    stockFlow: function(startDate, endDate){
      var CATEGORY_QUERY = "select kode, nama from transaction_kategori";
      var SALE_QUERY = "select sd.kode as kode, sum(dp.jumlah) as jumlah from transaction_penjualan p, transaction_detailpenjualan dp,  transaction_stok_det sd where p.id = dp.penjualan_id and sd.id = dp.stok_id and	(p.tanggal between :startDate and :endDate) group by sd.kode";
      var INDIVIDUAL_DEPOSIT_QUERY = "select sd.kode as kode, sum(sd.jumlah) as jumlah from transaction_pembelian p, transaction_pembelian_stocks ps, transaction_stok_det sd, transaction_nasabah n where p.id = ps.pembelian_id and ps.stok_id = sd.id and p.nasabah_id = n.id and n.jenis = 'individu' and (p.tanggal between :startDate and :endDate) group by sd.kode";
      var GROUP_DEPOSIT_QUERY = "select sd.kode as kode, sum(sd.jumlah) as jumlah from transaction_pembelian p, transaction_pembelian_stocks ps, transaction_stok_det sd, transaction_nasabah n where p.id = ps.pembelian_id and ps.stok_id = sd.id and p.nasabah_id = n.id and n.jenis = 'kolektif' and (p.tanggal between :startDate and :endDate) group by sd.kode";
      var CONVERTION_INPUT = "select sd.kode as kode, sum(di.jumlah) as jumlah from transaction_konversi k, transaction_detailin di, transaction_stok_det sd where  k.id = di.konversi_id and di.stok_id = sd.id and (k.tanggal between :startDate and :endDate) group by sd.kode";
      var CONVERTION_OUTPUT = "select sd.kode as kode, sum(sd.jumlah) as jumlah from transaction_konversi k, transaction_konversi_outs ko, transaction_stok_det sd where k.id = ko.konversi_id and ko.stok_id = sd.id and (k.tanggal between :startDate and :endDate) group by sd.kode";

      var normalQueryParams = {
        type: sequelize.QueryTypes.SELECT
      };

      var dateQueryParams = {
        replacements: {
          startDate: startDate,
          endDate: endDate
        },
        type: sequelize.QueryTypes.SELECT
      };
      var result = {};

      return sequelize
        .query(CATEGORY_QUERY, normalQueryParams)
        .then(function(categories){
          categories.forEach(function(category){
            result[category.kode] = result[category.kode] || {}
            result[category.kode].kode = category.kode;
            result[category.kode].nama = category.nama;
          });

          return sequelize.query(SALE_QUERY, dateQueryParams);
        })
        .then(function(saleSummary){
          saleSummary.forEach(function(saleEntry){
            result[saleEntry.kode].sale = saleEntry.jumlah;
          });

          return sequelize.query(INDIVIDUAL_DEPOSIT_QUERY, dateQueryParams);
        })
        .then(function(individualDepositSummary){
          individualDepositSummary.forEach(function(individualDepositEntry){
            result[individualDepositEntry.kode].individualDeposit = individualDepositEntry.jumlah;
          });

          return sequelize.query(GROUP_DEPOSIT_QUERY, dateQueryParams);
        })
        .then(function(groupDepositSummary){
          groupDepositSummary.forEach(function(groupDepositEntry){
            result[groupDepositEntry.kode].groupDeposit = groupDepositEntry.jumlah;
          });

          return sequelize.query(CONVERTION_INPUT, dateQueryParams);
        })
        .then(function(convertionInputSummary){
          convertionInputSummary.forEach(function(convertionInputEntry){
            result[convertionInputEntry.kode].convertionInput = convertionInputEntry.jumlah;
          });

          return sequelize.query(CONVERTION_OUTPUT, dateQueryParams);
        })
        .then(function(convertionOutputSummary){
          convertionOutputSummary.forEach(function(convertionOutputEntry){
            result[convertionOutputEntry.kode].convertionOutput = convertionOutputEntry.jumlah;
          });
          var arrayResult = [];

          for(var property in result){
            if(result.hasOwnProperty(property)){
              arrayResult.push(result[property]);
            }
          }

          return arrayResult;
        });
    }
  }
}

module.exports = RawQueries;

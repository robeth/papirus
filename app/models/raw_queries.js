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
    },

    unsettledDeposit: function(accountType, startDate, endDate){
      var Pembelian = sequelize.models.Pembelian;
      return Pembelian.findAll({
        attributes: {
          include: [[sequelize.fn('SUM', sequelize.col('`Penarikans`.`PenarikanDetail`.`jumlah`')), 'taken']]
        },
        include: [
          { model: sequelize.models.Penarikan, as: 'Penarikans'},
          {
            model: sequelize.models.Nasabah,
            as: 'Nasabah',
            where: {
              jenis: accountType
            }
          }
        ],
        where: {
          tanggal: {
            $between: [startDate, endDate]
          }
        },
        group: ['id']
      }).then(function(pembelians){
        var pembelianPromises = [];

        pembelians.map(function(pembelian){
          var pembelianPromise = pembelian.getValue()
            .then(function(value){
              pembelian.totalValue = value;
              pembelian.paidValue = pembelian.get('taken');
              pembelian.remainingValue = value - pembelian.get('taken');
              return pembelian;
            });
          pembelianPromises.push(pembelianPromise);
          return pembelianPromise;
        });

        return Promise.all(pembelianPromises);
      }).then(function(pembelians){
        var unsettledPembelians = pembelians.filter(function(pembelian){
          return pembelian.remainingValue > 0;
        });

        var unsettledDepositHash = {};

        unsettledPembelians.forEach(function(pembelian){
          unsettledDepositHash[pembelian.nasabah_id] =
            unsettledDepositHash[pembelian.nasabah_id] ||
            {deposits: [], totalUnsettled: 0};
          unsettledDepositHash[pembelian.nasabah_id].deposits.push(pembelian);
          unsettledDepositHash[pembelian.nasabah_id].totalUnsettled += pembelian.remainingValue;
        });

        var unsettledDepositResult = [];
        for(var accountId in unsettledDepositHash) {
          if(unsettledDepositHash.hasOwnProperty(accountId)){
            unsettledDepositResult.push(unsettledDepositHash[accountId]);
          }
        }

        return unsettledDepositResult;
      });
    }

  }
}

module.exports = RawQueries;

/* jshint indent: 2 */
var RawQuery = require('./queries');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Kategori', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    kode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    satuan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stabil: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00'
    },
    fluktuatif: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00'
    },
    report_kategori_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_reportkategori',
        key: 'id'
      }
    }
  }, {
    tableName: 'transaction_kategori',
    freezeTableName: true,
    classMethods: {
      getAvailability: function(){
        return sequelize.query(
          'SELECT * from stok_remain',
          {
            type: sequelize.QueryTypes.SELECT
          }
        );
      },
      isValidState: function(){
        return sequelize.models.Kategori.getRemainingStock()
          .then(function(remainingStocks){
            var isValid = true;
            for(var i = 0, n = remainingStocks.length; i < n; i++){
              if(remainingStocks.sisa < 0){
                isValid = false;
                break;
              }
            }
            return isValid;
          });
      },
      getRemainingStocks: function(categoryId){
        return sequelize.query(RawQuery.getRemainingStocks,
          {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
              categoryId: categoryId
            }
          }
        );
      }
    }
  });
};

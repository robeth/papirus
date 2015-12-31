var tableName = 'transaction_kategori';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 004');
    queryInterface.createTable(tableName, {
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
    }).then(function(){
      console.log("Migration 004 populate table transaction_kategori");
      return queryInterface.sequelize.query(
        "INSERT INTO `transaction_kategori` (`id`, `kode`, `nama`, `deskripsi`, `satuan`, `foto`, `stabil`, `fluktuatif`, `report_kategori_id`) VALUES" +
        "(6, 'B1', 'Super', 'Tebal, beton neser ', 'Kg ', '', 2500.00, 2500.00, 1)," +
        "(7, 'T', 'Tembaga', 'Isi Kabel, dinamo', 'Kg', '', 56500.00, 45500.00, 1)," +
        "(8, 'AL1', 'Plat', 'aluminium yang tebal ', 'Kg', '', 12500.00, 9500.00, 2)," +
        "(9, 'AL2', 'Siku', 'Tirai, Kusen, Rak, Jemuran,dll', 'Kg', '', 14500.00, 13000.00, 2)," +
        "(10, 'BT6', 'Beling', 'Pecahan Botol, Lampu,', 'Kg', '', 50.00, 50.00, 3)," +
        "(11, 'KN', 'Kuningan ', 'Kran warna kuning, barang antik dari kuningan ', 'Kg', '', 32000.00, 20500.00, 1)," +
        "(12, 'AL4', 'Panci dan Wajan ', 'Panci dan Wajan bekas ', 'Kg', '', 10500.00, 9800.00, 2," +
        "(13, 'AL5', 'Kaleng Aluminium', 'Kalengpocari,coca cola,yg tidak tertarik dgn magnet', 'Kg', '', 10000.00, 9500.00, 2)," +
        "(14, 'AL6', 'Parfum', 'Tempat parfum, Semprotan Serangga, tidak tertarik dgn magnet', 'Kg', '', 5000.00, 3600.00, 2)," +
        "(15, 'B2', 'Grabang/greed', 'Pipa, kompor,besi tipis ', 'Kg', '', 1700.00, 1700.00, 1)," +
        "(16, 'B3 ', 'Paku ', 'Paku', 'Kg', '', 1500.00, 1500.00, 1)," +
        "(17, 'B4', 'Kaleng ', 'Kaleng susu,blek,kawat,dll', 'Kg', '', 900.00, 900.00, 1)," +
        "(18, 'B5', 'Seng', 'seng', 'Kg', '', 200.00, 200.00, 1)," +
        "(19, 'B6', 'Gram', 'Serbuk besi, Serutan besi kecil', 'Kg', '', 1200.00, 1200.00, 1)," +
        "(20, 'BT1', 'Botol sirup', 'Sisa botol marjan,orson,dll', 'Biji', '', 100.00, 100.00, 3)," +
        "(21, 'BT2', 'Kecap/Saos besar', 'Bango, abc dll', 'Biji', '', 500.00, 500.00, 3)," +
        "(22, 'BT3', 'bensin bagus', 'botol bensin bening ', 'Biji', '', 400.00, 400.00, 3)," +
        "(23, 'BT4', 'bensin jelek', 'botol bnsin kotor', 'Biji', '', 300.00, 300.00, 3)," +
        "(24, 'BT5', 'bir', 'hanya botol bir bintang besar (hijau)', 'Biji', '', 1000.00, 800.00, 3)," +
        "(25, 'BT7', 'botol kecil putih ', 'botol you c 1000,', 'Kg', '', 200.00, 100.00, 3)," +
        "(26, 'k2', 'kardus  jelek', 'kardus basah, berminyak, tipis putih ', 'Kg', '', 800.00, 800.00, 6)," +
        "(27, 'K1', 'kardus bagus', 'kardus warna coklat kondisi bagus ', 'Kg', '', 1200.00, 1200.00, 6)," +
        "(28, 'K3', 'koran ', 'koran jawapost, dll', 'Kg', '', 1700.00, 1200.00, 6)," +
        "(29, 'K5 ', 'kertas HVS', 'kertas putih dengan atau tanpa tinta ', 'Kg', '', 1800.00, 1300.00, 6)," +
        "(30, 'K6', 'kertas buku buram', 'kertas yang warnanya agak coklat / abu-abu ', 'Kg', '', 800.00, 700.00, 6)," +
        "(31, 'K7', 'Sak Semen', 'kemasan semen ', 'Kg', '', 1100.00, 800.00, 6)," +
        "(32, 'K8', 'duplek', 'kertas rokok,kertas jelek,karton warna,brosur,dll', 'Kg', '', 400.00, 400.00, 6)," +
        "(33, 'P1', 'bak campur tanpa keras ', 'bak air, botol kosmetik,btl susu, tanpa keras ', 'Kg', '', 2200.00, 2000.00, 5)," +
        "(34, 'P2', 'bak hitam ', 'bak cuci, dll yang berwarna hitam (lentur)', 'Kg', '', 1200.00, 1000.00, 5)," +
        "(35, 'P3', 'Plastik keras', 'Plastik mainan anak2, helm, Cover (body) motor', 'Kg', '', 300.00, 300.00, 5)," +
        "(36, 'P5', 'Aqua gelas bersih', 'gelas putih bening tanpa ada warna/sablon ', 'Kg', '', 6000.00, 5000.00, 5)," +
        "(37, 'P6', 'Aqua gelas kotor', 'gelas putih bening tanpa ada warna/sablon', 'Kg', '', 4500.00, 3700.00, 5)," +
        "(38, 'P8', 'tutup galon/tutup Aqua botol', 'tutupnya galon/tutup botol', 'Kg', '', 2500.00, 2500.00, 5)," +
        "(39, 'P9', 'Botol putih bersih (PET)', 'Botol Aqua besar, sedang,pocari,dl', 'Kg', '', 4100.00, 3500.00, 5)," +
        "(40, 'P10', 'Botol putih kotor (PET)', 'Botol Aqua besar, sedang, pocari,dll', 'Kg', '', 3000.00, 2500.00, 5)," +
        "(41, 'PL1', 'Plastik Putih Bening ', 'plastik bening, tempat gula', 'Kg', '', 1000.00, 1000.00, 4)," +
        "(42, 'PL2', 'Plastik Kresek', 'plastik wadah barang berbagai warna ', 'Kg', '', 400.00, 400.00, 4)," +
        "(43, 'PL3', 'Plasik Sablon Tipis Tanpa Aluminium', 'Kemasan Indomie, Rinso Sachet kecil', 'Kg', '', 300.00, 200.00, 4)," +
        "(44, 'P11', 'Botol Minuman Warna Bersih (PET)', 'Botol-botol minuman selain warna putih dan sudah di berihkan dari lebel dan tutup', 'Kg', '', 3000.00, 2500.00, 5)," +
        "(45, 'P12', 'Botol Minuman Warna Kotor (PET)', 'Botol-botol minuman selain warna putih ', 'Kg', '', 2000.00, 1500.00, 5)," +
        "(46, 'P14', 'Paralon', 'Pipa', 'Kg', '', 300.00, 300.00, 5)," +
        "(47, 'P17', 'Kabel', 'Kulit Kabel', 'Kg', '', 1000.00, 1000.00, 5)," +
        "(48, 'P18', 'Tali Plastik', 'Tali Packing', 'Kg', '', 600.00, 400.00, 5)," +
        "(49, 'PL4', 'Plastik Sablon Tipis dengan Aluminium', 'Kemasan Pop Ice, Chiki, Kopi, Pepsodent', 'Kg', '', 100.00, 100.00,4)," +
        "(50, 'PL5', 'Kemasan Minyak Goreng', 'Plastik Sablon Tebal bening dan berminyak', 'Kg', '', 250.00, 150.00, 4)," +
        "(51, 'PL6', 'Plastik Sablon Tebal', 'Kemasan Molto, SuperPel, Sunlight, Softener', 'Kg', '', 250.00, 150.00, 4)," +
        "(52, 'P21', 'PS Kaca', 'Plastik Keras Bening', 'Kg', '', 300.00, 300.00, 5)," +
        "(53, 'AK', 'Aki (Accu)', 'Aki Mobil, Motor, dll', 'Kg', '', 7500.00, 6000.00, 1)," +
        "(54, 'CD', 'Kepingan CD', 'Kepngan CD / DVD', 'Kg', '', 2500.00, 2000.00, 1)," +
        "(55, 'G', 'Gembos', 'Sepatu atau sandal Karet bekas', 'Kg', '', 600.00, 500.00, 1)," +
        "(56, 'GL25', 'Glangsing 25 Kg', 'Glangsing 25 Kg', 'Biji', '', 200.00, 200.00, 1)," +
        "(57, 'GL50', 'Glangsing 50', 'Glangsing 50Kg dan diatasnya', 'Biji', '', 500.00, 500.00, 1)," +
        "(58, 'J', 'Jelantah', 'Jelantah bekas bening / hitam', 'Kg', '', 1500.00, 1300.00, 1)," +
        "(59, 'PR', 'Perunggu', 'Keran air putihan, Kampas rem, dudukan wadah Magic Com', 'Kg', '', 7800.00, 6200.00, 1)," +
        "(60, 'Kr', 'Karak', 'Nasi Aking', 'Kg', '', 1000.00, 750.00, 1)," +
        "(61, 'SL', 'Selang', 'Selang untuk Pancuran air', 'Kg', '', 850.00, 700.00, 1)," +
        "(62, 'b8', 'sepeda', 'Rangk Sepeda Bekas', 'Kg`', '', 1700.00, 1700.00, 1)," +
        "(63, 'P4', 'Blowing', 'Botol Shampo, Cleaner', 'Kg', '', 2200.00, 2000.00, 5)," +
        "(64, 'PL7', 'PS KACA', 'PLASTIK', 'KG', '', 1000.00, 1000.00, 4)," +
        "(65, 'P15', 'KARPET', 'TALANG', 'KG', '', 500.00, 500.00, 5)," +
        "(66, 'P13', 'PP BENING', 'BAK BENING', 'Kg', '', 2200.00, 2000.00, 5)," +
        "(67, 'P19', 'PLASTIK SUSU', 'BAK PUTIH SUSU', 'Kg', '', 2200.00, 2000.00, 5)," +
        "(68, 'P20', 'JERIGEN', 'JERIGEN', 'Kg', '', 2200.00, 2000.00, 5)," +
        "(69, 'B7', 'Sepeda', 'Besi Rangka Sepeda', 'Kg', '', 1700.00, 1700.00, 1)," +
        "(70, '0', 'Sampah', 'Segala Jenis barang yang tidak bisa terjual / sisa pembersihan kegiatan sortir', 'Kg', '', 0.00, 0.00, 1);");
    }).then(function(){
      console.log("Migration 004 finish populating");
    }).catch(function(error){
      console.log("Migration 004 failed:" + error);
    });
  },
  down: function(queryInterface, DataTypes){
    console.log("Down 004");
    queryInterface.dropTable(tableName);
  }
};

const mongoose = require('mongoose');
const User = require('../models/User'); // Model importu eklendi

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esmaaksu_db');
    console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);

    // Varsayılan Test Kullanıcılarını Oluştur
    const sellerExists = await User.findOne({ email: 'satici@rafarasi.com' });
    if (!sellerExists) {
      await User.create({
        _id: '609b5f5b5f5b5f5b5f5b5f5b', // String version is automatically cast to ObjectId implicitly if needed
        name: 'Örnek Satıcı',
        email: 'satici@rafarasi.com',
        password: '123',
        role: 'seller'
      });
      console.log('Test Satıcısı oluşturuldu (satici@rafarasi.com - Şifre: 123)');
    }

  } catch (error) {
    console.error(`Hata: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
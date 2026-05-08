const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');

dotenv.config({ path: './config/config.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esmaaksu_db');
    console.log('MongoDB Bağlantısı Başarılı...');

    // Temizlik
    await User.deleteMany();
    await Book.deleteMany();
    console.log('Eski veriler temizlendi...');

    // Kullanıcıları Oluştur
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@rafarasi.com',
      password: 'admin',
      role: 'admin'
    });

    const seller = await User.create({
      name: 'Esma Aksu',
      email: 'satici@rafarasi.com',
      password: '123',
      role: 'seller'
    });

    const buyer = await User.create({
      name: 'Ali Yılmaz',
      email: 'alici@rafarasi.com',
      password: '123',
      role: 'buyer'
    });

    console.log('Kullanıcılar oluşturuldu:');
    console.log('- Admin: admin@rafarasi.com / admin');
    console.log('- Satıcı: satici@rafarasi.com / 123');
    console.log('- Alıcı: alici@rafarasi.com / 123');

    // Örnek Kitaplar Ekle (Satıcıya bağlı)
    await Book.create([
      {
        title: 'Suç ve Ceza',
        author: 'Dostoyevski',
        category: 'Edebiyat',
        price: 45.90,
        description: 'Dünya klasiği başyapıt.',
        seller: seller._id,
        image: 'https://img.kitapyurdu.com/v1/getImage/fn:11246733/wh:true/wi:220'
      },
      {
        title: 'Küçük Prens',
        author: 'Antoine de Saint-Exupéry',
        category: 'Çocuk',
        price: 32.50,
        description: 'Her yaşa hitap eden bir masal.',
        seller: seller._id,
        image: 'https://img.kitapyurdu.com/v1/getImage/fn:11246733/wh:true/wi:220'
      }
    ]);

    console.log('Örnek kitaplar eklendi.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();

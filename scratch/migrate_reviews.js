const pool = require('../backend/config/database');

async function migrate() {
  try {
    console.log('Reviews tablosu oluşturuluyor...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`reviews\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`book_id\` int(11) NOT NULL,
        \`user_id\` int(11) NOT NULL,
        \`user_name\` varchar(100) NOT NULL,
        \`rating\` int(11) NOT NULL DEFAULT 5,
        \`comment\` text NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (\`id\`),
        FOREIGN KEY (\`book_id\`) REFERENCES \`books\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Başarılı!');
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

migrate();

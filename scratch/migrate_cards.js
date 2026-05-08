const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'esmaaksu_db'
    });

    console.log('Migrating: Creating saved_cards table...');
    
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS saved_cards (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            card_holder VARCHAR(255) NOT NULL,
            card_number VARCHAR(20) NOT NULL,
            expiry_date VARCHAR(10) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('Migration completed successfully.');
    await connection.end();
}

migrate().catch(console.error);

const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'esmaaksu_db'
    });

    console.log('Migrating: Creating user_addresses table...');
    
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS user_addresses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(100) NOT NULL,
            full_name VARCHAR(150) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            city VARCHAR(50) NOT NULL,
            district VARCHAR(50) NOT NULL,
            full_address TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('Migration completed successfully.');
    await connection.end();
}

migrate().catch(console.error);

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env from the correct path relative to this script
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'esmaaksu_db'
    });

    console.log('Migration started...');

    try {
        const tables = ['users', 'sellers', 'admins'];
        
        for (const table of tables) {
            console.log(`Checking table: ${table}`);
            const [columns] = await connection.query(`SHOW COLUMNS FROM ${table} LIKE 'profile_image'`);
            
            if (columns.length === 0) {
                console.log(`Adding profile_image column to ${table}...`);
                await connection.query(`ALTER TABLE ${table} ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL AFTER email`);
            } else {
                console.log(`Column profile_image already exists in ${table}.`);
            }
        }

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await connection.end();
    }
}

migrate();

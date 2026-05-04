const pool = require('../backend/config/database');

async function migrate() {
  try {
    console.log('Migrating database...');
    await pool.query('ALTER TABLE books ADD COLUMN page_count INT DEFAULT 0 AFTER author');
    console.log('Successfully added page_count column to books table.');
    process.exit(0);
  } catch (err) {
    if (err.code === 'ER_DUP_COLUMN') {
      console.log('Column page_count already exists.');
    } else {
      console.error('Migration failed:', err);
    }
    process.exit(1);
  }
}

migrate();

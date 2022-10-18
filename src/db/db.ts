import mysql from 'mysql';
const db = mysql.createConnection({
	host: 'localhost',
	user: 'admin',
	password: 'admin',
	database: 'my_db',
});

export default db;

export const authQueries = {
	insertUserByEmail: `INSERT INTO users(email, password) VALUES(?, ?);`,
	insertUserByPhoneNumber: `INSERT INTO users(phoneNumber, password) VALUES(?, ?);`,
	selectUserByEmail: `SELECT * FROM users WHERE email = ?;`,
	selectUserByPhoneNumber: `SELECT phoneNumber FROM users WHERE phoneNumber = ?;`,
};

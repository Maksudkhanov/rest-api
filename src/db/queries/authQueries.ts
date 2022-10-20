export const authQueries = {
	insertUserByEmail: `INSERT INTO users(email, password) VALUES(?, ?);`,
	insertUserByPhoneNumber: `INSERT INTO users(phoneNumber, password) VALUES(?, ?);`,
	selectUserByEmail: `SELECT * FROM users WHERE email = ?;`,
	selectUserByPhoneNumber: `SELECT * FROM users WHERE phoneNumber = ?;`,
	insertRefreshToken: `INSERT INTO refresh_tokens VALUES(?);`,
	selectRefreshToken: `SELECT * FROM refresh_tokens WHERE refresh_token = ?;`,
};

export const authQueries = {
	insertUserByEmail: `INSERT INTO users(email, password) VALUES(?, ?);`,
	insertUserByPhoneNumber: `INSERT INTO users(phoneNumber, password) VALUES(?, ?);`,
	selectUserByEmail: `SELECT id FROM users WHERE email = ?;`,
	selectUserByPhoneNumber: `SELECT id FROM users WHERE phoneNumber = ?;`,

	insertBearerToken: `INSERT INTO bearer_tokens VALUES(?, ?);`,
	selectBearerToken: `SELECT bearer_token FROM bearer WHERE id = ?;`,
	updateBearerToken: `UPDATE bearer_tokens SET bearer_token = ? WHERE id = ?;`,

	insertRefreshToken: `INSERT INTO refresh_tokens VALUES(?, ?);`,
	selectRefreshToken: `SELECT refresh_token FROM bearer WHERE ID = ?;`,
};

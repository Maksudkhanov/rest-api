export const authQueries = {
	insertUserByEmail: `INSERT INTO users(email, password) VALUES(?, ?);`,
	insertUserByPhoneNumber: `INSERT INTO users(phoneNumber, password) VALUES(?, ?);`,
	selectUserByEmail: `SELECT password FROM users WHERE email = ?;`,
	selectUserByPhoneNumber: `SELECT password FROM users WHERE phoneNumber = ?;`,

	insertBearerToken: `INSERT INTO bearer_tokens VALUES(?, ?);`,
	selectBearerToken: `SELECT bearer_token FROM bearer_tokens WHERE bearer_token = ?;`,
	updateBearerToken: `UPDATE bearer_tokens SET bearer_token = ? WHERE id = ?;`,

	insertRefreshToken: `INSERT INTO refresh_tokens VALUES(?);`,
	selectRefreshToken: `SELECT refresh_token FROM refresh_tokens WHERE refresh_token = ?;`,
};

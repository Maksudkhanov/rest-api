export const InitQueries = {
	dropTableUsers: `DROP TABLE IF EXISTS users;`,
	createTableUsers: `CREATE TABLE users(
   id INT NOT NULL AUTO_INCREMENT,
   email VARCHAR(20) UNIQUE,
	 phoneNumber VARCHAR(20) UNIQUE,
   password VARCHAR(100) NOT NULL,
   PRIMARY KEY ( id )
);`,

	dropTableBearerTokens: `DROP TABLE IF EXISTS bearer_tokens;`,
	createTableBearerTokens: `CREATE TABLE bearer_tokens (id VARCHAR(20) NOT NULL, bearer_token TEXT NOT NULL);`,

	dropTableRefreshTokens: `DROP TABLE IF EXISTS refresh_tokens;`,
	createTableRefreshTokens: `CREATE TABLE refresh_tokens (refresh_token TEXT NOT NULL);`,

	dropTableFiles: `DROP TABLE IF EXISTS files;`,
	createTableFiles: `CREATE TABLE files(
		id INT NOT NULL AUTO_INCREMENT,
		name TEXT NOT NULL,
		ext VARCHAR(50) NOT NULL,
		mimeType TEXT NOT NULL,
		sizeMb FLOAT NOT NULL,
		uploadedAt VARCHAR(20) NOT NULL,
		PRIMARY KEY ( id )
	);`,

	insertUser: `INSERT INTO users(email, password) VALUES('test@mail.ru', 'admin');`,
};

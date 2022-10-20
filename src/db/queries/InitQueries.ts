export const InitQueries = {
	dropTableUsers: `DROP TABLE IF EXISTS users;`,
	createTableUsers: `CREATE TABLE users(
   id INT NOT NULL AUTO_INCREMENT,
   email VARCHAR(20) UNIQUE,
	 phoneNumber VARCHAR(20) UNIQUE,
   password VARCHAR(100) NOT NULL,
   PRIMARY KEY ( id )
);`,
	dropTableRefreshTokens: `DROP TABLE IF EXISTS refresh_tokens;`,
	createTableRefreshTokens: `CREATE TABLE refresh_tokens (id VARCHAR(20) NOT NULL, refresh_token TEXT NOT NULL);`,
	insertUser: `INSERT INTO users(email,phoneNumber, password) VALUES('test@mail.com','+998935898756', 'admin');`,
};

export const fileQueries = {
	insertFile: `INSERT INTO files(name, ext, mimeType, sizeMb, createdAt) VALUES(?,?,?,?,?);`,
};

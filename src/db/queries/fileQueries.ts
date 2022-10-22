export const fileQueries = {
	insertFile: `INSERT INTO files(name, ext, mimeType, sizeMb, createdAt) VALUES(?,?,?,?,?);`,
	selectFileById: `SELECT name, ext, mimeType, sizeMb, createdAt FROM files WHERE id = ?`,
};

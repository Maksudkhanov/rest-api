export const fileQueries = {
	insertFile: `INSERT INTO files(name, ext, mimeType, sizeMb, uploadedAt) VALUES(?,?,?,?,?);`,
	selectFileById: `SELECT name, ext, mimeType, sizeMb, uploadedAt FROM files WHERE id = ?`,
	deleteFileById: `DELETE FROM files WHERE id = ?;`,
	updateFileById: `UPDATE files SET name=?, ext=?, mimeType=?, sizeMb=?, uploadedAt=? WHERE id =?;`,
};

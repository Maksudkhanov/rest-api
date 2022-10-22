const fs = require('fs');

// fs.readdirSync('./uploads').forEach((file) => {
// 	fs.readdirSync(file);
// });

const result = fs.readFileSync('uploads/Отчёт.docx', 'utf8');
console.log(result);
// fs.s

// console.log(file);

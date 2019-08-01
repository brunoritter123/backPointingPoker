const sqlite3 = require('sqlite3')

const createTable = () => {
	console.log("Criando tabelas");
	db.run(`
		CREATE TABLE IF NOT EXISTS carta(
			id INTEGER,
			value INTEGER,
			label TEXT,
			type TEXT)`);
}

let db = new sqlite3.Database("./dataBase.sqlite3", (err) => {
	if (err) { 
		console.log('Erro ao criar o banco de dados', err)
	} else { 
		console.log('Banco de dados criado!')
		createTable()
	}
})

module.exports = db

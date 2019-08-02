const sqlite3 = require('sqlite3').verbose();

const createTable = () => {

	db.serialize( () => {
		db.exec(`
			CREATE TABLE IF NOT EXISTS acoesSala(
				label TEXT,
				value INTEGER
			);`);

		db.exec(`
			CREATE TABLE IF NOT EXISTS acoesSala(
				value TEXT PRIMARY
				label TEXT,
			);`, () => {
				db.exec(`
				INSERT INTO acoesSala(label,value)
					SELECT 'Ambos', '3'
					WHERE NOT EXISTS(SELECT 1 FROM acoesSala WHERE value = '3')
				UNION
					SELECT 'Administrador', '1'
					WHERE NOT EXISTS(SELECT 1 FROM acoesSala WHERE value = '1')
				UNION
					SELECT 'Jogador', '2'
					WHERE NOT EXISTS(SELECT 1 FROM acoesSala WHERE value = '2')
				;`)
			});

		db.exec(`
			CREATE TABLE IF NOT EXISTS sala(
				idSala TEXT PRIMARY KEY,
				forceFimJogo INTEGER,
				finalizar TEXT,
				resetar TEXT,
				removerJogador TEXT,
				removerAdm TEXT,
				FOREIGN KEY(finalizar) REFERENCES acoesSala(value),
				FOREIGN KEY(resetar) REFERENCES acoesSala(value),
				FOREIGN KEY(removerJogador) REFERENCES acoesSala(value),
				FOREIGN KEY(removerAdm) REFERENCES acoesSala(value)
			);`);


		db.exec(`
			CREATE TABLE IF NOT EXISTS carta(
				idSala TEXT,
				id INTEGER,
				value INTEGER,
				label TEXT,
				type TEXT,
				FOREIGN KEY(idSala) REFERENCES sala(idSala)
			);`);

		db.exec(`
			CREATE TABLE IF NOT EXISTS usuario(
				idSala TEXT,
				idUser TEXT,
				idSocket TEXT,
				status TEXT,
				nome TEXT,
				isJogador INTEGER,
				idCarta INTEGER,
				FOREIGN KEY(idSala) REFERENCES sala(idSala)
			);`);
	});
}

let db = new sqlite3.Database("./dataBase.sqlite3", (err) => {
	if (err) { 
		console.log('Erro ao criar o banco de dados', err)
	} else { 
		createTable()
	}
})

module.exports = db


UserSchema = require('../models/userSchema');
sqlite3      = require('sqlite3').verbose();

const db = new sqlite3.Database("./dataBase.sqlite3", (err) =>{
  if (err) {
    console.error(err);
  }
});

module.exports = class UserService {

	static loginUser (usuario, callback) {

		db.serialize( () => {
			db.run(`
			INSERT OR REPLACE INTO usuario
				(idSala, idUser, idSocket, status, nome, isJogador)
			VALUES (
				'${usuario.idSala}',
				'${usuario.idUser}',
				'${usuario.idSocket}',
				'${usuario.status}',
				'${usuario.nome}',
				 ${String(usuario.isJogador)});`,[], (err) => {
					if (err) return console.error(err)

					db.all(`
						SELECT * FROM usuario
						WHERE idSala = '${usuario.idSala}'
						;`, (err, rows) => {
							if (err) return console.error(err)
							callback(rows)
					})
				})
		})
	}

	static remove (idSala, idUser, callback) {
		db.serialize( () => {
			db.run(`
				DELETE FROM usuario
				WHERE idUser = '${idUser}'
				;`, [], (err) => {
					if (err) return console.error(err)

					db.all(`
						SELECT * FROM usuario
						WHERE idSala = '${idSala}'
						;`, (err, rows) => {
							if (err) return console.error(err)

							callback(rows)
					})
				})
		})
	}

	static addVoto (idUser, voto, callback) {
		db.serialize( () => {
			db.run(`
				UPDATE usuario SET idCarta = '${voto.id}'
				WHERE idUser = '${idUser}'
				;`, [], (err) => {
					if (err) return console.error(err)

					db.all(`
						SELECT * FROM usuario
						WHERE idUser = '${idUser}'
						;`, (err, rows) => {
							if (err) return console.error(err)

							callback(rows)
					})
				})
		})
	}

	static setOff (idSocket, callback) {
		db.serialize( () => {
			db.run(`
				UPDATE usuario SET status = 'OFF'
				WHERE idSocket = '${idSocket}'
				;`, [])

				db.all(`
					SELECT idSala FROM usuario
					WHERE idSocket = '${idSocket}'
					;`, [], (err, row) => {
						if (err) {
							console.error(err)
						} else {
							db.each(`
							SELECT idSala FROM usuario
							WHERE idSocket = '${idSocket}'
							;`, (err, rows) => {
								if (err) {
									console.error(err)
								} else {
									callback(rows, row.idSala)
								}
							})
						}
				});
		})
	}

	static reset (db, idSala, callback) {
		db.serialize( () => {
			db.run(`
				UPDATE usuario SET idCarta = null
				WHERE idSala = $idSala
				;`, {$idSala: idSala}, (err) => {
					if (err) return console.error(err)

					db.all(`
						SELECT * FROM usuario
						WHERE idSala = ${idSala}
						;`, (err, rows) => {
							if (err) return console.error(err)

							callback(rows)
					})
				})
		})
	}
}

const knex = require('./../config/conKnex')

module.exports = class UserService {

	static loginUser (usuario, callback) {
		knex.raw(`
			INSERT INTO usuario
				(idSala, idUser, idSocket, status, nome, isJogador, idCarta)
			SELECT 
				'${usuario.idSala  }',
				'${usuario.idUser  }',
				'${usuario.idSocket}',
				'${usuario.status  }',
				'${usuario.nome    }',
				 ${String(usuario.isJogador)},
				(SELECT idCarta FROM usuario WHERE idUser = '${usuario.idUser}')
			FROM usuario
			WHERE NOT EXISTS(SELECT idUser FROM usuario WHERE idUser = '${usuario.idUser}')
		`)
		.then(()=> {
			
		})

		knex.transaction(trx => {
			trx('usuario').where('idUser', usuario.idUser)
			.then(res => {
				if (res.length === 0) {
					return trx('usuario').insert({ date })
				} else {
					return trx('usuario')
							.where('idUser', '=', usuario.idUser)
							.update(date)

				}
			});
		}).then(res => console.log(`User is: ${res[0]}`));

		db.serialize( () => {
			db.run(`
			INSERT OR REPLACE INTO usuario
				(idSala, idUser, idSocket, status, nome, isJogador, idCarta)
			VALUES (
				'${usuario.idSala  }',
				'${usuario.idUser  }',
				'${usuario.idSocket}',
				'${usuario.status  }',
				'${usuario.nome    }',
				 ${String(usuario.isJogador)},
				(SELECT idCarta FROM usuario WHERE idUser = '${usuario.idUser}')
				);`,[], (err) => {
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

	static addVoto (idUser, voto, idSala, callback) {
		db.serialize( () => {
			db.run(`
				UPDATE usuario SET idCarta = '${voto.id}'
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

	static reset (idSala, callback) {
		db.serialize( () => {
			db.run(`
				UPDATE usuario SET idCarta = null
				WHERE idSala = '${idSala}'
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
}

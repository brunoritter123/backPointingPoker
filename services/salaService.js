const knex = require('./../config/conKnex')

module.exports = class SalaService {

	async static loginUser (idSala, callback) {
		try {
			const resSala = await knex.select('*').from('sala').where('idSala', '=', idSala)
			if (resSala.length > 0) {
				const sala = resSala[0] // Não deveria ser possível existir duas salas com o mesmo idSala

				sala.cartas = await knex.select('*').from('carta').where('idSala', idSala)

				callback(sala)

			} else {
				SalaService.newSala(idSala, callback)
			}

		} catch (err){
			return console.error(err)
		}
	}

	async static updateSala(sala, isUpdConfig, callback) {
		db.serialize( () => {
			if (isUpdConfig) {
				db.run(`
					DELETE FROM carta
					WHERE idSala = '${sala.idSala}'
					;`, [], (err) => {
						if (err) return console.error(err)

						let stmt = db.prepare(` INSERT INTO carta
								(idSala, value, label, type)
								VALUES(?, ?, ?, ?)`);
		
								sala.cartas.forEach(carta => {
								stmt.run(sala.idSala, carta.value, carta.label, carta.type)
							});
		
						stmt.finalize();

						SalaService.updApenasSala(sala, callback)
					})
			} else {
				SalaService.updApenasSala(sala, callback)
			}
		})
	}

	async static updApenasSala(sala, callback) {
		db.serialize( () => {
			db.run(`
					UPDATE sala SET
						forceFimJogo = ${sala.forceFimJogo},
						finalizar = '${sala.finalizar}',
						resetar = '${sala.resetar}',
						removerJogador = '${sala.removerJogador}',
						removerAdm = '${sala.removerAdm}'
					WHERE idSala = '${sala.idSala}'
					;`, [], (err) => {
						if (err) return console.error(err)

						db.get(`
							SELECT * FROM sala
							WHERE idSala = '${sala.idSala}'
							;`, (err, sala) => {
								if (err) return console.error(err)
								db.all(`
									SELECT * FROM carta
									WHERE idSala = '${sala.idSala}'
									;`, (err, newCartas) => {
										if (err) return console.error(err)

										sala.cartas = newCartas
										callback(sala)
									})
						})
					})
			})
	}

	async static newSala(idSala, callback) {
		const sala = {
			idSala: idSala,
			forceFimJogo: 0,
			finalizar: '1',
			resetar: '1',
			removerJogador: '1',
			removerAdm: '3'
		}

		const cartasDef = [
			{idSala: idSala , value:  1       , label: '1', type:'default'},
			{idSala: idSala , value:  2       , label: '2', type:'default'},
			{idSala: idSala , value:  3       , label: '3', type:'default'},
			{idSala: idSala , value:  5       , label: '5', type:'default'},
			{idSala: idSala , value:  8       , label: '8', type:'default'},
			{idSala: idSala , value: 13       , label:'13', type:'default'},
			{idSala: idSala , value: 21       , label:'21', type:'default'},
			{idSala: idSala , value: 34       , label:'34', type:'default'},
			{idSala: idSala , value: 55       , label:'55', type:'default'},
			{idSala: idSala , value: undefined, label:'?' , type:'default'}
		];

		db.serialize( () => {
			let stmt = db.prepare(` INSERT INTO carta
				(idSala, value, label, type)
				VALUES(?, ?, ?, ?)`);

			cartasDef.forEach(carta => {
				stmt.run(carta.idSala, carta.value, carta.label, carta.type)
			});

			stmt.finalize();

			db.run(`
				INSERT INTO sala
					(idSala, forceFimJogo, finalizar, resetar, removerJogador, removerAdm)
				VALUES (
					'${sala.idSala}',
					${sala.forceFimJogo},
					'${sala.finalizar}',
					'${sala.resetar}',
					'${sala.removerJogador}',
					'${sala.removerAdm}');`,[], (err) => {
						if (err) return console.error(err)
						db.get(`
							SELECT * FROM sala
							WHERE idSala = '${idSala}'
							;`, (err, newSala) => {
								if (err) return console.error(err)

								db.all(`
									SELECT * FROM carta
									WHERE idSala = '${idSala}'
									;`, (err, newCartas) => {
										if (err) return console.error(err)

										newSala.cartas = newCartas
										callback(newSala)
									})
						})
					})
		})
	}
}
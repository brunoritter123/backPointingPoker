SalaSchema = require('../models/salaSchema');
CartaSchema = require('../models/cartaSchema');
AcoesSalaSchema = require('../models/acoesSalaSchema');
sqlite3      = require('sqlite3').verbose();

const db = new sqlite3.Database("./dataBase.sqlite3", (err) =>{
	if (err) {
		console.error(err);
	}
});

module.exports = class SalaService {

	static loginUser (idSala, callback) {
		db.serialize( () => {
			db.get(`
				SELECT * FROM sala
				WHERE idSala = '${idSala}'
				;`,[], (err,sala) => {
					if (err) return console.error(err)

					if (sala) {
						db.all(`
							SELECT * FROM carta
							WHERE idSala = '${idSala}'
							;`, (err, newCartas) => {
								if (err) return console.error(err)

								sala.cartas = newCartas
								callback(sala)
							})

					} else {
						SalaService.newSala(idSala, callback)
					}
				})
		})
	}

	static saveSala(idSala, callback) {
		db.get(`
				SELECT * FROM sala
				WHERE idSala = '${idSala}'
				;`,[], (err,row) => {
					if (err) return console.error(err)

					callback(row);
		})
	}

	static updateSala(sala, isUpdConfig, callback) {
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

	static updApenasSala(sala, callback) {
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

	static newSala(idSala, callback) {
		const sala = {
			idSala: idSala,
			forceFimJogo: 0,
			finalizar: '1',
			resetar: '1',
			removerJogador: '1',
			removerAdm: '3'
		}

		const cartasDef = [
			{idSala: idSala , id: 1, value:  1       , label: '1', type:'default'},
			{idSala: idSala , id: 2, value:  2       , label: '2', type:'default'},
			{idSala: idSala , id: 3, value:  3       , label: '3', type:'default'},
			{idSala: idSala , id: 4, value:  5       , label: '5', type:'default'},
			{idSala: idSala , id: 5, value:  8       , label: '8', type:'default'},
			{idSala: idSala , id: 6, value: 13       , label:'13', type:'default'},
			{idSala: idSala , id: 7, value: 21       , label:'21', type:'default'},
			{idSala: idSala , id: 8, value: 34       , label:'34', type:'default'},
			{idSala: idSala , id: 9, value: 55       , label:'55', type:'default'},
			{idSala: idSala , id: 10, value: undefined, label:'?' , type:'default'}
		];

		db.serialize( () => {
			let stmt = db.prepare(` INSERT INTO carta
				(idSala, id, value, label, type)
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
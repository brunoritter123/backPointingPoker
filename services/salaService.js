
module.exports = function SalaService(db) {
	this.knex = db

	this.loginUser = async function(idSala, callback) {
		try {
			let sala = await this.knex.select().from('sala').where('idSala', '=', idSala).first()

			if (!!sala) {
				sala.cartas = await this.knex.select().from('carta').where('idSala', idSala)
			} else {
				sala = await this.newSala(idSala)
			}

			callback(sala)

		} catch (err){
			return console.error(err)
		}
	}

	this.updateCarta = async function(carta) {
		const trx = await this.knex.transaction()
		try {
			await trx('carta').where('id', '=', carta.id).update({
				nmUltHist  : carta.nmUltHist
			})
			await trx.commit()

		} catch (err){
			await trx.rollback()
			return console.error(err)
		}
	}

	this.updateHistoria = async function(idSala, nmHistoria) {
		const trx = await this.knex.transaction()
		try {
			await trx('sala').where('idSala', '=', idSala).update({
				nmHistoria  : nmHistoria
			})
			await trx.commit()

		} catch (err){
			await trx.rollback()
			return console.error(err)
		}
	}

	this.updateSala = async function(sala, isUpdConfig, callback) {
		const trx = await this.knex.transaction()

		try {
			if (isUpdConfig) {
				await trx('carta').where('idSala', sala.idSala).del()
				await trx('carta').insert(sala.cartas)
			}

			const salaAtu = await this.updApenasSala(trx, sala)
			await trx.commit()

			callback(salaAtu)

		} catch (err){
			await trx.rollback()
			return console.error(err)
		}
	}

	this.updApenasSala = async function(trx, sala) {
		return new Promise( async function(resolve, reject) {
			try {
				await trx('sala').where('idSala', '=', sala.idSala).update({
					forceFimJogo  : sala.forceFimJogo,
					finalizar     : sala.finalizar,
					resetar       : sala.resetar,
					removerJogador: sala.removerJogador,
					removerAdm    : sala.removerAdm
				})
				sala = await trx.select().from('sala').where('idSala', sala.idSala).first()
				sala.cartas = await trx.select().from('carta').where('idSala', sala.idSala)

				resolve(sala)

			} catch(err) {
				reject(err);
			}
		})

	}

	this.newSala = async function(idSala) {
		const trx = await this.knex.transaction()

		return new Promise( async function(resolve, reject) {

			try {
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

				await trx('carta').insert(cartasDef)
				await trx('sala').insert(sala)
				sala.cartas = await trx.select('*').from('carta').where('idSala', idSala)
				await trx.commit()
				resolve(sala)

			} catch(err) {
				await trx.rollback()
				reject(err);
			}
		})
	}
}
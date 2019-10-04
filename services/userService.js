const knex = require('./../config/conKnex')

module.exports = class UserService {

	async static loginUser (usuario, callback) {
		try {
			const trx = await knex.transaction()
			const res = await trx.select('idUser').from('usuario').where('idUser', usuario.idUser)
			if (res.length === 0) {
				await trx('usuario').insert({ usuario })
			} else {
				await trx('usuario').where('idUser', '=', usuario.idUser).update(usuario)
			}
			const allUserSala = await trx.select().from('usuario').where('idSala', usuario.idSala)
			await trx.commit()

			callback(allUserSala)

		} catch (err){
			return console.error(err)
		}
	}

	async static remove (idSala, idUser, callback) {
		try {
			const trx = await knex.transaction()
			await trx('usuario').where('idUser', idUser).del()
			const allUserSala = await trx.select().from('usuario').where('idSala', idSala)
			await trx.commit()

			callback(allUserSala)

		} catch (err){
			return console.error(err)
		}
	}

	async static addVoto (idUser, voto, idSala, callback) {
		try {
			const trx = await knex.transaction()
			await trx('usuario').where('idUser', '=', idUser).update({idCarta: voto.id})
			const allUserSala = await trx.select().from('usuario').where('idSala', idSala)
			await trx.commit()

			callback(allUserSala)

		} catch (err){
			return console.error(err)
		}
	}

	async static setOff (idSocket, callback) {
		try {
			const trx       = await knex.transaction()
			const resIdSala = await trx('usuario').where('idSocket', '=', idSocket).update({status: 'OFF'}).returning('idSala')
			if (resIdSala.length > 0) {
				const allUserSala = await trx.select().from('usuario').where('idSala', resIdSala[0])
				await trx.commit()

				callback(allUserSala, resIdSala[0])

			} else {
				await trx.rollback()
			}

		} catch (err){
			return console.error(err)
		}
	}

	async static reset (idSala, callback) {
		try {
			const trx = await knex.transaction()
			await trx('usuario').where('idSala', '=', idSala).update({idCarta: null})
			const allUserSala = await trx.select().from('usuario').where('idSala', idSala)
			await trx.commit()

			callback(allUserSala)

		} catch (err){
			return console.error(err)
		}
	}
}

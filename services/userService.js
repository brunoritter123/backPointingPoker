
module.exports = function UserService(db) {
	this.knex = db


	this.loginUser = async function(usuario, callback) {
		const trx = await this.knex.transaction()

		try {
			const res = await trx.select('idUser').from('usuario').where('idUser', usuario.idUser).first()
			if (!res) {
				await trx('usuario').insert(usuario)
			} else {
				await trx('usuario').where('idUser', '=', usuario.idUser).update(usuario)
			}
			const allUserSala = await trx.select().from('usuario').where('idSala', usuario.idSala)

			await trx.commit()

			callback(allUserSala)

		} catch (err){
			await trx.rollback()
			return console.error(err)
		}
	}

	this.remove  = async function(idSala, idUser, callback) {
		const trx = await this.knex.transaction()

		try {
			await trx('usuario').where('idUser', idUser).del()
			const allUserSala = await trx.select().from('usuario').where('idSala', idSala)
			await trx.commit()

			callback(allUserSala)

		} catch (err){
			await trx.rollback()
			return console.error(err)
		}
	}

	this.addVoto = async function(idUser, voto, idSala, callback) {
		const trx = await this.knex.transaction()

		try {
			await trx('usuario').where('idUser', '=', idUser).update({idCarta: voto.id})
			const allUserSala = await trx.select().from('usuario').where('idSala', idSala)
			await trx.commit()

			callback(allUserSala)

		} catch (err){
			await trx.rollback()
			return console.error(err)
		}
	}

	this.setOff = async function(idSocket, callback) {
		const trx  = await this.knex.transaction()

		try {
			await trx('usuario').where('idSocket', '=', idSocket).update({status: 'OFF'})
			const resIdSala = await trx.select('idSala').from('usuario').where('idSocket', '=', idSocket).first()
			if (!!resIdSala) {
				const allUserSala = await trx.select().from('usuario').where('idSala', resIdSala)
				await trx.commit()

				callback(allUserSala, resIdSala)

			} else {
				await trx.rollback()
			}

		} catch (err){
			await trx.rollback()
			return console.error(err)
		}
	}

	this.reset = async function(idSala, callback) {
		const trx = await this.knex.transaction()

		try {
			await trx('usuario').where('idSala', '=', idSala).update({idCarta: null})
			const allUserSala = await trx.select().from('usuario').where('idSala', idSala)
			await trx.commit()

			callback(allUserSala)

		} catch (err){
			await trx.rollback()
			return console.error(err)
		}
	}
}

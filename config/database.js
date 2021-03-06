const VERSAO_BD = 1

module.exports = function (knex) {
	knex.schema.hasTable('acoesSala').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('acoesSala', function(table) {
				table.string('value', 1).primary();
				table.string('label', 20);
			})
			.then(function(){
				return knex('acoesSala').insert([
					{value: '3', label: 'Ambos'},
					{value: '1', label: 'Administrador'},
					{value: '2', label: 'Jogador'},
				])
			})
			.catch((err) => { console.error(err); throw err });
		}
	}).then(function(){
		return knex.schema.hasTable('sala').then(function(exists) {
			if (!exists) {
				return knex.schema.createTable('sala', function(table) {
					table.string('idSala', 30).primary();
					table.integer('forceFimJogo');
					table.string('finalizar', 1);
					table.string('resetar', 1);
					table.string('removerJogador', 1);
					table.string('removerAdm', 1);
					table.string('nmHistoria', 200);
					table.foreign('finalizar').references('acoesSala.value');
					table.foreign('resetar').references('acoesSala.value');
					table.foreign('removerJogador').references('acoesSala.value');
					table.foreign('removerAdm').references('acoesSala.value');
				}).catch((err) => { console.error(err); throw err });
			}
		});
	}).then(function(){
		return knex.schema.hasTable('carta').then(function(exists) {

			if (!exists) {
				return knex.schema.createTable('carta', function(table) {
					table.increments('id').primary();
					table.string('idSala', 30);
					table.integer('value');
					table.string('label', 20);
					table.string('type', 20);
					table.string('nmUltHist', 200);
					table.foreign('idSala').references('sala.idSala');
				}).catch((err) => { console.error(err); throw err });
			}
		});
	}).then(function(){
		return knex.schema.hasTable('usuario').then(function(exists) {
			if (!exists) {
				return knex.schema.createTable('usuario', function(table) {
					table.string('idUser', 50).primary();
					table.string('idSala', 30);
					table.string('idSocket', 50);
					table.string('status', 20);
					table.string('nome', 50);
					table.integer('isJogador');
					table.integer('idCarta');
					table.foreign('idSala').references('sala.idSala');
					table.foreign('idCarta').references('carta.id');
				}).catch((err) => { console.error(err); throw err });
			}
		});
	}).then(function(){
		return knex.schema.hasTable('versao').then(function(exists) {
			if (!exists) {
				return knex.schema.createTable('versao', function(table) {
					table.integer('versao').primary();
				}).then(function(){
					return knex('versao').insert([
						{versao: VERSAO_BD}
					])
				}).catch((err) => { console.error(err); throw err });
			}
		});
	})
	.catch((err) => { console.error(err); throw err });
}
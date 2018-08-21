module.exports = class UsersDAO {

  constructor(connection){
    this.db = connection();
  }

  inserir(userConn) {

    this.db.users.insert(userConn)
  }

}


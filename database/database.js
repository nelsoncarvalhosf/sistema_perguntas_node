const Sequelize = require('sequelize')

const connection = new Sequelize('app_development','root','password',{
    host: 'sistema_db_1',
    dialect: 'mysql'
})

module.exports = connection
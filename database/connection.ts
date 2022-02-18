import { Sequelize } from 'sequelize';

//-estos archivos se ejecutan antes que las variables de entorno, por lo que se tendria que inicializar en otro lugar
//-o despues de la declaracion del prrocess o por medio de una funcion
const db = new Sequelize('flutter_chat','root','', {
  host:'localhost',
  dialect: 'mysql',
  logging: false
})

export default db;
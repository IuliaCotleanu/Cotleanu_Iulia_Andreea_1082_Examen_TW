import db from '../dbConfig.js'
import Sequelize  from 'sequelize'

const FavouriteList = db.define("FavouriteList",{
    FavouriteListId:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    FavouriteListDescriere:{
        type:Sequelize.STRING,
        validate:{
            len:{
                args:[3,100],
                msg:"Descrierea trebuie sa contina ce putin 3 caractere!"
            },
        },
        allowNull:false,
    },

    FavouriteListDate:{
        type:Sequelize.DATEONLY,
        validate:{
            isDate:{
                msg:"Data nu respecta formatul YYYY-MM-DD !"
            }
        },
        allowNull:false
        }

})

export default FavouriteList;
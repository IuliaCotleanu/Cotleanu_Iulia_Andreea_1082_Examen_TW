import db from '../dbConfig.js'
import Sequelize  from 'sequelize'

const Video = db.define("Video",{
    VideoId:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    VideoDescriere:{
        type:Sequelize.STRING,
        validate:{
            len:{
                args:[5,100],
                msg:"Descrierea trebuie sa contina ce putin 5 caractere!"
            },
        },
        allowNull:false,
    },

    VideoTitlu:{
        type:Sequelize.STRING,
        validate:{
            len:{
                args:[5,100],
                msg:"Titlul videoclipului trebuie sa contina minim 5 caractere!"
            }
        },
        allowNull:false
    },
    VideoUrl:{
        type:Sequelize.STRING,
        validate:{
            isUrl:{
                msg:"Video url trebuie sa fie o adresa url"
            },
        },
        allowNull:false
    },
    FavouriteListId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

export default Video;
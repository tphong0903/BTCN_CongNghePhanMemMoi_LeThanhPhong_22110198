const bcrypt = require("bcryptjs");
const db = require("../models/index");
const saltRounds = 10; 
let hashUserPassword = async (password) => {
    try {
        let hashPassword = await bcrypt.hash(password, saltRounds);
        return hashPassword;
    } catch (e) {

        throw e;
    }
}

let createNewUser = async (data) => {
    try {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        
        await db.User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
    
            phoneNumber: data.phoneNumber,
            gender: data.gender === '1' ? true : false,
            image: data.image,
            roleId: data.roleId,
            positionId: data.positionId,
        });
        

        return 'create success'; 
    } catch (e) {
        throw e;
    }
}

let getAllUser = async () => {
    try {
        let users = await db.User.findAll({
            raw: true,
    
            attributes: {
                exclude: ['password']
            }
        });
        return users; 
    } catch (e) {
        throw e;
    }
}

let getUserInfoById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
            raw: true,
            attributes: {
                exclude: ['password'] 
            }
        });

        return user; 
    } catch (e) {
        throw e;
    }
}

let deleteUserById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId }
        });

        if (user) {
         
            await user.destroy();
            return true; 
        } else {
            return false; 
        }
    } catch (e) {
        throw e;
    }
}

let updateUser = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id }
        });

        if (user) {
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.address = data.address;
            

            await user.save();

        
            let allUsers = await getAllUser();
            return allUsers;
        } else {
            return null;
        }
    } catch (e) {
        throw e;
    }
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUser: updateUser,
    deleteUserById: deleteUserById
}
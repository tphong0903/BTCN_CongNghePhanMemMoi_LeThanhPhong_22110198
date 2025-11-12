const bcrypt = require("bcryptjs");
const db = require("../models/index");
const saltRounds = 10; 
export const hashUserPassword = async (password: string) => {
    try {
        let hashPassword = await bcrypt.hash(password, saltRounds);
        return hashPassword;
    } catch (e) {

        throw e;
    }
}

export const createNewUser = async (data: any) => {
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

export const getAllUser = async () => {
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

export const getUserInfoById = async (userId: number) => {
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

export const deleteUserById = async (userId: number) => {
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

export const updateUser = async (data: any) => {
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

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, SECRET } from "../global";
import fs from "fs"
import md5 from "md5"
import { sign } from "jsonwebtoken"
require('dotenv').config();


const prisma = new PrismaClient ({errorFormat: "pretty"})

export const getAllUser = async (request : Request, Response: Response) => {
    try {
        const { search } =request.query;
        const alluser = await prisma.user.findMany({
            where: {name : { contains: search?.toString() || ""}},
        });
        return Response.json({
            status: true,
            data:alluser,
            message: 'user has retrieved',
        })
        .status(200);
    } catch (error) {
        return Response.json({
            status:false,
            message: `there is an error. ${error}`,
        })
        .status(400)
    }
}
 
export const createUser = async ( request: Request, response : Response) => {
    try{
        const { name, email, password, role, profile_picture} = request.body
        const uuid = uuidv4()

        const cekEmail = await prisma.user.findUnique({
            where: {email },
        });

        if (cekEmail) {
            return response.status(400).json({
                status : false,
                message: 'email sudah digunakan',
            });
        }

        //proces save data
        const newUser = await prisma.user.create({
            data: { uuid, name, email, password: md5(password), role, profile_picture}
        })

        return response.json({
            status: 'Creating User',
            user: newUser,
            message: 'Nwe== User has created'
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `error lee ${error}`
        })
        .status(400)
    }

    }

    export const editUser = async (request : Request, response: Response ) => {
        try {
            const { id } = request.params
            const { name, email, password, role, profile_picture } =request.body

        const findUser = await prisma.user.findFirst ({ where: { id : Number(id)}})
        if (!findUser) return response.status(200).json ({
            status: false,
            message : 'user tidak ada'
        })

        const editedUser = await prisma.user.update({
            data: {
                name: name || findUser.name,
                email: email || findUser.email,
                password: md5(password),
                role: role || findUser.role,
                profile_picture: profile_picture || findUser.profile_picture
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: 'alhamdulillah ga error',
            user: editedUser,
            message: 'user telah diupdate'
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: 'yek error',
                message: `error lee ${error}`
            })
            .status(400)
    }
}

export const changePicture = async (request: Request, response : Response) => {
    try {
        const {id } = request.params
        const findUser = await prisma.user.findFirst({ where : { id: Number (id) } })
        if (!findUser) return response.status(200).json ({ message: 'USER TIDAK ADA!', })

        let filename = findUser.profile_picture
        if (request.file ) {
            filename = request.file.filename 

            let path = `${BASE_URL}/../public/userPicture/${findUser.profile_picture}`
            let exist = fs.existsSync(path)

            if (exist && findUser.profile_picture !== ``) fs.unlinkSync(path) //menghapus foto lama jika ada
        }

        const updatePicture = await prisma.user.update({
            data: { profile_picture : filename},
            where: { id : Number (id)}
        })
        return response.json({
            status:'true',
            data: updatePicture,
            message: 'foto telah diganti'
        })
    } catch( error ) {
        return response.json ({
            status: 'false',
            error: `${ error }`
        }).status(400)
    }
}

export const deleteUser = async (request: Request , response: Response) => {
    try {
        const { id } = request.params

        const findUser = await prisma.user.findFirst ({ where : {id: Number(id)}})
        if (!findUser) {
            return response.status(404).json ({
                status: ' ERROR !! '    ,
                message: " user tidak di temukan "
            });

        }
        let path = `${BASE_URL}/../public/menuPicture/${findUser.profile_picture}`
        let exist = fs.existsSync(path)

        if ( exist && findUser.profile_picture !== ``) fs.unlinkSync (path)
        

            await prisma.user.delete ({
                where : { id :Number(id) }
            })
            return response.json({
                status: 'Yey gak error',
                message: ' User telah dihaous'
            }).status(200);

    } catch (error) {
        return response.json({
            status: ' Error saat mengapus user',
            message: `${error}`
        })
        .status(400)
    }
}


export const authentication = async (request : Request, response: Response) => {

    try{
        const { email, password } = request.body;

        const findUser = await prisma.user.findFirst ({
            where: {email, password : md5(password)}
        })
        if(!findUser)
            return response.status(200).json({
        status: false,
        logged: false,
        message : 'email or password id invalid'
    })

    let data = {
        id : findUser.id,
        name: findUser.name,
        email : findUser.email,
        role : findUser.role,
    }

    let playload = JSON.stringify(data) // menyiapkan data yang akan dijadikan token
    let token = sign(playload, SECRET || "token")//untuk menggenerete token

    return response
    .status(200)
    .json({
        status: true,
        logged: true,
        message: 'Login success',
        token
    })

    } catch (error) {
        return response.json({
            status: 'false',
            message: `error ${error}`
        })
        .status(400)

    }
}
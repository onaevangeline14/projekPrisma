import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import {BASE_URL} from "../global";
import fs from "fs"
require('dotenv').config();

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllMenus = async (request: Request, Response: Response) => {
  // fungsi async bisa langsung eksekusi
  try {
    // input
    const { search } = request.query;
    //main
    const allmenus = await prisma.menu.findMany({
      where: { name: { contains: search?.toString() || "" } },
      //contains mengandung (mencari)
      //tostring mengubah data menjadi string
      //|| untuk mencari jika salah satu kosong berarti ngambil yang "" (menampilkan salah satu)
    });
    return Response
      .json({
        status: true,
        data: allmenus,
        message: 'menus has retrieved',
      })
      .status(200);
  } catch (error) {
    return Response.json({
        status: false,
        message: `there is an error. ${error}`,
      })
      .status(400);
  }
  //try mengelompokkan error
}

export const createMenu = async (request : Request, response : Response) => {
  try {
    //get requsted data (data has been sent from request)
    const { name, price, category , description } = request.body
    const uuid = uuidv4()

    let filename = ""
    if (request.file) filename = request.file.filename 

    //process to save new menu
    const newMenu = await prisma.menu.create ({
      data: {uuid, name, price: Number(price), category, description, picture: filename}
    })
    ///price abd stock have to convert in number type
    return response.json ({
      status: true,
      data: newMenu,
      message: `New Menu has created`
    })
    .status(200);
  } catch (error) {
    return response.json ({
      status : false,
      message: ` There is an error. ${error} `
    })
    .status(400)
  }
}

export const updateMenu = async (request: Request, response:Response) => {
  try {
    const {id} = request.params //get id of menu's id that sent in parameter of URL
    const{ name, price, category, description} = request.body //get requested data 

    //make sure that data is existrs in database
    const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } })
    if (!findMenu) return response 
    .status (200)
    .json({ status: false,message : `Menu is not found`})

    let filename = findMenu.picture
  if  (request.file) {
    //update picture baru yang di upload
    filename = request.file.filename
    //check the old picture in the folder
    let path = `${BASE_URL}/../public/menu-picture/${findMenu.picture}`
    let exist = fs.existsSync(path)
    //delete the old exist picture if reupload new file
    if(exist && findMenu.picture !== ``) fs.unlinkSync (path)

  }

    //process to update menu's data
    const updatedMenu = await prisma.menu.update ({
      data: {
        name: name || findMenu.name,
        price: price ? Number(price) : findMenu.price,
        category: category || findMenu.category,
        description: description || findMenu.description,
        picture: filename
      },
      where: {id: Number(id)}
    })
    return response.json({
      status: true,
      data: updatedMenu,
      message: `Menu has updated`
    }).status(200)
  }catch(error) {
    return response.json({
      status:false,
      message: `There is an error. ${error}`
    })
    .status (400)
  }
}
// export const changePicture = async (request : Request, response:Response) => {
//   try {
//   // get id of menu's id that sent in parameter of URL
//   const { id } =request.params

//   //make sure that data is exists in database
//   const findMenu = await prisma.menu.findFirst({ where : { id: Number(id)}})
//   if (!findMenu) return response
//   .status(200)
//   .json ({status : false, message : 'Menu is not found'})

//   let filename = findMenu.picture
//   if  (request.file) {
//     //update picture baru yang di upload
//     filename = request.file.filename
//     //check the old picture in the folder
//     let path = `${BASE_URL}/../public/menu-picture/${findMenu.picture}`
//     let exist = fs.existsSync(path)
//     //delete the old exist picture if reupload new file
//     if(exist && findMenu.picture !== ``) fs.unlinkSync (path)

//   }
  //proses to update picture  in database
//   const updatePicture = await prisma.menu.update({
//     data: {picture : filename},
//     where: { id: Number(id) }
//   })
//   return response.json({
//     status : 'true',
//     data: updatePicture,
//     message: 'picture telah diganti'
//   })

   
// } catch (error) {
//   return response.json({
//     status: false,
//     error:'$ {error}'
//   }).status(400)

// }

// }


export const deleteMenu = async (request: Request, response: Response) => {
  try {
    // get id of menu's id that senr in parameter of URL 
    const { id } = request.params

    //make sure that data is exist in  database
    const findMenu = await prisma.menu.findFirst ({ where : {id: Number(id) } })
    if (!findMenu) return response.status(200).json 
    ({status : false, message : 'Egg is not found'})

    let path = `${BASE_URL}/../public/menuPicture/${findMenu.picture}`
        let exist = fs.existsSync(path)
        if (exist && findMenu.picture !== ``) fs.unlinkSync(path)

    //process to delete menu's data
    const deletedMenu = await prisma.menu.delete({
      where : {id : Number(id)}
    })
    return response.json({
      status: true,
      data:deletedMenu,
      message: 'Menu has deleted'
    }).status(200)
  } catch (error) {
    return response.json ({
      status: false,
      message: `There is an error. ${error}`
    })
    .status(400)
  }
}
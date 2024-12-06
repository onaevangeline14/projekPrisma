import express from "express"
import { getAllMenus , createMenu, updateMenu, deleteMenu } from "../controller/menuController"
import { verifyAddMenu, verifyEditMenu } from "../middlewares/verifyMenu"
import {  verifyRole, verifyToken } from "../middlewares/authorization"
import uploadFile from "../middlewares/menuUpload"


const app = express ()
app.use(express.json())

app.get('/',[verifyToken, verifyRole(["Cashier", "Manager"])], getAllMenus)
app.post(`/`,[verifyToken, verifyRole (["Manager"]), uploadFile.single("picture") ,verifyAddMenu], createMenu )
app.put(`/:id`,[verifyToken, verifyRole(["Manager"]) ,uploadFile.single("picture"),verifyEditMenu] ,updateMenu)
app.put('/pic/:id', [verifyToken, verifyRole(["Manager"]) ,uploadFile.single("picture")])
app.delete('/:id',[verifyToken, verifyRole(["Manager"]) ],deleteMenu)

export default app
//nama harga deskripsi category
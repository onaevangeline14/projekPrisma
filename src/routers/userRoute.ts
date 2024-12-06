import express from "express"
import { getAllUser, createUser,deleteUser,changePicture,authentication,editUser } from "../controller/userController"
import { verifyAddUser, verifyEditUser } from '../middlewares/verifyUser'
import uploadFile from "../middlewares/ProfileUpload"
import { verifyAuthentication } from "../middlewares/userValidation"

const app = express ()
app.use (express.json())

app.get('/',getAllUser)
app.post('/',[verifyAddUser], createUser)
app.delete('/:id', deleteUser)
app.put('/:id', [verifyEditUser], editUser)
app.put('/pic/:id', [uploadFile.single("picture")], changePicture)
app.post('/login', [verifyAuthentication], authentication)


export default app
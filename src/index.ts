import express from 'express'
import cors from 'cors'
import MenuRoute from './routers/menuRoute'
import UserRoute from './routers/userRoute'
import OrderRoute from './routers/orderRoute'


const PORT : number = 7000
const app = express ()
app.use(cors())

app.use('/menu',MenuRoute)
app.use('/user',UserRoute)
app.use(`/order`, OrderRoute)



app.listen (PORT,() => {
                console.log(`[server] : Server is running at http://localhost:${PORT}`)
})
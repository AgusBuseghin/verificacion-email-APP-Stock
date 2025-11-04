import express from "express"
import "dotenv/config"
import cors from "cors"
import { sequelize } from './config/db.mjs'
import './config/db.mjs' 
import './models/User.mjs' 
import './models/Product.mjs' 
import { routes as userRoutes } from "./routes/user.mjs" 
import { productRoutes } from "./routes/product.mjs" 

const PORT = process.argv[2] ?? 3001 
const app = express()
app.use(cors())
app.use(express.json())

app.use(userRoutes) 

app.use("/products", productRoutes) 

app.listen(PORT, async () => {
    try {
        await sequelize.sync({ alter: true })
        console.log("Bases de datos conectada y modelos sincronizados")
        console.log(`servidor corriendo en http://localhost:${PORT}`)
    } catch (error) {
        console.log("Hubo un error en la conexion a la base de datos:", error.message)
    }
})
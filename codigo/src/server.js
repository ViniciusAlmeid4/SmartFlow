import { app } from './app.js'

import dotenv from "dotenv";

dotenv.config()

const port = process.env.PORT_SERVER || 8080

app.listen(port, () => console.log(`Running on PORT ${port}`))
import express from 'express'
import userRouter from './routes/user-route'
import taskRouter from './routes/todo-route'
import {createConnection} from 'typeorm'
import "reflect-metadata"

class App {
    private app: express.Application

    constructor() {
        this.app = express()

        this.config()
        this.routerConfig()
        this.dbConnect()
    }

    private config() {
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(express.json())
    }    

    private routerConfig() {
        this.app.use('/account', userRouter)
        this.app.use('/task', taskRouter)
    }

    private dbConnect() {
        createConnection().then(connection => {    
            console.log("Database connected!");
        }).catch(error => console.log("TypeORM connection error: ", error));
    }

    public startApp = (port: number) => {
        return new Promise((res, rej) => {
            this.app
            .listen(port, () => { res(port) })
            .on('error', (err: Object) => rej(err))
        })
    }
}

export default App
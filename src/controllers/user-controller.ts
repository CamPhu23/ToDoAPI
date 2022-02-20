import { User } from '../models/user-model'
import { Request, Response } from 'express'
import { getManager } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { ToDo } from '../models/todo-model'

dotenv.config()
const PRIVATE_KEY = process.env.PRIVATE_KEY
const SALT_ROUNDS = 12

export const handleLogin = (req: Request, res: Response) => {
    let {username, password} = req.body
    let data = undefined

    const userRepository = getManager().getRepository(User)
    userRepository.findOne({username})
    .then(user => {
        if (user) {
            data = user
            
            return bcrypt.compare(password, user.password)
        } else if (!user) throw new Error("username or password is not correct.")
    })
    .then(match => {
        if (match) {
            const token = jwt.sign({id: data.id}, PRIVATE_KEY, {expiresIn: 30*60})
            return res.json({code: 200, status: "successed", token})
        } else if (!match) throw new Error("username or password is not correct.")
    })
    .catch(err => {
        return res.json({code: 404, status: "failed", error: err.message})
    })
}

export const handleRegister = (req: Request, res: Response) => {
    let {username, password} = req.body

    bcrypt.genSalt(SALT_ROUNDS)
    .then(salt => {
        return bcrypt.hash(password, salt)
    })
    .then(hashed => {
        let user = new User(username, hashed)

        const userRepository = getManager().getRepository(User)
        return userRepository.save(user)
    })
    .then(() => {
        return res.json({code: 201, status: "successed", message: "sign up successed."})
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}

export const handleGetAllUsers = (req, res) => {
    const userRepository = getManager().getRepository(User)

    userRepository.find()
    .then(users => {
        res.json({code: 200, status: "successed", data: users})
    })
    .catch(err => {
        res.json({code: 404, status: "failed", error: err.message})
    })
}


export const handleGetAllAssigned = async (req, res) => {
    const userRepository = getManager().getRepository(User)
    const user = await userRepository.findOne({id: req.params.userId})

    if (!user) {
        return res.json({code: 404, status: "failed", error: "user id not found."})
    }

    const taskRepository = getManager().getRepository(ToDo)  
    taskRepository.find({
        where: {
            user
        }
    })
    .then(tasks => {
        res.json({code: 200, status: "successed", data: tasks})
    })
    .catch(err => {
        res.json({code: 404, status: "failed", error: err.message})
    })
}
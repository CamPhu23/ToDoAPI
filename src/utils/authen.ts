import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()
const PRIVATE_KEY = process.env.PRIVATE_KEY

export const authen = (req, res, next) => {
    if (req.headers.authorization) {
        let authorization = req.header('Authorization')
        let token = authorization.split(' ')[1]

        jwt.verify(token, PRIVATE_KEY, function(err, payload) {
            if (err) return res.json({code: 404, status: "failed", error: err.message})
            
            let {id} = payload
            req.acc_id = id
            next()
        })
    } 
    else return res.json({code: 404, status: "failed", error: "you must attach token with the request."})
}
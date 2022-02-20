import { ToDo } from '../models/todo-model'
import {getManager} from "typeorm";
import { User } from '../models/user-model';

export const handleGetAllTasks = (req, res) => {
    const taskRepository = getManager().getRepository(ToDo)  
    taskRepository.find()
    .then(tasks => {
        res.json({code: 200, status: "successed", data: tasks})
    })
    .catch(err => {
        res.json({code: 404, status: "failed", error: err.message})
    })
}

export const handleGetTaskById = (req, res) => {
    const taskRepository = getManager().getRepository(ToDo)
    taskRepository.findOne(req.params.id)
    .then(task => {
        res.json({code: 200, status: "successed", data: task})
    })
    .catch(err => {
        res.json({code: 404, status: "failed", error: err.message})
    })
}

export const handleAddTask = (req, res) => {
    let {name, description, deadline} = req.body

    let task = new ToDo(name, description, deadline)

    const taskRepository = getManager().getRepository(ToDo)
    taskRepository.save(task)
    .then(result => {
        return res.json({code: 200, status: "successed", data: result})    
    })
    .catch(err => {
        return res.json({code: 404, status: "failed", error: err.message})
    })}

export const handleUpdateTask = async (req, res) => {
    let {name, description, deadline, status} = req.body

    const taskRepository = getManager().getRepository(ToDo)
    const task = await taskRepository.findOne(req.params.id)

    if (!task) {
        return res.json({code: 404, status: "failed", error: "id not found."})
    } 

    if (task.status == "COMPLETED") {
        return res.json({code: 400, status: "failed", error: "can not update completed task."})
    } 

    taskRepository.update(req.params.id, {name, description, deadline, status, updated_at: Date.now().toString()})
    .then(() => {
        return res.json({code: 200, status: "successed"})
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}

export const handleRemoveTask = async (req, res) => {
    const taskRepository = getManager().getRepository(ToDo)
    const task = await taskRepository.findOne(req.params.id)

    if (!task) {
        return res.json({code: 404, status: "failed", error: "id not found."})
    } 

    if (task.status == "COMPLETED") {
        return res.json({code: 400, status: "failed", error: "can not remove completed task."})
    } 

    taskRepository.remove(task)
    .then(() => {
        return res.json({code: 200, status: "successed"})
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}

export const handleAssignTask = async (req, res) => {
    const currentUser = req.acc_id;
    const assignedUser = req.body.userId 

    if (currentUser == assignedUser) {
        return res.json({code: 400, status: "failed", error: "can not assign to yourself"})
    }

    const userRepository = getManager().getRepository(User)
    const user = await userRepository.findOne({id: assignedUser})

    if (!user) {
        return res.json({code: 404, status: "failed", error: "user id not found."})
    }

    const taskRepository = getManager().getRepository(ToDo)
    const task = await taskRepository.findOne(req.params.id)

    if (!task) {
        return res.json({code: 404, status: "failed", error: "task id not found."})
    } 

    taskRepository.update(req.params.id, {...task, user})
    .then(() => {
        return res.json({code: 200, status: "successed"})
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { ToDo } from './todo-model'

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
        nullable: false,
        unique: true
    })
    username: string

    @Column({
        nullable: false,
        length: 255
    })
    password: string

    constructor(username: string, password: string) {
        super()

        this.username = username
        this.password = password
    }

    @OneToMany(type => ToDo, todo => todo.user) todos: ToDo[];
}
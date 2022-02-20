import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from './user-model'


@Entity()
export class ToDo extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
        nullable: false,
        unique: true
    })
    name: string

    @Column({
        length: 255,
        nullable: false
    })
    description: string

    @Column({
        nullable: true,
        type: 'timestamp',
    })
    deadline: string

    @Column({
        default: 'NEW',
    })
    status: string
    
    @Column({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP"
    })
    created_at: string;

    @Column({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP"
    })
    updated_at: string;

    constructor(name: string, description: string, deadline: string) {
        super()

        this.name = name
        this.description = description
        this.deadline = deadline
    }

    @ManyToOne(type => User, user => user.todos) user: User; 
}
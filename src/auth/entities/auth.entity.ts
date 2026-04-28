import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    USER =  'user',
    EDITOR = 'editor',
}

@Entity('users')
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    id!: string; 

    @Column({ unique: true })
    email!: string;  

    @Column()
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        array: true,
        default: [UserRole.USER],
    })
    role!: UserRole[];
}

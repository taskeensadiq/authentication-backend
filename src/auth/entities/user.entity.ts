// import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

// export enum UserRole {
//     ADMIN = 'admin',
//     USER =  'user',
//     EDITOR = 'editor',
// }

// @Entity('users')
// export class Auth {
//     @PrimaryGeneratedColumn('uuid')
//     id!: string; 

//     @Column({ unique: true })
//     email!: string;  

//     @Column()
//     password!: string;

//     @Column({
//         type: 'enum',
//         enum: UserRole,
//         array: true,
//         default: [UserRole.USER],
//     })
//     role!: UserRole[];
// }


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles!: Role[];
}
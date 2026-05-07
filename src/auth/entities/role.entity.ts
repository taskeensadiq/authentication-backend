import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user.entity";
import { Permission } from "./permissions.entity";

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => Permission, perm => perm.roles)
  @JoinTable()
  permissions!: Permission[];

  @ManyToMany(() => User, user => user.roles)
  users!: User[];
}
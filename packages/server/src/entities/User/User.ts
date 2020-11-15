import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('user')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    name: 'username',
    type: 'varchar',
    length: 255
  })
  username: string

  @Column({
    name: 'email',
    type: 'varchar'
  })
  email: string

  @Column({
    name: 'password',
    type: 'varchar'
  })
  password: string

  @Column({
    name: 'salt',
    type: 'varchar'
  })
  salt: string

  @Column({
    name: 'first_name',
    type: 'varchar'
  })
  first_name: string

  @Column({
    name: 'last_name',
    type: 'varchar'
  })
  last_name: string

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updateAt',
    type: 'timestamp'
  })
  updateAt: Date

  @Column({
    name: 'lastLoginAt',
    type: 'timestamp'
  })
  lastLoginAt: Date
}

export default User

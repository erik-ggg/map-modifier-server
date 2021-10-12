import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    length: 50,
    nullable: true,
  })
  name: string
  @Index({ unique: true })
  @Column({
    length: 50,
    nullable: true,
  })
  email: string
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Connections {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ nullable: false })
  user_id: string
  @Column({ nullable: false })
  socket_id: string
}

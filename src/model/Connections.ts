import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Connections {
  @PrimaryColumn({ nullable: false })
  user_id: string
  @Column({ nullable: false })
  socket_id: string
}

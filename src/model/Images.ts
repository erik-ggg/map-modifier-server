import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ nullable: false })
  user_id: string
  @Column({ nullable: false })
  image_location: string
  @Column({ nullable: false })
  canvas: string
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date
}

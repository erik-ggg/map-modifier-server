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
  image_name: string
  @Column({ nullable: false })
  image_location: string
  @Column({ type: 'text', nullable: false })
  canvas_data: string
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date
}

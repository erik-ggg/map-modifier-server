import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Colaborators {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  user_id: string;
  @Column({ nullable: true })
  colaborator_id: string;
}

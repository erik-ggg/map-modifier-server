// module.exports = (sequelize, type) => {
//     return sequelize.define("user", {
//       id: {
//         type: type.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       name: { type: type.STRING, unique: true },
//       email: { type: type.STRING, unique: true },
//     })
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    length: 50,
    nullable: true,
  })
  name: string;
  @Index({ unique: true })
  @Column({
    length: 50,
    nullable: true,
  })
  email: string;
}

// module.exports = (sequelize, type) => {
//     return sequelize.define("connections", {
//       user_id: {
//         type: type.STRING,
//         unique: true,
//       },
//       socket_id: type.STRING,
//     })
//   }
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Connections {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  user_id: string;
  @Column({ nullable: true })
  socket_id: string;
}

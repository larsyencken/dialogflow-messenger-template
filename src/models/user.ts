import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';

@Table({
  modelName: 'User',
  tableName: 'users',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
class User extends Model<User> {
  @PrimaryKey
  @Column({ type: DataType.STRING(16) })
  id: string;

  @Column({
    type: DataType.STRING(50),
  })
  name: string;
}

export default User;

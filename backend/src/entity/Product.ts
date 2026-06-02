// 从 typeorm 导入装饰器（ORM 的核心语法）
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// @Entity('products') = 告诉 ORM：
// 这个类对应数据库里的 【products 表】
@Entity('products')
export class Product {

  // @PrimaryGeneratedColumn()
  // 对应表的：主键 id，自增，整数类型
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // 对应表的：name 字段，字符串类型，非空
  @Column()
  name: string;

  // @Column({ nullable: true })
  // 对应表的：description 字段，可以为空
  @Column({ nullable: true })
  description: string;

  // @Column('real')
  // 对应表的：price 字段，浮点类型
  @Column('real')
  price: number;

  // @Column({ default: 0 })
  // 对应表的：stock 字段，默认值 0
  @Column({ default: 0 })
  stock: number;

  // 可以为空的图片地址
  @Column({ nullable: true })
  imageUrl: string;

  // ORM 自动帮你管理创建时间，不用自己赋值
  @CreateDateColumn()
  createdAt: Date;
}
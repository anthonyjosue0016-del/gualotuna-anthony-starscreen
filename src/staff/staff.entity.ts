import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  rol: string;

  @Column({ default: true })
  activo: boolean;
}

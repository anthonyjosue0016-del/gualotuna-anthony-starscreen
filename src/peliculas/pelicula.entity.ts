import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Genero } from '../generos/genero.entity';

@Entity('peliculas')
export class Pelicula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ unique: true })
  codigo: string;

  @Column({ default: 0 })
  duracion_minutos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_entrada: number;

  @Column({ default: true })
  en_cartelera: boolean;

  @ManyToOne(() => Genero, (genero) => genero.peliculas, { eager: true, onDelete: 'RESTRICT' })
  genero: Genero;
}
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pelicula } from '../peliculas/pelicula.entity';

@Entity('generos')
export class Genero {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => Pelicula, (pelicula) => pelicula.genero)
  peliculas: Pelicula[];
}
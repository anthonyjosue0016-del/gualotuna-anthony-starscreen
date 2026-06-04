import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genero } from './genero.entity';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';

@Injectable()
export class GenerosService {
  constructor(
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  async create(createGeneroDto: CreateGeneroDto) {
    // Verificar que el nombre sea único
    const existe = await this.generoRepository.findOne({ where: { nombre: createGeneroDto.nombre } });
    if (existe) {
      throw new ConflictException('El nombre del género ya existe');
    }

    const genero = this.generoRepository.create(createGeneroDto);
    return this.generoRepository.save(genero);
  }

  findAll() {
    return this.generoRepository.find({ relations: { peliculas: true } });
  }

  async findOne(id: string) {
    const genero = await this.generoRepository.findOne({ where: { id }, relations: { peliculas: true } });
    if (!genero) throw new NotFoundException('Género no encontrado');
    return genero;
  }

  async update(id: string, updateGeneroDto: UpdateGeneroDto) {
    const genero = await this.findOne(id);

    if (updateGeneroDto.nombre) {
      const existe = await this.generoRepository.findOne({ where: { nombre: updateGeneroDto.nombre } });
      if (existe && existe.id !== id) {
        throw new ConflictException('El nombre del género ya existe');
      }
    }

    Object.assign(genero, updateGeneroDto);
    return this.generoRepository.save(genero);
  }

  async remove(id: string) {
    const genero = await this.generoRepository.findOne({ where: { id }, relations: { peliculas: true } });
    if (!genero) throw new NotFoundException('Género no encontrado');

    // Regla 1: No se puede eliminar un género con películas asociadas
    if (genero.peliculas && genero.peliculas.length > 0) {
      throw new BadRequestException('No se puede eliminar un género que tiene películas asociadas');
    }

    return this.generoRepository.remove(genero);
  }
}
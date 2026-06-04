import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './pelicula.entity';
import { Genero } from '../generos/genero.entity';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';

export interface EntradaConDescuento {
  tipo_cliente: 'regular' | 'estudiante' | 'jubilado';
  precio_base: number;
}

export interface ResumenEntradas {
  total_entradas: number;
  precio_total: number;
  detalle: {
    tipo_cliente: string;
    precio_base: number;
    descuento_pct: number;
    precio_final: number;
  }[];
}

@Injectable()
export class PeliculasService {
  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,

    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  async create(createPeliculaDto: CreatePeliculaDto) {
    // Regla 2: Código de película único
    const codigoExistente = await this.peliculaRepository.findOne({ where: { codigo: createPeliculaDto.codigo } });
    if (codigoExistente) {
      throw new ConflictException('El código de película ya existe en el sistema');
    }

    const genero = await this.generoRepository.findOne({ where: { id: createPeliculaDto.generoId } });
    if (!genero) throw new NotFoundException('Género no encontrado');

    const pelicula = this.peliculaRepository.create({
      titulo: createPeliculaDto.titulo,
      codigo: createPeliculaDto.codigo,
      duracion_minutos: createPeliculaDto.duracion_minutos,
      precio_entrada: createPeliculaDto.precio_entrada,
      en_cartelera: createPeliculaDto.en_cartelera ?? true,
      genero,
    });
    return this.peliculaRepository.save(pelicula);
  }

  async findAll(generoId?: string, enCartelera?: boolean, titulo?: string, codigo?: string, ordenarPor?: string) {
    let query = this.peliculaRepository.createQueryBuilder('pelicula').leftJoinAndSelect('pelicula.genero', 'genero');

    // Filtrar por género (Regla 5)
    if (generoId) {
      query = query.where('pelicula.generoId = :generoId', { generoId });
    }

    // Filtrar por estado en cartelera (Regla 5)
    if (enCartelera !== undefined) {
      query = query.andWhere('pelicula.en_cartelera = :enCartelera', { enCartelera });
    }

    // Búsqueda por título (Regla 5)
    if (titulo) {
      query = query.andWhere('pelicula.titulo ILIKE :titulo', { titulo: `%${titulo}%` });
    }

    // Búsqueda por código (Regla 5)
    if (codigo) {
      query = query.andWhere('pelicula.codigo ILIKE :codigo', { codigo: `%${codigo}%` });
    }

    // Ordenar por duración (Regla 5)
    if (ordenarPor === 'duracion') {
      query = query.orderBy('pelicula.duracion_minutos', 'ASC');
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const pelicula = await this.peliculaRepository.findOne({ where: { id }, relations: { genero: true } });
    if (!pelicula) throw new NotFoundException('Película no encontrada');
    return pelicula;
  }

  async update(id: string, updatePeliculaDto: UpdatePeliculaDto) {
    const pelicula = await this.findOne(id);

    // Verificar código único si se intenta actualizar
    if (updatePeliculaDto.codigo && updatePeliculaDto.codigo !== pelicula.codigo) {
      const codigoExistente = await this.peliculaRepository.findOne({ where: { codigo: updatePeliculaDto.codigo } });
      if (codigoExistente) {
        throw new ConflictException('El código de película ya existe en el sistema');
      }
    }

    if (updatePeliculaDto.generoId) {
      const genero = await this.generoRepository.findOne({ where: { id: updatePeliculaDto.generoId } });
      if (!genero) throw new NotFoundException('Género no encontrado');
      pelicula.genero = genero;
    }

    Object.assign(pelicula, updatePeliculaDto);
    return this.peliculaRepository.save(pelicula);
  }

  async remove(id: string) {
    const pelicula = await this.findOne(id);
    return this.peliculaRepository.remove(pelicula);
  }

  // Ejercicio for: Calcular descuentos por tipo de cliente
  calcularDescuentosEntradas(entradas: EntradaConDescuento[]): ResumenEntradas {
    const descuentosPorTipo = {
      regular: 0,
      estudiante: 15,
      jubilado: 20,
    };

    const detalle = [];
    let precioTotal = 0;

    // Usar for para recorrer las entradas
    for (let i = 0; i < entradas.length; i++) {
      const entrada = entradas[i];
      const descuento_pct = descuentosPorTipo[entrada.tipo_cliente] || 0;
      const precio_final = entrada.precio_base * (1 - descuento_pct / 100);

      detalle.push({
        tipo_cliente: entrada.tipo_cliente,
        precio_base: entrada.precio_base,
        descuento_pct,
        precio_final,
      });

      precioTotal += precio_final;
    }

    return {
      total_entradas: entradas.length,
      precio_total: precioTotal,
      detalle,
    };
  }

  // Ejercicio while: Programar funciones según capacidad disponible
  programarFunciones(asientosDisponibles: number, capacidadesStr: string): { funciones_programadas: string[]; asientos_libres: number } {
    // Convertir cadena de capacidades en lista
    const capacidades = capacidadesStr.split(',').map((c) => parseInt(c.trim(), 10));

    const funcionesProgramadas = [];
    let acumulado = 0;
    let indice = 0;

    // Usar while para programar funciones
    while (indice < capacidades.length) {
      const capacidadActual = capacidades[indice];

      // Si la función cabe en los asientos disponibles
      if (acumulado + capacidadActual <= asientosDisponibles) {
        funcionesProgramadas.push(`Función ${indice + 1}`);
        acumulado += capacidadActual;
        indice++;
      } else {
        // Detener el ciclo si no cabe la función
        break;
      }
    }

    const asientosLibres = asientosDisponibles - acumulado;

    return {
      funciones_programadas: funcionesProgramadas,
      asientos_libres: asientosLibres,
    };
  }
}
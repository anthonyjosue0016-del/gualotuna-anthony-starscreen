import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PeliculasService, type EntradaConDescuento, type ResumenEntradas } from './peliculas.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { IsStaffGuard } from '../common/guards/is-staff.guard';

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Post()
  @UseGuards(IsStaffGuard)
  create(@Body() createPeliculaDto: CreatePeliculaDto) {
    return this.peliculasService.create(createPeliculaDto);
  }

  @Get()
  findAll(
    @Query('generoId') generoId?: string,
    @Query('enCartelera') enCartelera?: string,
    @Query('titulo') titulo?: string,
    @Query('codigo') codigo?: string,
    @Query('ordenarPor') ordenarPor?: string,
  ) {
    const enCartelaraBoolean = enCartelera === 'true' ? true : enCartelera === 'false' ? false : undefined;
    return this.peliculasService.findAll(generoId, enCartelaraBoolean, titulo, codigo, ordenarPor);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peliculasService.findOne(id);
  }

  @Put(':id')
  @UseGuards(IsStaffGuard)
  update(@Param('id') id: string, @Body() updatePeliculaDto: UpdatePeliculaDto) {
    return this.peliculasService.update(id, updatePeliculaDto);
  }

  @Delete(':id')
  @UseGuards(IsStaffGuard)
  remove(@Param('id') id: string) {
    return this.peliculasService.remove(id);
  }

  @Post('calcular/descuentos')
  calcularDescuentos(@Body() body: { entradas: EntradaConDescuento[] }): ResumenEntradas {
    return this.peliculasService.calcularDescuentosEntradas(body.entradas);
  }

  @Post('programar/funciones')
  programarFunciones(@Body() body: { asientos_disponibles: number; capacidades: string }): { funciones_programadas: string[]; asientos_libres: number } {
    return this.peliculasService.programarFunciones(body.asientos_disponibles, body.capacidades);
  }
}
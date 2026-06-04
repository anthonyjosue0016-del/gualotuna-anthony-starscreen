import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { GenerosService } from './generos.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { IsStaffGuard } from '../common/guards/is-staff.guard';

@Controller('generos')
export class GenerosController {
  constructor(private readonly generosService: GenerosService) {}

  @Post()
  @UseGuards(IsStaffGuard)
  create(@Body() createGeneroDto: CreateGeneroDto) {
    return this.generosService.create(createGeneroDto);
  }

  @Get()
  findAll() {
    return this.generosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generosService.findOne(id);
  }

  @Put(':id')
  @UseGuards(IsStaffGuard)
  update(@Param('id') id: string, @Body() updateGeneroDto: UpdateGeneroDto) {
    return this.generosService.update(id, updateGeneroDto);
  }

  @Delete(':id')
  @UseGuards(IsStaffGuard)
  remove(@Param('id') id: string) {
    return this.generosService.remove(id);
  }
}
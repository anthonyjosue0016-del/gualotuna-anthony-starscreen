import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async create(createStaffDto: CreateStaffDto) {
    const staff = this.staffRepository.create(createStaffDto);
    return this.staffRepository.save(staff);
  }

  findAll() {
    return this.staffRepository.find();
  }

  async findOne(id: string) {
    const staff = await this.staffRepository.findOne({ where: { id } });
    if (!staff) throw new NotFoundException('Miembro de staff no encontrado');
    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.findOne(id);
    Object.assign(staff, updateStaffDto);
    return this.staffRepository.save(staff);
  }

  async remove(id: string) {
    const staff = await this.findOne(id);
    return this.staffRepository.remove(staff);
  }
}

import { Controller, Get, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Group } from '@prisma/client';

class CreateCompanyDto {
  name: string;
  group: Group;
  logoUrl?: string;
}

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Post()
  create(dto: CreateCompanyDto) {}

  @Get()
  getAll() {
    const result = this.companyService.getAll();
    console.log('CompanyController.getAll', result);
    return result;
  }
}

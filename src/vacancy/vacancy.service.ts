import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VacancyService {
  constructor(private prisma: PrismaService) {}

  async create(createVacancyDto: CreateVacancyDto) {
    const { description, requirements, recruiterId } = createVacancyDto;
    try {
      const recruiter = await this.prisma.recruiter.findUnique({
        where: {
          id: +recruiterId,
        },
      });

      if (!recruiter) {
        const secondTryResult = await this.prisma.recruiter.findUnique({
          where: {
            id: +recruiterId,
          },
        });

        if (!secondTryResult) {
          throw new ForbiddenException(
            `Cannot find recruiter with id ${recruiterId}.`,
          );
        }
      }

      const vacancy = this.prisma.vacancy.create({
        data: {
          description,
          requirements,
          recruiterId: +recruiterId,
        },
      });
      return vacancy;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  findAll() {
    return `This action returns all vacancy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vacancy`;
  }

  update(id: number, updateVacancyDto: UpdateVacancyDto) {
    return `This action updates a #${id} vacancy`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacancy`;
  }
}

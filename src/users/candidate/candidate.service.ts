import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplyToVacancyDto } from './dto/apply-to-vacancy.dto';

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {}

  async create(createCandidateDto: CreateCandidateDto) {
    const { email, firstName, lastName, hash, type } = createCandidateDto;
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          // TODO: hash password
          hash,
          type,
          candidate: {
            create: {},
          },
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken');
      }
      throw new UnprocessableEntityException(error);
    }
  }

  findAll() {
    return `This action returns all candidate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} candidate`;
  }

  update(id: number, updateCandidateDto: UpdateCandidateDto) {
    return `This action updates a #${id} candidate`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidate`;
  }

  async applyToVacancy(applyToVacancyDto: ApplyToVacancyDto) {
    const { vacancyId, candidateId } = applyToVacancyDto;
    try {
      const vacancy = await this.prisma.vacancy.findUnique({
        where: {
          id: vacancyId,
        },
      });
      if (!vacancy) throw new ForbiddenException('Vacancy does not exist');

      const candidate = await this.prisma.candidate.findUnique({
        where: {
          id: candidateId,
        },
        include: { applies: true },
      });
      if (!candidate) throw new ForbiddenException('Candidate does not exist');

      candidate.applies.push(vacancy);

      const updateCandidate = await this.prisma.candidate.update({
        where: {
          id: candidateId,
        },
        data: {
          applies: {
            connect: candidate.applies.map((vacancy) => ({ id: vacancy.id })),
          },
        },
      });

      return updateCandidate;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}

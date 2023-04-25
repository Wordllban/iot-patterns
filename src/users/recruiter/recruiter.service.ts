import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInterviewDto } from '../../interview/dto/create-interview.dto';
import { InterviewService } from '../../interview/interview.service';

@Injectable()
export class RecruiterService {
  constructor(
    private prisma: PrismaService,
    private interview: InterviewService,
  ) {}

  makeInterview(dto: CreateInterviewDto) {
    return this.interview.create(dto);
  }

  async create(createRecruiterDto: CreateRecruiterDto) {
    const { email, firstName, lastName, hash, type } = createRecruiterDto;
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          // TODO: hash password
          hash,
          type,
          recruiter: {
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
    return `This action returns all recruiter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recruiter`;
  }

  update(id: number, updateRecruiterDto: UpdateRecruiterDto) {
    return `This action updates a #${id} recruiter`;
  }

  remove(id: number) {
    return `This action removes a #${id} recruiter`;
  }
}

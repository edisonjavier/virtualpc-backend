import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";

@Injectable()
export class PersonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPersonDto: CreatePersonDto) {
    const newPerson = await this.prisma.person.create({ data: createPersonDto });
    return newPerson;
  }

  async findAll() {
    return this.prisma.person.findMany();
  }

  async findOne(personId: number) {
    return this.prisma.person.findUnique({ where: { personId } });
  }

  async findByPhoneOrDni(phone: string, dni: string) {
    return this.prisma.person.findFirst({
      where: {
        OR: [{ dni: dni }, { phone: phone }]
      }
    });
  }

  async update(personId: number, updatePersonDto: UpdatePersonDto) {
    const updatedPerson = await this.prisma.person.update({ data: updatePersonDto, where: { personId } });
    return updatedPerson;
  }

  async remove(personId: number) {
    const deletedPerson = await this.prisma.person.delete({ where: { personId } });
    return deletedPerson;
  }
}

import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CardsDTO } from './dto/cards.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cryptr = require('cryptr');

@Injectable()
export class CardsRepository {
  private code = process.env.SECRET_KEY_CRYPTR;
  private cryptr = new Cryptr(this.code);

  constructor(private readonly prisma: PrismaService) {}

  createCard(cardDTo: CardsDTO, userId: number) {
    return this.prisma.cards.create({
      data: {
        ...cardDTo,
        cvv: this.cryptr.encrypt(cardDTo.cvv) as string,
        password: this.cryptr.encrypt(cardDTo.password) as string,
        userId,
      },
    });
  }

  findCardByUserIdAndTitle(userId: number, title: string) {
    return this.prisma.cards.findUnique({
      where: {
        userId_title: {
          userId,
          title,
        },
      },
    });
  }
}

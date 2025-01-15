import { Module } from '@nestjs/common'

import { QuestionsRepository } from '@/domain/application/repositories/questions-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'

@Module({
    providers: [
        PrismaService,
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository,
        },
    ],
    exports: [PrismaService, QuestionsRepository],
})
export class DatabaseModule {}

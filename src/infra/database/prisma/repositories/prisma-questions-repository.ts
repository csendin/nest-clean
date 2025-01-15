import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/application/repositories/questions-repository'
import { Question } from '@/domain/enterprise/entities/question'

import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
    constructor(
        private prisma: PrismaService,
        private questionAttachmentsRepository: QuestionAttachmentsRepository,
    ) {}

    async findById(id: string) {
        const question = await this.prisma.question.findUnique({
            where: { id },
        })

        if (!question) return null

        return PrismaQuestionMapper.toDomain(question)
    }

    async findBySlug(slug: string) {
        const question = await this.prisma.question.findUnique({
            where: { slug },
        })

        if (!question) return null

        return PrismaQuestionMapper.toDomain(question)
    }

    async findMany({ page }: PaginationParams) {
        const questions = await this.prisma.question.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
            skip: (page - 1) * 20,
        })

        return questions.map(PrismaQuestionMapper.toDomain)
    }

    async create(question: Question) {
        const data = PrismaQuestionMapper.toPrisma(question)

        await this.prisma.question.create({
            data,
        })
    }

    async update(question: Question) {
        const data = PrismaQuestionMapper.toPrisma(question)

        await this.prisma.question.update({
            where: { id: data.id },
            data,
        })
    }

    async delete(question: Question) {
        const data = PrismaQuestionMapper.toPrisma(question)

        await this.prisma.question.delete({
            where: { id: data.id },
        })
    }
}

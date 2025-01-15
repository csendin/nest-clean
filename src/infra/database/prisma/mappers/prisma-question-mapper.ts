import { Prisma, Question as PrismaQuestion } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/enterprise/entities/question'
import { Slug } from '@/domain/enterprise/value-objects/slug'

export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion): Question {
        return Question.create(
            {
                title: raw.title,
                slug: Slug.create(raw.slug),
                content: raw.content,
                authorId: new UniqueEntityId(raw.authorId),
                bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityId(raw.id),
        )
    }

    static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
        return {
            id: question.id.toString(),
            title: question.title,
            slug: question.slug.value,
            content: question.content,
            authorId: question.authorId.toString(),
            bestAnswerId: question.bestAnswerId?.toString(),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        }
    }
}

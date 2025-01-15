import { Either, left, right } from '@/core/either'
import { Question } from '@/domain/enterprise/entities/question'

import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { QuestionsRepository } from '../../repositories/questions-repository'

interface GetQuestionBySlugRequest {
    slug: string
}

type GetQuestionBySlugResponse = Either<
    ResourceNotFoundError,
    {
        question: Question
    }
>

export class GetQuestionBySlugUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({ slug }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
        const question = await this.questionsRepository.findBySlug(slug)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        return right({ question })
    }
}

import { Either, right } from '@/core/either'
import { Question } from '@/domain/enterprise/entities/question'

import { QuestionsRepository } from '../../repositories/questions-repository'

interface FetchRecentQuestionsRequest {
    page: number
}

type FetchRecentQuestionsResponse = Either<
    null,
    {
        questions: Question[]
    }
>

export class FetchRecentQuestionsUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({ page }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
        const questions = await this.questionsRepository.findMany({ page })

        return right({ questions })
    }
}

import { Either, right } from '@/core/either'
import { Answer } from '@/domain/enterprise/entities/answer'

import { AnswersRepository } from '../../repositories/answers-repository'

interface FetchQuestionAnswersRequest {
    questionId: string
    page: number
}

type FetchQuestionAnswersResponse = Either<
    null,
    {
        answers: Answer[]
    }
>

export class FetchQuestionAnswersUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async execute({ questionId, page }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {
        const answers = await this.answersRepository.findMany(questionId, { page })

        return right({ answers })
    }
}

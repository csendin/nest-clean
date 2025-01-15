import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/enterprise/entities/answer-comment'

import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { AnswerCommentsRepository } from '../../repositories/answer-comments-repository'
import { AnswersRepository } from '../../repositories/answers-repository'

interface CommentOnAnswerRequest {
    content: string
    authorId: string
    answerId: string
}

type CommentOnAnswerResponse = Either<
    ResourceNotFoundError,
    {
        answerComment: AnswerComment
    }
>

export class CommentOnAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerCommentsRepository: AnswerCommentsRepository,
    ) {}

    async execute({ content, authorId, answerId }: CommentOnAnswerRequest): Promise<CommentOnAnswerResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        const answerComment = AnswerComment.create({
            content,
            authorId: new UniqueEntityId(authorId),
            answerId: new UniqueEntityId(answerId),
        })

        await this.answerCommentsRepository.create(answerComment)

        return right({ answerComment })
    }
}

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/enterprise/entities/question-comment'

import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { QuestionCommentsRepository } from '../../repositories/question-comments-repository'
import { QuestionsRepository } from '../../repositories/questions-repository'

interface CommentOnQuestionRequest {
    content: string
    authorId: string
    questionId: string
}

type CommentOnQuestionResponse = Either<
    ResourceNotFoundError,
    {
        questionComment: QuestionComment
    }
>

export class CommentOnQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionCommentsRepository: QuestionCommentsRepository,
    ) {}

    async execute({ content, authorId, questionId }: CommentOnQuestionRequest): Promise<CommentOnQuestionResponse> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        const questionComment = QuestionComment.create({
            content,
            authorId: new UniqueEntityId(authorId),
            questionId: new UniqueEntityId(questionId),
        })

        await this.questionCommentsRepository.create(questionComment)

        return right({ questionComment })
    }
}

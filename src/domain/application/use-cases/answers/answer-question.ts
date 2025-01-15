import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/enterprise/entities/answer'
import { AnswerAttachment } from '@/domain/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '@/domain/enterprise/entities/answer-attachment-list'

import { AnswersRepository } from '../../repositories/answers-repository'

interface AnswerQuestionRequest {
    content: string
    authorId: string
    questionId: string
    attachmentsIds: string[]
}

type AnswerQuestionResponse = Either<
    null,
    {
        answer: Answer
    }
>

export class AnswerQuestionUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async execute({
        content,
        authorId,
        questionId,
        attachmentsIds,
    }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityId(authorId),
            questionId: new UniqueEntityId(questionId),
        })

        const answerAttachments = attachmentsIds.map((attachmentId) => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                answerId: answer.id,
            })
        })

        answer.attachments = new AnswerAttachmentList(answerAttachments)

        await this.answersRepository.create(answer)

        return right({ answer })
    }
}

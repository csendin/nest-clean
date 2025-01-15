import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/enterprise/entities/answer'
import { AnswerAttachment } from '@/domain/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '@/domain/enterprise/entities/answer-attachment-list'

import { NotAllowedError } from '../../errors/not-allowed-error'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { AnswerAttachmentsRepository } from '../../repositories/answer-attachments-repository'
import { AnswersRepository } from '../../repositories/answers-repository'

interface EditAnswerRequest {
    content: string
    authorId: string
    answerId: string
    attachmentsIds: string[]
}

type EditAnswerResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        answer: Answer
    }
>

export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) {}

    async execute({ content, authorId, answerId, attachmentsIds }: EditAnswerRequest): Promise<EditAnswerResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

        const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

        const answerAttachments = attachmentsIds.map((attachmentId) => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                answerId: answer.id,
            })
        })

        answerAttachmentList.update(answerAttachments)
        answer.attachments = answerAttachmentList

        answer.content = content

        await this.answersRepository.update(answer)

        return right({ answer })
    }
}

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/enterprise/entities/question'
import { QuestionAttachment } from '@/domain/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/enterprise/entities/question-attachment-list'

import { NotAllowedError } from '../../errors/not-allowed-error'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { QuestionAttachmentsRepository } from '../../repositories/question-attachments-repository'
import { QuestionsRepository } from '../../repositories/questions-repository'

interface EditQuestionRequest {
    title: string
    content: string
    authorId: string
    questionId: string
    attachmentsIds: string[]
}

type EditQuestionResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        question: Question
    }
>

export class EditQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionAttachmentsRepository: QuestionAttachmentsRepository,
    ) {}

    async execute({
        title,
        content,
        authorId,
        questionId,
        attachmentsIds,
    }: EditQuestionRequest): Promise<EditQuestionResponse> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentQuestionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

        const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)

        const questionAttachments = attachmentsIds.map((attachmentId) => {
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                questionId: question.id,
            })
        })

        questionAttachmentList.update(questionAttachments)

        question.attachments = questionAttachmentList
        question.title = title
        question.content = content

        await this.questionsRepository.update(question)

        return right({ question })
    }
}

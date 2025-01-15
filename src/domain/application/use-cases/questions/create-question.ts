import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/enterprise/entities/question'
import { QuestionAttachment } from '@/domain/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/enterprise/entities/question-attachment-list'

import { QuestionsRepository } from '../../repositories/questions-repository'

interface CreateQuestionRequest {
    title: string
    content: string
    authorId: string
    attachmentsIds: string[]
}

type CreateQuestionResponse = Either<
    null,
    {
        question: Question
    }
>

@Injectable()
export class CreateQuestionUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({
        title,
        content,
        authorId,
        attachmentsIds,
    }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
        const question = Question.create({
            title,
            content,
            authorId: new UniqueEntityId(authorId),
        })

        const questionAttachments = attachmentsIds.map((attachmentId) => {
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                questionId: question.id,
            })
        })

        question.attachments = new QuestionAttachmentList(questionAttachments)

        await this.questionsRepository.create(question)

        return right({ question })
    }
}

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachment, QuestionAttachmentProps } from '@/domain/enterprise/entities/question-attachment'

export function makeQuestionAttachment(override: Partial<QuestionAttachmentProps> = {}, id?: UniqueEntityId) {
    const questionAttachment = QuestionAttachment.create(
        {
            questionId: new UniqueEntityId(),
            attachmentId: new UniqueEntityId(),
            ...override,
        },
        id,
    )

    return questionAttachment
}

import { QuestionAttachmentsRepository } from '@/domain/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
    items: QuestionAttachment[] = []

    async findManyByQuestionId(questionId: string) {
        const questionAttachments = this.items.filter((item) => item.questionId.toString() === questionId)

        return questionAttachments
    }

    async deleteManyByQuestionId(questionId: string) {
        const questionAttachments = this.items.filter((item) => item.questionId.toString() !== questionId)

        this.items = questionAttachments
    }
}

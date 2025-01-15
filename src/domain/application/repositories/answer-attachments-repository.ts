import { AnswerAttachment } from '@/domain/enterprise/entities/answer-attachment'

export interface AnswerAttachmentsRepository {
    findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
    deleteManyByAnswerId(answerId: string): Promise<void>
}

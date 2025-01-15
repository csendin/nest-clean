import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '@/domain/enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
    findById(id: string): Promise<AnswerComment | null>
    findMany(questionId: string, params: PaginationParams): Promise<AnswerComment[]>
    create(answerComment: AnswerComment): Promise<void>
    delete(answerComment: AnswerComment): Promise<void>
}

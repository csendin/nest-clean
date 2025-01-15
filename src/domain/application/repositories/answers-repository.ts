import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '@/domain/enterprise/entities/answer'

export interface AnswersRepository {
    findById(id: string): Promise<Answer | null>
    findMany(questionId: string, params: PaginationParams): Promise<Answer[]>
    create(answer: Answer): Promise<void>
    update(answer: Answer): Promise<void>
    delete(answer: Answer): Promise<void>
}

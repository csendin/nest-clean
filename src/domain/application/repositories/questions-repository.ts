import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '@/domain/enterprise/entities/question'

export interface QuestionsRepository {
    findById(id: string): Promise<Question | null>
    findBySlug(slug: string): Promise<Question | null>
    findMany(params: PaginationParams): Promise<Question[]>
    create(question: Question): Promise<void>
    update(question: Question): Promise<void>
    delete(question: Question): Promise<void>
}

import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '@/domain/enterprise/entities/question'

export abstract class QuestionsRepository {
    abstract findById(id: string): Promise<Question | null>
    abstract findBySlug(slug: string): Promise<Question | null>
    abstract findMany(params: PaginationParams): Promise<Question[]>
    abstract create(question: Question): Promise<void>
    abstract update(question: Question): Promise<void>
    abstract delete(question: Question): Promise<void>
}

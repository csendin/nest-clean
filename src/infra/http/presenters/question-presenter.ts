import { Question } from '@/domain/enterprise/entities/question'

export class QuestionPresenter {
    static toHttp(question: Question) {
        return {
            id: question.id.toString(),
            title: question.title,
            slug: question.slug.value,
            content: question.content,
            authorId: question.authorId.toString(),
            bestAnswerId: question.bestAnswerId?.toString(),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        }
    }
}

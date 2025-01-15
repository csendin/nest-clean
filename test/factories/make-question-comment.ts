import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment, QuestionCommentProps } from '@/domain/enterprise/entities/question-comment'

export function makeQuestionComment(override: Partial<QuestionCommentProps> = {}, id?: UniqueEntityId) {
    const question = QuestionComment.create(
        {
            content: faker.lorem.sentence(8),
            authorId: new UniqueEntityId(),
            questionId: new UniqueEntityId(),
            ...override,
        },
        id,
    )

    return question
}

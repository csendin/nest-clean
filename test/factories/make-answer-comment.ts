import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment, AnswerCommentProps } from '@/domain/enterprise/entities/answer-comment'

export function makeAnswerComment(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityId) {
    const answer = AnswerComment.create(
        {
            content: faker.lorem.sentence(8),
            authorId: new UniqueEntityId(),
            answerId: new UniqueEntityId(),
            ...override,
        },
        id,
    )

    return answer
}

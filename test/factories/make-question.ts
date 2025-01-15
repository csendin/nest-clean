import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question, QuestionProps } from '@/domain/enterprise/entities/question'

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityId) {
    const question = Question.create(
        {
            title: faker.lorem.sentence(4),
            content: faker.lorem.sentence(8),
            authorId: new UniqueEntityId(),
            ...override,
        },
        id,
    )

    return question
}

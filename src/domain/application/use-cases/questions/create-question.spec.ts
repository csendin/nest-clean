import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CreateQuestionUseCase } from './create-question'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let createQuestion: CreateQuestionUseCase

describe('Create Question', () => {
    beforeEach(() => {
        questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
        createQuestion = new CreateQuestionUseCase(questionsRepository)
    })

    it('should be able to create a question', async () => {
        const res = await createQuestion.execute({
            title: 'New question',
            content: 'Question content',
            authorId: '1',
            attachmentsIds: ['1', '2'],
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(questionsRepository.items[0]).toEqual(res.value.question)
            expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2)
            expect(questionsRepository.items[0].attachments.currentItems).toEqual([
                expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
                expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
            ])
        }
    })
})

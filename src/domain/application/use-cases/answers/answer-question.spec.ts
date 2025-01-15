import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AnswerQuestionUseCase } from './answer-question'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answerQuestion: AnswerQuestionUseCase

describe('Create Answer', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
        answerQuestion = new AnswerQuestionUseCase(answersRepository)
    })

    it('should be able to create a answer', async () => {
        const res = await answerQuestion.execute({
            content: 'Answer content',
            authorId: '1',
            questionId: '1',
            attachmentsIds: ['1', '2'],
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(answersRepository.items[0]).toEqual(res.value.answer)
        }

        expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(answersRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
        ])
    })
})

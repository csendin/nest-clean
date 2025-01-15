import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let fetchQuestionAnswer: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
        fetchQuestionAnswer = new FetchQuestionAnswersUseCase(answersRepository)
    })

    it('should be able to fetch question answers', async () => {
        await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-1') }))
        await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-1') }))
        await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-1') }))

        const res = await fetchQuestionAnswer.execute({
            questionId: 'question-1',
            page: 1,
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(res.value.answers).toHaveLength(3)
        }
    })

    it('should be able to fetch paginated question answers', async () => {
        for (let i = 1; i <= 22; i++) {
            await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-1') }))
        }

        const res = await fetchQuestionAnswer.execute({
            questionId: 'question-1',
            page: 2,
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(res.value.answers).toHaveLength(2)
        }
    })
})

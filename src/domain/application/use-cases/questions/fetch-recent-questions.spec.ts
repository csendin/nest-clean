import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let fetchRecentQuestions: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
    beforeEach(() => {
        questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
        fetchRecentQuestions = new FetchRecentQuestionsUseCase(questionsRepository)
    })

    it('should be able to fetch recent questions', async () => {
        await questionsRepository.create(makeQuestion({ createdAt: new Date(2024, 0, 20) }))
        await questionsRepository.create(makeQuestion({ createdAt: new Date(2024, 0, 18) }))
        await questionsRepository.create(makeQuestion({ createdAt: new Date(2024, 0, 23) }))

        const res = await fetchRecentQuestions.execute({
            page: 1,
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(res.value.questions).toEqual([
                expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
                expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
                expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
            ])
        }
    })

    it('should be able to fetch paginated recent questions', async () => {
        for (let i = 1; i <= 22; i++) {
            await questionsRepository.create(makeQuestion())
        }

        const res = await fetchRecentQuestions.execute({
            page: 2,
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(res.value.questions).toHaveLength(2)
        }
    })
})

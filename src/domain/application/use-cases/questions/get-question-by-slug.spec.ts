import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let getQuestionBySlug: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
    beforeEach(() => {
        questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
        getQuestionBySlug = new GetQuestionBySlugUseCase(questionsRepository)
    })

    it('should be able to get a question by slug', async () => {
        const newQuestion = makeQuestion()

        await questionsRepository.create(newQuestion)

        const res = await getQuestionBySlug.execute({
            slug: newQuestion.slug.value,
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(res.value.question.title).toEqual(newQuestion.title)
        }
    })
})

import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let fetchQuestionComment: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
    beforeEach(() => {
        questionCommentsRepository = new InMemoryQuestionCommentsRepository()
        fetchQuestionComment = new FetchQuestionCommentsUseCase(questionCommentsRepository)
    })

    it('should be able to fetch question comments', async () => {
        await questionCommentsRepository.create(
            makeQuestionComment({
                questionId: new UniqueEntityId('question-1'),
            }),
        )
        await questionCommentsRepository.create(
            makeQuestionComment({
                questionId: new UniqueEntityId('question-1'),
            }),
        )
        await questionCommentsRepository.create(
            makeQuestionComment({
                questionId: new UniqueEntityId('question-1'),
            }),
        )

        const res = await fetchQuestionComment.execute({
            questionId: 'question-1',
            page: 1,
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(res.value.questionComments).toHaveLength(3)
        }
    })

    it('should be able to fetch paginated question comments', async () => {
        for (let i = 1; i <= 22; i++) {
            await questionCommentsRepository.create(
                makeQuestionComment({
                    questionId: new UniqueEntityId('question-1'),
                }),
            )
        }

        const res = await fetchQuestionComment.execute({
            questionId: 'question-1',
            page: 2,
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(res.value.questionComments).toHaveLength(2)
        }
    })
})

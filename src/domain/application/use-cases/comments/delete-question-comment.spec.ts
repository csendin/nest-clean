import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { NotAllowedError } from '../../errors/not-allowed-error'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let deleteQuestionComment: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        questionCommentsRepository = new InMemoryQuestionCommentsRepository()
        deleteQuestionComment = new DeleteQuestionCommentUseCase(questionCommentsRepository)
    })

    it('should be able to delete a question comment', async () => {
        const questionComment = makeQuestionComment()

        await questionCommentsRepository.create(questionComment)

        const res = await deleteQuestionComment.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(res.value).toBe(null)
        }
    })

    it('should not be able to delete another user question comment', async () => {
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityId('author-1'),
        })

        await questionCommentsRepository.create(questionComment)

        const res = await deleteQuestionComment.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: 'author-2',
        })

        expect(res.isLeft()).toBe(true)
        expect(res.value).toBeInstanceOf(NotAllowedError)
    })
})

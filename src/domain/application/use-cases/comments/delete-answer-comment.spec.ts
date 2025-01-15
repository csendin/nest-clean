import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { NotAllowedError } from '../../errors/not-allowed-error'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let deleteAnswerComment: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
    beforeEach(() => {
        answerCommentsRepository = new InMemoryAnswerCommentsRepository()
        deleteAnswerComment = new DeleteAnswerCommentUseCase(answerCommentsRepository)
    })

    it('should be able to delete a answer comment', async () => {
        const answerComment = makeAnswerComment()

        await answerCommentsRepository.create(answerComment)

        const res = await deleteAnswerComment.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(res.value).toBe(null)
        }
    })

    it('should not be able to delete another user answer comment', async () => {
        const answerComment = makeAnswerComment({
            authorId: new UniqueEntityId('author-1'),
        })

        await answerCommentsRepository.create(answerComment)

        const res = await deleteAnswerComment.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: 'author-2',
        })

        expect(res.isLeft()).toBe(true)
        expect(res.value).toBeInstanceOf(NotAllowedError)
    })
})

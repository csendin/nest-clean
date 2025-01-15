import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { CommentOnAnswerUseCase } from './comment-on-answer'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let commentOnAnswer: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
        answerCommentsRepository = new InMemoryAnswerCommentsRepository()
        commentOnAnswer = new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository)
    })

    it('should be able to comment on answer', async () => {
        const answer = makeAnswer()

        await answersRepository.create(answer)

        const res = await commentOnAnswer.execute({
            content: 'Test comment',
            authorId: answer.authorId.toString(),
            answerId: answer.id.toString(),
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(answerCommentsRepository.items[0]).toEqual(res.value.answerComment)
        }
    })
})

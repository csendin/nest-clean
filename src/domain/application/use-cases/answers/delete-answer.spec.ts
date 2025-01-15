import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { NotAllowedError } from '../../errors/not-allowed-error'
import { DeleteAnswerUseCase } from './delete-answer'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let deleteAnswer: DeleteAnswerUseCase

describe('Delete Answer', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
        deleteAnswer = new DeleteAnswerUseCase(answersRepository)
    })

    it('should be able to delete a answer', async () => {
        const newAnswer = makeAnswer()

        await answersRepository.create(newAnswer)

        await deleteAnswer.execute({
            authorId: newAnswer.authorId.toString(),
            answerId: newAnswer.id.toString(),
        })

        expect(answersRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityId('author-01'),
        })

        await answersRepository.create(newAnswer)

        const res = await deleteAnswer.execute({
            authorId: 'author-02',
            answerId: newAnswer.id.toString(),
        })

        expect(res.isLeft()).toBe(true)
        expect(res.value).toBeInstanceOf(NotAllowedError)
    })
})

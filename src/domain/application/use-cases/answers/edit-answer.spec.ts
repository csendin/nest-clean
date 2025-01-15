import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachments'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { NotAllowedError } from '../../errors/not-allowed-error'
import { EditAnswerUseCase } from './edit-answer'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let editAnswer: EditAnswerUseCase

describe('Edit Answer', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
        editAnswer = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
    })

    it('should be able to edit a answer', async () => {
        const newAnswer = makeAnswer()

        await answersRepository.create(newAnswer)

        answerAttachmentsRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityId('1'),
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityId('2'),
            }),
        )

        const res = await editAnswer.execute({
            content: 'Edited content',
            authorId: newAnswer.authorId.toString(),
            answerId: newAnswer.id.toString(),
            attachmentsIds: ['1', '3'],
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(answersRepository.items[0]).toEqual(res.value.answer)
        }

        expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(answersRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
        ])
    })

    it('should not be able to edit a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityId('author-01'),
        })

        await answersRepository.create(newAnswer)

        const res = await editAnswer.execute({
            content: 'Edited content',
            authorId: 'author-02',
            answerId: newAnswer.id.toString(),
            attachmentsIds: [],
        })

        expect(res.isLeft()).toBe(true)
        expect(res.value).toBeInstanceOf(NotAllowedError)
    })
})

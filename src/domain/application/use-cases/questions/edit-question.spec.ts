import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { NotAllowedError } from '../../errors/not-allowed-error'
import { EditQuestionUseCase } from './edit-question'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let editQuestion: EditQuestionUseCase

describe('Edit Question', () => {
    beforeEach(() => {
        questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
        editQuestion = new EditQuestionUseCase(questionsRepository, questionAttachmentsRepository)
    })

    it('should be able to edit a question', async () => {
        const newQuestion = makeQuestion()

        await questionsRepository.create(newQuestion)

        questionAttachmentsRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityId('1'),
            }),
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityId('2'),
            }),
        )

        const res = await editQuestion.execute({
            title: 'Edited text',
            content: 'Edited content',
            authorId: newQuestion.authorId.toString(),
            questionId: newQuestion.id.toString(),
            attachmentsIds: ['1', '3'],
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(questionsRepository.items[0]).toEqual(res.value.question)
        }

        expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(questionsRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
        ])
    })

    it('should not be able to edit a question from another user', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-01'),
        })

        await questionsRepository.create(newQuestion)

        const res = await editQuestion.execute({
            title: 'Edited text',
            content: 'Edited content',
            authorId: 'author-02',
            questionId: newQuestion.id.toString(),
            attachmentsIds: [],
        })

        expect(res.isLeft()).toBe(true)
        expect(res.value).toBeInstanceOf(NotAllowedError)
    })
})

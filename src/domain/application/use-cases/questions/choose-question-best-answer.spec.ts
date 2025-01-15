import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { NotAllowedError } from '../../errors/not-allowed-error'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)

        chooseQuestionBestAnswer = new ChooseQuestionBestAnswerUseCase(questionsRepository, answersRepository)
    })

    it('should be able to choose the question best answer', async () => {
        const question = makeQuestion()

        const answer = makeAnswer({
            questionId: question.id,
        })

        await questionsRepository.create(question)
        await answersRepository.create(answer)

        const res = await chooseQuestionBestAnswer.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString(),
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(questionsRepository.items[0]).toEqual(res.value.question)
        }
    })

    it('should not be able to to choose another user question best answer', async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityId('author-1'),
        })

        const answer = makeAnswer({
            questionId: question.id,
        })

        await questionsRepository.create(question)
        await answersRepository.create(answer)

        const res = await chooseQuestionBestAnswer.execute({
            answerId: answer.id.toString(),
            authorId: 'author-2',
        })

        expect(res.isLeft()).toBe(true)
        expect(res.value).toBeInstanceOf(NotAllowedError)
    })
})

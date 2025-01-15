import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { CommentOnQuestionUseCase } from './comment-on-question'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let commentOnQuestion: CommentOnQuestionUseCase

describe('Comment on Question', () => {
    beforeEach(() => {
        questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
        questionCommentsRepository = new InMemoryQuestionCommentsRepository()
        commentOnQuestion = new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository)
    })

    it('should be able to comment on question', async () => {
        const question = makeQuestion()

        await questionsRepository.create(question)

        const res = await commentOnQuestion.execute({
            content: 'Test comment',
            authorId: question.authorId.toString(),
            questionId: question.id.toString(),
        })

        expect(res.isRight()).toBe(true)

        if (res.isRight()) {
            expect(questionCommentsRepository.items[0]).toEqual(res.value.questionComment)
        }
    })
})

import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { CreateQuestionUseCase } from '@/domain/application/use-cases/questions/create-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(private createQuestion: CreateQuestionUseCase) {}

    @Post()
    async handle(@Body(bodyValidationPipe) body: CreateQuestionBodySchema, @CurrentUser() user: UserPayload) {
        const { title, content } = body

        const { sub: userId } = user

        await this.createQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: [],
        })
    }
}

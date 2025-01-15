import { Module } from '@nestjs/common'

import { CreateQuestionUseCase } from '@/domain/application/use-cases/questions/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/application/use-cases/questions/fetch-recent-questions'

import { DatabaseModule } from '../database/database.module'
import { CreateQuestionController } from './controllers/questions/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/questions/fetch-recent-questions.controller'
import { AuthenticateController } from './controllers/users/authenticate.controller'
import { CreateAccountController } from './controllers/users/create-account.controller'

@Module({
    imports: [DatabaseModule],
    controllers: [
        CreateAccountController,
        AuthenticateController,
        CreateQuestionController,
        FetchRecentQuestionsController,
    ],
    providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase],
})
export class HttpModule {}

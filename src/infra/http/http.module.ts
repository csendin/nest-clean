import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateQuestionController } from './controllers/questions/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/questions/fetch-recent-questions.controller'
import { AuthenticateController } from './controllers/users/authenticate.controller'
import { CreateAccountController } from './controllers/users/create-account.controller'

@Module({
    imports: [],
    controllers: [
        CreateAccountController,
        AuthenticateController,
        CreateQuestionController,
        FetchRecentQuestionsController,
    ],
    providers: [PrismaService],
})
export class HttpModule {}

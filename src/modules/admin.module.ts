import { Module } from '@nestjs/common';
import { models } from '../DB/model-generation';
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from '../common/services';
import { AdminController } from '../Admin/controller';
import { AdminService } from '../Admin/services';

@Module({
    imports: [models],
    providers: [AdminService, SendEmailService, JwtService],
    controllers: [AdminController],
})
export class AdminModule { }

import { Module } from '@nestjs/common';
import { models } from '../DB/model-generation';
import { JwtService } from '@nestjs/jwt';
import { ReportController } from '../Report/controller';
import { ReportService } from '../Report/services';

@Module({
    imports: [models],
    providers: [ReportService, JwtService],
    controllers: [ReportController],
})
export class ReportModule { }

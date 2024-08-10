import { Module } from '@nestjs/common';
import { models } from '../DB/model-generation';
import { JwtService } from '@nestjs/jwt';
import { CompanyCodeService } from '../companyCode/services';
import { CompanyCodeController } from '../companyCode/controller';

@Module({
    imports: [models],
    providers: [CompanyCodeService, JwtService],
    controllers: [CompanyCodeController],
})
export class CompanyCodeModule { }

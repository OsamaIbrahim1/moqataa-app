import { Module } from '@nestjs/common';
import { models } from '../DB/model-generation';
import { JwtService } from '@nestjs/jwt';
import { CountryCodeServices } from '../countryCode/services';
import { countryCodeController } from '../countryCode/controller';

@Module({
    imports: [models],
    providers: [CountryCodeServices, JwtService],
    controllers: [countryCodeController],
})
export class CountryCodeModule { }

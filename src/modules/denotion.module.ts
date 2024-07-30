import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { models } from '../DB/model-generation';
import { DenotionController } from '../Denotion/controller';
import { DenotionService } from '../Denotion/services';

@Module({
    imports: [models],
    providers: [DenotionService, JwtService],
    controllers: [DenotionController],
})
export class DenotionModule { }

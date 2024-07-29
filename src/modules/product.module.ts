import { Module } from '@nestjs/common';
import { models } from '../DB/model-generation';
import { ProductService } from '../Product/services';
import { ProductController } from '../Product/controller';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [models],
    providers: [ProductService, JwtService],
    controllers: [ProductController],
})
export class ProductModule { }

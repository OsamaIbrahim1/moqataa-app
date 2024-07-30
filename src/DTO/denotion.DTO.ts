import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

@Injectable()
export class createDenotionBodyDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    image: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    link: string;
}

@Injectable()
export class updateDenotionBodyDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    image: string;

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    link: string;
}

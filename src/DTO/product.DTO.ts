import { Injectable } from "@nestjs/common";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

@Injectable()
export class addProductBodyDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @IsNotEmpty()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    country: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rate: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    category: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    resonOfBoycott: string;

    @IsNotEmpty()
    @IsBoolean()
    Boycott: boolean;
}

@Injectable()
export class updateProductBodyDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @IsString()
    image: string;

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    country: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    rate: number;

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    category: string;

    @IsString()
    @MinLength(5)
    @MaxLength(50)
    resonOfBoycott: string;

    @IsBoolean()
    Boycott: boolean;
}
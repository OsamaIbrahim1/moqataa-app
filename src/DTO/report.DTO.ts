import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

@Injectable()
export class addReportBodyDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    message: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    productId: number
}

export class updateReportBodyDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    message: string;
}
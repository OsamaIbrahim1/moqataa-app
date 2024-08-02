
import { Injectable } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { emailRegex, englishNameRegex, passwordRegex } from "../utils";



@Injectable()
export class SignUpBodyDTO {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    @Matches(emailRegex, {
        message: 'Invalid email, please provide a valid email'
    })
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(15)
    @IsNotEmpty()
    password: string;
}

@Injectable()
export class verifyEmailPararmDTO {
    @IsString()
    @IsNotEmpty()
    token: string
}

@Injectable()
export class signInBodyDTO {
    @IsNotEmpty()
    @IsEmail()
    @Matches(emailRegex, {
        message: 'Invalid email, please provide a valid email'
    })
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(15)
    @IsNotEmpty()
    password: string;
}

@Injectable()
export class updateAccountBodyDTO {
    @IsNotEmpty()
    @IsEmail()
    @Matches(emailRegex, {
        message: 'Invalid email, please provide a valid email'
    })
    email: string;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    oldPublicId: string;
}
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFile, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { signInBodyDTO, SignUpBodyDTO, updateAccountBodyDTO, verifyEmailPararmDTO } from "../../DTO";
import { HttpExceptionFilter, multerImages } from "../../Guards";
import * as Multer from "multer";
import { AuthGuard } from "../../Guards";


@Controller('user')
export class UserController {
    constructor(
        private readonly userServices: UserService
    ) { }


    //================================= sign up =================================//
    @Post('signUp')
    @UseInterceptors(FileInterceptor('image', multerImages))
    async signUpController(
        @Req() req: Request,
        @Body() body: SignUpBodyDTO,
        @Res() res: Response,
        @UploadedFile() file: Multer.File
    ) {
        const response = await this.userServices.signUpServices(req, body, file);

        res.status(200).json({ message: 'User created successfully', data: response });

    }

    //================================= verify Email =================================//
    @Get('confirm-email/:token')
    async verifyEmailController(
        @Param() params: verifyEmailPararmDTO,
        @Res() res: Response,
    ) {
        const response = await this.userServices.verifyEmailServices(params);

        res.status(200).json({ message: 'Email verify successfully', data: response });
    }

    //================================= sign in =================================//
    @Post('signIn')
    async signInController(
        @Body() body: signInBodyDTO,
        @Res() res: Response,
    ) {
        const response = await this.userServices.signInServices(body);

        res.status(200).json({ message: 'logedIn successfully', data: response });
    }

    //=============================== update Account =================================//
    @Put('updateAccount')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image', multerImages))
    async updateAccountController(
        @Body() body: updateAccountBodyDTO,
        @Req() req: Request,
        @Res() res: Response,
        @UploadedFile() file: Multer.File
    ) {
        const response = await this.userServices.updateAccountServices(body, req, file);

        res.status(200).json({ message: 'Account updated successfully', data: response });
    }

    //=============================== get User =================================//
    @Get('getUser')
    @UseGuards(AuthGuard)
    async getUserController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.userServices.getUserServices(req);

        res.status(200).json({ message: 'get data successfully', data: response });
    }

    //=============================== delete account =================================//
    @Delete('deleteAccount')
    @UseGuards(AuthGuard)
    async deleteAccountController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.userServices.deleteAccountServices(req);

        res.status(200).json({ message: 'delete account successfully', data: response });
    }

    //================================== Login with Gemail =================================//
    @Post('loginWithGemail')
    async loginWithGemailController(
        @Body() body: signInBodyDTO,
        @Res() res: Response,
    ) {
        const response = await this.userServices.loginWithGemailServices(body);

        res.status(200).json({ message: 'logedIn successfully', data: response });
    }
}
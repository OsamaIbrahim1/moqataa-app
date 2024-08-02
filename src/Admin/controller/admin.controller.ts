import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import * as Multer from "multer";
import { AuthGuard, multerImages } from "../../Guards";
import { AdminService } from "../services";
import { signInBodyDTO, SignUpBodyDTO, updateAccountBodyDTO, verifyEmailPararmDTO } from "../../DTO";
import { Role, Roles } from "../../utils";
import { RolesGuard } from "../../Guards/role.guard";

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminServices: AdminService

    ) { }

    //================================= sign up admin =================================//
    @Post('signUp')
    @UseInterceptors(FileInterceptor('image', multerImages))
    async signUpAdminController(
        @Req() req: Request,
        @Body() body: SignUpBodyDTO,
        @Res() res: Response,
        @UploadedFile() file: Multer.File
    ) {
        const response = await this.adminServices.signUpAdminServices(req, body, file);

        res.status(200).json({ message: 'Admin created successfully', data: response });
    }

    //================================= verify Email =================================//
    @Get('confirm-email/:token')
    async verifyEmailAdminController(
        @Param() params: verifyEmailPararmDTO,
        @Res() res: Response,
    ) {
        const response = await this.adminServices.verifyEmailAdminServices(params);

        res.status(200).json({ message: 'Email verify successfully', data: response });
    }

    //================================= sign in =================================//
    @Post('signIn')
    async signInAdminController(
        @Body() body: signInBodyDTO,
        @Res() res: Response,
    ) {
        const response = await this.adminServices.signInAdminServices(body);

        res.status(200).json({ message: 'logedIn successfully', data: response });
    }

    //=============================== update Account =================================//
    @Put('updateAccount')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('image', multerImages))
    async updateAccountAdminController(
        @Body() body: updateAccountBodyDTO,
        @Req() req: Request,
        @Res() res: Response,
        @UploadedFile() file: Multer.File
    ) {
        const response = await this.adminServices.updateAccountAdminServices(body, req, file);

        res.status(200).json({ message: 'Account updated successfully', data: response });
    }

    //=============================== get data admin =================================//
    @Get('getData')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async getDataAdminController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.adminServices.getDataAdminServices(req);

        res.status(200).json({ message: 'Data fetched successfully', data: response });
    }

    //=============================== delete account admin =================================//
    @Delete('deleteAccountAdmin')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async deleteAccountAdminController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.adminServices.deleteAccountAdminServices(req);

        res.status(200).json({ message: 'Account deleted successfully', data: response });
    }

}
import { Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard, RolesGuard } from "../../Guards";
import { Role, Roles } from "../../utils";
import { CountryCodeServices } from "../services";


@Controller('countryCode')
export class countryCodeController {
    constructor(
        private readonly countryCodeServices: CountryCodeServices
    ) { }


    //================================= create countryCode =================================//
    @Post('addCountryCode')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async createCountryCodeController(
        @Req() req: Request,
        @Body() body: any,
        @Res() res: Response
    ) {
        const response = await this.countryCodeServices.createCountryCodeService(req, body);

        res.status(200).json({ message: 'CountryCode created successfully', data: response });
    }

    //================================= update countryCode =================================//
    @Put('updateCountryCode/:countryCodeId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async updateCountryCodeController(
        @Req() req: Request,
        @Body() body: any,
        @Res() res: Response
    ) {
        const response = await this.countryCodeServices.updateCountryCodeService(req, body);

        res.status(200).json({ message: 'CountryCode updated successfully', data: response });
    }

    //================================= delete countryCode =================================//
    @Delete('deleteCountryCode/:countryCodeId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async deleteCountryCodeController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.countryCodeServices.deleteCountryCodeService(req);

        res.status(200).json({ message: 'CountryCode deleted successfully', data: response });
    }

    //================================= get countryCode by id =================================//
    @Get('getCountryCodeById/:countryCodeId')
    async getCountryCodeByIdController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.countryCodeServices.getCountryCodeByIdService(req);

        res.status(200).json({ message: 'CountryCode', data: response });
    }

    //================================= get all countryCode =================================//
    @Get('getAllCountryCode')
    async getAllCountryCodeController(
        @Res() res: Response
    ) {
        const response = await this.countryCodeServices.getAllCountryCodeService();

        res.status(200).json({ message: 'All CountryCode', data: response });
    }

    //================================= insert data in my database =================================//
    @Get('insertData')
    async insertDataController(
        @Res() res: Response,
    ) {
        const response = await this.countryCodeServices.insertDataServices();

        res.status(200).json({ message: 'Data inserted successfully', data: response });
    }
}
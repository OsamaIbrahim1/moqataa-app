import { Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard, RolesGuard } from "../../Guards";
import { Role, Roles } from "../../utils";
import { Request, Response } from "express";
import { CompanyCodeService } from "../services";

@Controller('companyCode')
export class CompanyCodeController {
    constructor(
        private readonly companyCodeService: CompanyCodeService
    ) { }

    //============================== create companyCode ==============================//
    @Post('addCompanyCode')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async createCompanyCodeController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.companyCodeService.createCompanyCodeService(req);

        res.status(200).json({ message: 'CompanyCode created successfully', data: response });
    }

    //============================== update companyCode ==============================//
    @Put('updateCompanyCode/:companyCodeId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async updateCompanyCodeController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.companyCodeService.updateCompanyCodeService(req);

        res.status(200).json({ message: 'CompanyCode updated successfully', data: response });
    }

    //============================== delete companyCode ==============================//
    @Delete('deleteCompanyCode/:companyCodeId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async deleteCompanyCodeController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.companyCodeService.deleteCompanyCodeService(req);

        res.status(200).json({ message: 'CompanyCode deleted successfully', data: response });
    }

    //============================== get companyCode by id ==============================//
    @Get('getCompanyCodeById/:companyCodeId')
    async getCompanyCodeByIdController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.companyCodeService.getCompanyCodeByIdService(req);

        res.status(200).json({ message: 'CompanyCode fetched successfully', data: response });
    }

    //============================== get all companyCode ==============================//
    @Get('getAllCompanyCode')
    async getAllCompanyCodeController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.companyCodeService.getAllCompanyCodeService();

        res.status(200).json({ message: 'CompanyCode fetched successfully', data: response });
    }

    
        //================================= insert data in my database =================================//
        @Get('insertData')
        async insertDataController(
            @Res() res: Response,
        ) {
            const response = await this.companyCodeService.insertDataServices();
    
            res.status(200).json({ message: 'Data inserted successfully', data: response });
        }
}
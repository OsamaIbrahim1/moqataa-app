import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ReportService } from "../services";
import { AuthGuard, RolesGuard } from "../../Guards";
import { Role, Roles } from "../../utils";
import { addReportBodyDTO, updateReportBodyDTO } from "../../DTO";
import { Request, Response } from "express";

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    //================================= create report =================================//
    @Post('createReport')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.USER)
    async createReportController(
        @Body() body: addReportBodyDTO,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.reportService.createReportService(req, body);

        res.status(200).json({ message: 'Report created successfully', data: response });
    }

    //=============================== update report ================================//
    @Patch('updateReport/:reportId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.USER)
    async updateReportController(
        @Body() body: updateReportBodyDTO,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.reportService.updateReportService(req, body);

        res.status(200).json({ message: 'Report updated successfully', data: response });
    }

    //=============================== delete report ================================//
    @Delete('deleteReport/:reportId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.USER)
    async deleteReportController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.reportService.deleteReportService(req);

        res.status(200).json({ message: 'Report deleted successfully', data: response });
    }

    //============================= get report by id ===============================//
    @Get('getReportById/:reportId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    async getReportByIdController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.reportService.getReportByIdService(req);

        res.status(200).json({ message: 'get report successfully', data: response });
    }

    //============================== get all reports for spcific product ================================//
    @Get('getAllReportsByProductId/:productId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    async getAllReportsByProductIdController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.reportService.getAllReportsByProductIdService(req);
        res.status(200).json({ message: 'All reports for specific product', data: response });
    }

    //============================== get all reports ================================//
    @Get('getAllReports')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async getAllReportsController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.reportService.getAllReportsService(req);

        res.status(200).json({ message: 'All reports', data: response });
    }
}
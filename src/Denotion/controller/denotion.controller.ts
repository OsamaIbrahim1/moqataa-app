import { Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { DenotionService } from "../services";
import { AuthGuard, RolesGuard } from "../../Guards";
import { Role, Roles } from "../../utils";
import { createDenotionBodyDTO, updateDenotionBodyDTO } from "../../DTO/denotion.DTO";

@Controller('denotion')

export class DenotionController {
    constructor(
        private readonly denotionService: DenotionService

    ) { }

    //================================= create Denotion ====================================//
    @Post('createDenotion')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async createDenotionController(
        @Body() body: createDenotionBodyDTO,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.denotionService.createDenotionService(body, req);

        res.status(200).json({ message: 'Denotion created successfully', data: response });
    }

    //================================= update Denotion ====================================//
    @Put('updateDenotion/:denotionId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async updateDenotionController(
        @Body() body: updateDenotionBodyDTO,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.denotionService.updateDenotionService(req, body);

        res.status(200).json({ message: 'Denotion updated successfully', data: response });
    }

    //================================== delete Denotion =======================================//
    @Delete('deleteDenotion/:denotionId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async deleteDenotionController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.denotionService.deleteDenotionService(req);

        res.status(200).json({ message: 'Denotion updated successfully', data: response });
    }

    //================================== get Denotion By Id =======================================//
    @Get('getDenotionById/:denotionId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    async getDenotionByIdController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.denotionService.getDenotionByIdService(req);

        res.status(200).json({ message: 'get denotion  successfully', data: response });
    }

    //================================== get all Denotion =======================================//
    @Get('getAllDenotion')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    async getAllDenotionController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.denotionService.getAllDenotionService();

        res.status(200).json({ message: 'get denotion  successfully', data: response });
    }
}
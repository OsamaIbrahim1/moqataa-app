import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { ProductService } from "../services";
import { addProductBodyDTO, updateProductBodyDTO } from "../../DTO";
import { AuthGuard, RolesGuard } from "../../Guards";
import { Role, Roles } from "../../utils";

@Controller('product')

export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {

    }

    //================================= create product =================================//
    @Post('createProduct')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async createProductController(
        @Body() body: addProductBodyDTO,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        const response = await this.productService.createProductService(body, req);

        res.status(200).json({ message: 'Product created successfully', data: response });
    }

    //================================= update product =================================//
    @Put('updateProduct/:productId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async updateProductController(
        @Body() body: updateProductBodyDTO,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.productService.updateProductService(req, body);

        res.status(200).json({ message: 'Product updated successfully', data: response });
    }

    //================================== get product By Id =======================================//
    @Get('getProductById/:productId')
    // @UseGuards(RolesGuard)
    // @UseGuards(AuthGuard)
    // @Roles(Role.ADMIN, Role.USER)
    async getProductByIdController(
        @Param() param: { productId: string },
        @Res() res: Response,
    ) {
        const response = await this.productService.getProductByIdServices(param);

        res.status(200).json({ message: 'Product retrieved successfully', data: response });
    }

    //================================= delete product =================================//
    @Delete('deleteProduct/:productId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async deleteProductController(
        @Param() param: { productId: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.productService.deleteProductServices(param, req);

        res.status(200).json({ message: 'Product deleted successfully', data: response });
    }

    //================================= get all product =================================//
    @Get('getAllProduct')
    // @UseGuards(RolesGuard)
    // @UseGuards(AuthGuard)
    // @Roles(Role.ADMIN, Role.USER)
    async getAllProductController(
        @Res() res: Response,
    ) {
        const response = await this.productService.getAllProductServices();

        res.status(200).json({ message: 'All product retrieved successfully', data: response });
    }

    //================================= insert data in my database =================================//
    @Get('insertData')
    async insertDataController(
        @Res() res: Response,
    ) {
        const response = await this.productService.insertDataServices();

        res.status(200).json({ message: 'Data inserted successfully', data: response });
    }
}
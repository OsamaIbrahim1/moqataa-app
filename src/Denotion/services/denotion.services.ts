import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Admin, Denotion } from "../../DB/Schemas";
import { createDenotionBodyDTO, updateDenotionBodyDTO } from "../../DTO/denotion.DTO";

@Injectable()
export class DenotionService {
    constructor(
        @InjectModel(Denotion)
        private denotion: typeof Denotion,
        @InjectModel(Admin)
        private adminModel: typeof Admin
    ) { }

    //================================= create Denotion ====================================//
    /**
     * * destructuring the data from body
     * * destructuring the data from headers
     * * check if admin is exist
     * * create object denotion
     * * create denotion
     */
    async createDenotionService(body: createDenotionBodyDTO, req: any) {
        // * destructuring the data from body 
        const { name, image, link } = body;
        // * destructuring the data from headers
        const { id } = req.authUser

        try {
            // * check if admin is exist
            const admin = await this.adminModel.findByPk(id);
            if (!admin) {
                throw new NotFoundException({ message: 'Admin not found', status: 404 });
            }

            // * create object denotion
            const denotionObj = {
                name,
                image,
                link,
                adminId: id
            }

            // * create denotion
            const denotion = await this.denotion.create(denotionObj);
            if (!denotion) {
                throw new BadRequestException({ message: 'Denotion not created', status: 400 });
            }
            return denotion;
        } catch (err) {
            if (!err['response']) {
                throw new InternalServerErrorException({
                    message: 'An unexpected error occurred.',
                    status: 500,
                    timestamp: new Date().toISOString(),
                    error: err.message || 'Unknown error'
                });
            }
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }

    //================================= update Denotion ====================================//
    /**
     * * destructuring the data from body
     * * destructuring the data from headers
     * * destructuring the data from params
     * * check if admin is exist
     * * check if denotion is exist
     * * if admin want to update the name
     * * update the name
     * * if admin want to update the image
     * * update the image
     * * if admin want to update the link
     * * update the link
     * * save changes
     */
    async updateDenotionService(req: any, body: updateDenotionBodyDTO) {
        // * destructuring the data from body
        const { name, image, link } = body;
        // * destructuring the data from headers
        const { id } = req.authUser;
        // * destructuring the data from params
        const { denotionId } = req.params;
        try {
            // * check if admin is exist
            const admin = await this.adminModel.findByPk(id);
            if (!admin) {
                throw new NotFoundException({ message: 'Admin not found', status: 404 });
            }

            // * check if denotion is exist
            const denotion = await this.denotion.findOne({ where: { id: denotionId, adminId: id } });
            if (!denotion) {
                throw new BadRequestException({ message: 'Denotion not found', status: 404 });
            }

            // * if admin want to update the name
            if (name) {
                // * update the name
                denotion.name = name;
            }

            // * if admin want to update the image
            if (image) {
                // * update the image
                denotion.image = image;
            }

            // * if admin want to update the link
            if (link) {
                // * update the link
                denotion.link = link;
            }

            // * save changes
            await denotion.save();

            return denotion
        } catch (err) {
            if (!err['response']) {
                throw new InternalServerErrorException({
                    message: 'An unexpected error occurred.',
                    status: 500,
                    timestamp: new Date().toISOString(),
                    error: err.message || 'Unknown error'
                });
            }
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }

    //================================== delete Denotion =======================================//
    /**
     * * destructuring the data from headers
     * * destructuring the data from params
     * * check if admin is exist
     * * delete denotion
     */
    async deleteDenotionService(req: any) {
        // * destructuring the data from headers
        const { id } = req.authUser;
        // * destructuring the data from params
        const { denotionId } = req.params;
        try {
            // * check if admin is exist
            const admin = await this.adminModel.findByPk(id);
            if (!admin) {
                throw new NotFoundException({ message: 'Admin not found', status: 404 });
            }

            // * delete denotion
            const denotion = await this.denotion.destroy({ where: { id: denotionId, adminId: id } });
            if (!denotion) {
                throw new BadRequestException({ message: 'Denotion not found', status: 404 });
            }

            return denotion;
        } catch (err) {
            if (!err['response']) {
                throw new InternalServerErrorException({
                    message: 'An unexpected error occurred.',
                    status: 500,
                    timestamp: new Date().toISOString(),
                    error: err.message || 'Unknown error'
                });
            }
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }

    //================================== get Denotion By Id =======================================//
    /**
     * * destructuring the data from params
     * * get denotion by id
     */
    async getDenotionByIdService(req: any) {
        // * destructuring the data from params
        const { denotionId } = req.params;
        try {
            // * get denotion by id
            const denotion = await this.denotion.findByPk(denotionId);
            if (!denotion) {
                throw new NotFoundException({ message: 'Denotion not found', status: 404 });
            }

            return denotion;
        } catch (err) {
            if (!err['response']) {
                throw new InternalServerErrorException({
                    message: 'An unexpected error occurred.',
                    status: 500,
                    timestamp: new Date().toISOString(),
                    error: err.message || 'Unknown error'
                });
            }
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }

    //================================== get all Denotion =======================================//
    /**
     * * get all denotion
     */
    async getAllDenotionService() {
        try {
            // * get all denotion
            const denotion = await this.denotion.findAll();

            return denotion;
        } catch (err) {
            if (!err['response']) {
                throw new InternalServerErrorException({
                    message: 'An unexpected error occurred.',
                    status: 500,
                    timestamp: new Date().toISOString(),
                    error: err.message || 'Unknown error'
                });
            }
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }
}
import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CompanyCode } from "../../DB/Schemas";
import * as fs from 'fs';
import * as path from "path";


@Injectable()
export class CompanyCodeService {
    constructor(
        @InjectModel(CompanyCode)
        private companyCodeModel: typeof CompanyCode,
    ) { }

    //============================== create companyCode ==============================//
    /**
     * * destructuring the request body
     * * destructuring the data from headers
     * * creating the company code
     */
    async createCompanyCodeService(req: any) {
        // * destructuring the request body
        const { name, barcodeNumber } = req.body
        // * destructuring the data from headers
        const { id } = req.authUser
        try {
            // * creating the company code
            const companyCode = await this.companyCodeModel.create({
                name,
                barcodeNumber,
                adminId: id
            });
            if (!companyCode) {
                throw new BadRequestException({ message: 'Company code not created', status: 400 });
            }

            return companyCode;
        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }

    //============================== update companyCode ==============================//
    /**
     * * destructuring the request body
     * * destructuring the data from headers
     * * destructuring the company code id from the request params
     * * checking if the company code exists
     * * if admin want to update the company code name
     * * if admin want to update the company code barcode number
     * * saving the company code
     */
    async updateCompanyCodeService(req) {
        // * destructuring the request body
        const { name, barcodeNumber } = req.body
        // * destructuring the data from headers
        const { id } = req.authUser
        // * destructuring the company code id from the request params
        const { companyCodeId } = req.params
        try {
            // * checking if the company code exists
            const companyCode = await this.companyCodeModel.findOne({
                where: {
                    id: companyCodeId,
                    adminId: id
                }
            });
            if (!companyCode) {
                throw new NotFoundException({ message: 'Company code not found', status: 404 });
            }

            // * if admin want to update the company code name
            if (name) {
                companyCode.name = name
            }

            // * if admin want to update the company code barcode number
            if (barcodeNumber) {
                companyCode.barcodeNumber = barcodeNumber
            }

            // * saving the company code
            await companyCode.save()

            return companyCode;
        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }

    //============================== delete companyCode ==============================//
    /**
     * * destructuring the data from headers
     * * destructuring the company code id from the request params
     * * delete company code
     */
    async deleteCompanyCodeService(req) {
        // * destructuring the data from headers
        const { id } = req.authUser
        // * destructuring the company code id from the request params
        const { companyCodeId } = req.params
        try {
            // * delete company code
            const companyCode = await this.companyCodeModel.destroy({ where: { id: companyCodeId, adminId: id } });
            if (!companyCode) {
                throw new BadRequestException({ message: 'Company code not deleted', status: 400 });
            }

            return companyCode;
        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }

    //============================== get companyCode by id ==============================//
    /**
     * * destructuring the company code id from the request params
     * * get company code by id
     */
    async getCompanyCodeByIdService(req) {
        // * destructuring the data from params
        const { companyCodeId } = req.params
        try {
            // * get company code by id
            const companyCode = await this.companyCodeModel.findOne({ where: { id: companyCodeId } });
            if (!companyCode) {
                throw new NotFoundException({ message: 'Company code not found', status: 404 });
            }

            return companyCode;
        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }

    //============================== get all companyCode ==============================//
    /**
     * * get all company code
     */
    async getAllCompanyCodeService() {
        try {
            // * get all company code
            const companyCode = await this.companyCodeModel.findAll();

            return companyCode;
        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }

    //=================================== insert Data ========================================//
    /**
     * 
     */
    async insertDataServices() {
        try {
            const filePath = path.resolve(__dirname, './companyCodes1.json');
            console.log(filePath)
            const data = fs.readFileSync(filePath, 'utf8');
            console.log("data: ", data)
            const jsonData = JSON.parse(data);
            console.log("jsonData: ", jsonData)
            let i = 0
            for (const item of jsonData) {
                const newEntity = this.companyCodeModel.create({
                    name: item.name,
                    barcodeNumber: item.barcodeNumber,
                    adminId: 1
                });
                // await this.productModel.save(newEntity);
            }
            console.log('Data inserted successfully');
        } catch (error) {
            console.error('Error reading or inserting data:', error);
        }
    }
}
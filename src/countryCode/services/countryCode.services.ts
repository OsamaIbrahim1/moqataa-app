import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CountryCode } from "../../DB/Schemas";
import * as fs from 'fs';
import * as path from "path";

@Injectable()
export class CountryCodeServices {
    constructor(
        @InjectModel(CountryCode)
        private countryCode: typeof CountryCode,
    ) { }

    //================================= create countryCode =================================//
    /**
     * * destructuring data from body
     * * destructuring data from headers
     * * create object countryCode
     * * create countryCode
     */
    async createCountryCodeService(req: any, body: any) {
        // * destructuring data from body
        const { name, firstCode, lastCode } = body;
        // * destructuring data from headers
        const { id } = req.authUser
        try {
            // * create object countryCode
            const countryCodeObj = {
                name, firstCode, lastCode,
                adminId: id
            }

            // * create countryCode
            const countryCode = await this.countryCode.create(countryCodeObj);
            if (!countryCode) {
                throw new BadRequestException({ message: 'country code not created', status: 400 });
            }

            return countryCode;

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

    //================================= update countryCode =================================//
    /**
     * * destructuring data from body
     * * destructuring data from headers
     * * destructuring data from params
     * * check if countryCode is exist
     * * if admin want to update the name
     * * if admin want to update the firstCode
     * * if admin want to update the lastCode
     * * save changes
     * * return countryCode
     */
    async updateCountryCodeService(req: any, body: any) {
        // * destructuring data from body
        const { name, firstCode, lastCode } = body;
        // * destructuring data from headers
        const { id } = req.authUser
        // * destructuring data from params
        const { countryCodeId } = req.params
        try {
            // * check if countryCode is exist
            const countryCode = await this.countryCode.findOne({ where: { id: countryCodeId, adminId: id } });
            if (!countryCode) {
                throw new NotFoundException({ message: 'country code not found', status: 404 });
            }

            // * if admin want to update the name
            if (name) {
                countryCode.name = name
            }

            // * if admin want to update the firstCode
            if (firstCode) {
                countryCode.firstCode = firstCode
            }

            // * if admin want to update the lastCode
            if (lastCode) {
                countryCode.lastCode = lastCode
            }

            // * save changes   
            await countryCode.save();

            return countryCode;
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

    //==================================== delete countryCode =================================//
    /**
     * * destructuring data from headers
     * * destructuring data from params
     * * check if countryCode is exist
     * * delete countryCode
     */
    async deleteCountryCodeService(req: any) {
        // * destructuring data from headers
        const { id } = req.authUser;
        // * destructuring data from params
        const { countryCodeId } = req.params;
        try {
            // * check if countryCode is exist
            const countryCode = await this.countryCode.findOne({ where: { id: countryCodeId, adminId: id } });
            if (!countryCode) {
                throw new NotFoundException({ message: 'country code not found', status: 404 });
            }

            // * delete countryCode
            const deletedCountryCode = await this.countryCode.destroy({ where: { id: countryCodeId } });
            if (!deletedCountryCode) {
                throw new BadRequestException({ message: 'country code not deleted', status: 400 });
            }

            return deletedCountryCode
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

    //==================================== get countryCode by id =================================//
    /**
     * * destructuring data from params
     * * check if countryCode is exist
     * * return countryCode
     */
    async getCountryCodeByIdService(req: any) {
        // * destructuring data from params
        const { countryCodeId } = req.params;
        try {
            // * check if countryCode is exist
            const countryCode = await this.countryCode.findByPk(countryCodeId);
            if (!countryCode) {
                throw new NotFoundException({ message: 'country code not found', status: 404 });
            }

            return countryCode;
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

    //==================================== get all countryCode =================================//
    /**
     * * get all countryCode
     */
    async getAllCountryCodeService() {
        try {
            // * get all countryCode
            const countryCode = await this.countryCode.findAll()
            return countryCode;
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
            const filePath = path.resolve(__dirname, './countyCodes.json');
            console.log(filePath)
            const data = fs.readFileSync(filePath, 'utf8');
            console.log("data: ", data)
            const jsonData = JSON.parse(data);
            console.log("jsonData: ", jsonData)
            let i = 0
            for (const item of jsonData) {
                const newEntity = this.countryCode.create({
                    name: item.name,
                    firstCode: item.firstCode,
                    lastCode: item.lastCode,
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
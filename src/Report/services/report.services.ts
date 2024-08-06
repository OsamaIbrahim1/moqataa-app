import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product, Report, User } from "../../DB/Schemas";
import { addReportBodyDTO, updateReportBodyDTO } from "../../DTO";

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report)
        private reportModel: typeof Report,
        @InjectModel(Product)
        private productModel: typeof Product,
        // @InjectModel(User)
        // private userModel: typeof User,
    ) { }


    //================================= create report =================================//
    /**
     * * destructuring data from body
     * * destructuring data from headers
     * * check if product is exist
     * * check if user is exist
     * * create object report
     * * create report
     */
    async createReportService(/*req: any,*/ body: addReportBodyDTO) {
        // * destructuring data from body
        const { message, productId } = body;
        // * destructuring data from headers
        // const { id } = req.authUser
        try {
            // * check if product is exist
            const product = await this.productModel.findByPk(productId);
            if (!product) {
                throw new NotFoundException({ message: 'Product not found', status: 404 });
            }

            // * check if user is exist
            // const user = await this.userModel.findByPk(id);
            // if (!user) {
            //     throw new NotFoundException({ message: 'User not found', status: 404 });
            // }
            // * create object report
            const reportObj = {
                message,
                productId,
                // userId: id,
                // emailUser: user.email,
                // username: user.name
            }

            // * create report
            const report = await this.reportModel.create(reportObj);
            if (!report) {
                throw new NotFoundException({ message: 'Report not created', status: 404 });
            }

            return report;

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
    //=============================== update report ================================//
    /**
     * * destructuring data from body
     * * destructuring data from headers
     * * destructuring data from params
     * * update report
     */
    async updateReportService(req: any, body: updateReportBodyDTO) {
        // * destructuring data from body
        const { message } = body;
        // * destructuring data from headers
        // const { id } = req.authUser;
        // * destructuring data from params
        const { reportId } = req.params;
        try {
            // * update report
            const report = await this.reportModel.update({ message }, { where: { id: reportId, /*userId: id*/ } });
            if (!report) {
                throw new NotFoundException({ message: 'Report not updated', status: 404 });
            }

            return report
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

    //============================== delete report ================================//
    /**
     * * destructuring data from headers
     * * destructuring data from params
     * * delete report
     */
    async deleteReportService(req: any) {
        // * destructuring data from headers
        const { id } = req.authUser
        // * destructuring data from params
        const { reportId } = req.params;
        try {
            // * delete report
            const report = await this.reportModel.destroy({ where: { id: reportId, /*userId: id*/ } });
            if (!report) {
                throw new NotFoundException({ message: 'Report not deleted', status: 404 });
            }

            return report
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

    //============================= get report by id ===============================//
    /**
     * * destructuring data from headers
     * * destructuring data from params
     * * get report by id
     */
    async getReportByIdService(req: any) {
        // * destructuring data from headers
        // const { id } = req.authUser
        // * destructuring data from params
        const { reportId } = req.params;

        try {
            // * get report by id
            const report = await this.reportModel.findOne({ where: { id: reportId } });
            if (!report) {
                throw new NotFoundException({ message: 'Report not found', status: 404 });
            }

            return report
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

    //============================== get all reports for spcific product ================================//
    /**
     * * destructuring data from params
     * * check if product is exist
     * * get all reports for specific product
     */
    async getAllReportsByProductIdService(req: any) {
        // * destructuring data from params
        const { productId } = req.params;

        try {
            // * check if product is exist
            const product = await this.productModel.findByPk(productId);
            if (!product) {
                throw new NotFoundException({ message: 'Product not found', status: 404 });
            }

            // * get all reports for specific product
            const reports = await this.reportModel.findAll({ where: { productId }, include: [Product/*, User*/] });
            if (reports.length === 0) {
                throw new NotFoundException({ message: 'Reports not found', status: 404 });
            }

            return reports
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

    //================================= get all reports =================================//
    /**
     * * destructuring data from headers
     * * get all reports
     */
    async getAllReportsService(req: any) {
        // * destructuring data from headers
        const { id } = req.authUser
        try {
            // * get all reports
            const reports = await this.reportModel.findAll({ include: [Product /*,User*/] });

            return reports
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
}
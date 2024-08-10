import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Admin, Product } from "../../DB/Schemas";
import { addProductBodyDTO, updateProductBodyDTO } from "../../DTO";
import * as fs from 'fs';
import * as path from "path";

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Admin)
        private adminModel: typeof Admin,
        @InjectModel(Product)
        private productModel: typeof Product,
    ) { }

    //================================= create product =================================//
    /**
     * * destructuring data from body
     * * destructuring data from headers
     * * check if admin is exist
     * * create object product
     * * create product
     */
    async createProductService(body: addProductBodyDTO, req: any) {
        // * destructuring data from body
        const { name, category, country, rate, image, Boycott, boycottReason } = body;
        // * destructuring data from headers
        const { id } = req.authUser

        try {
            // * check if admin is exist
            const admin = await this.adminModel.findByPk(id);
            if (!admin) {
                throw new NotFoundException({ message: 'Admin not found', status: 404 });
            }

            // * create object product
            const productObj = {
                name,
                category,
                country,
                rate,
                image,
                Boycott,
                boycottReason,
                adminId: id
            }

            // * create product
            const product = await this.productModel.create(productObj);
            if (!product) {
                throw new BadRequestException({ message: 'Product not created', status: 400 });
            }

            return product;
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

    //================================= update product =================================//
    /**
     * * destructuring data from params
     * * destructuring data from body
     * * destructuring data from headers
     * * check if admin is exist
     * * check if product is exist
     * * if want to update name
     * * if want to update category
     * * if want to update country
     * * if want to update rate
     * * if want to update image
     * * if want to update Boycott
     * * if want to update resonOfBoycott
     * * save changes
     */
    async updateProductService(req: any, body: updateProductBodyDTO) {
        // * destructuring data from params
        const { productId } = req.params;
        // * destructuring data from body
        const { name, category, country, rate, image, Boycott, boycottReason } = body;
        // * destructuring data from headers
        const { id } = req.authUser

        try {
            // * check if admin is exist
            const admin = await this.adminModel.findByPk(id);
            if (!admin) {
                throw new NotFoundException({ message: 'Admin not found', status: 404 });
            }

            // * check if product is exist
            const product = await this.productModel.findOne({ where: { id: productId, adminId: id } });
            if (!product) {
                throw new NotFoundException({ message: 'Product not found', status: 404 });
            }

            // * if want to update name
            if (name) {
                product.name = name;
            }

            // * if want to update category
            if (category) {
                product.category = category;
            }

            // * if want to update country
            if (country) {
                product.country = country;
            }

            // * if want to update rate
            if (rate) {
                product.rate = rate;
            }

            // * if want to update image
            if (image) {
                product.image = image;
            }

            // * if want to update Boycott
            if (Boycott) {
                product.Boycott = Boycott;
            }

            // * if want to update resonOfBoycott
            if (boycottReason) {
                product.boycottReason = boycottReason;
            }

            // * save changes
            await product.save();

            return product;
        }
        catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].status,
                timestamp: new Date().toISOString()
            }, err['response'].status, {
                cause: err
            });
        }
    }

    //======================================== get product By Id ===================================//
    /**
     * * destructuring data from params
     * * check if product is exist
     */
    async getProductByIdServices(params: any) {
        // * destructuring data from params
        const { productId } = params;

        try {
            // * check if product is exist
            const product = await this.productModel.findByPk(productId, { attributes: { exclude: ['id', 'adminId', 'createdAt', 'updatedAt'] } });
            if (!product) {
                throw new NotFoundException({ message: 'Product not found', status: 404 });
            }

            return product;
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

    //====================================== delete product ===================================//
    /**
     * * destructuring data from params
     * * destructuring data from headers
     * * check if product is exist and delete it 
     */
    async deleteProductServices(params: any, req: any) {
        // * destructuring data from params
        const { productId } = params
        // * destructuring data from headers
        const { id } = req.authUser
        try {
            // * check if product is exist and delete it
            const product = await this.productModel.destroy({ where: { id: productId, adminId: id } });
            if (!product) {
                throw new BadRequestException({ message: 'Product not found, Or you are unautharized', status: 400 });
            }

            return product
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

    //====================================== get all products ===================================//
    /**
     * * get all products
     */
    async getAllProductServices() {
        try {
            // * get all products
            const products = await this.productModel.findAll({ attributes: { exclude: ['id', 'adminId', 'createdAt', 'updatedAt'] } })

            return products;
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
            const filePath = path.resolve(__dirname, './productsData.json');
            console.log(filePath)
            const data = fs.readFileSync(filePath, 'utf8');
            console.log("data: ", data)
            const jsonData = JSON.parse(data);
            console.log("jsonData: ", jsonData)
            let i = 0
            for (const item of jsonData) {
                const newEntity = this.productModel.create({
                    name: item.name,
                    category: item.category,
                    Boycott: item.boycott,
                    boycottReason: item.boycottReason,
                    country: item.country,
                    image: item.image,
                    rate: item.ratign,
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

import { BadGatewayException, BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { JwtService } from "@nestjs/jwt";
import { v2 as cloudinary } from 'cloudinary'
import * as bcrypt from "bcryptjs";
import * as env from '../../config'
import * as dto from "../../DTO";
import { Admin } from "../../DB/Schemas";
import { SendEmailService } from "../../common/services";
import UniqueString from "../../utils/generate-Unique-String";


@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin)
        private adminModel: typeof Admin,
        private jwtService: JwtService,
        private sendEmailService: SendEmailService
    ) {
        cloudinary.config({
            cloud_name: env.CLOUD_NAME,
            api_key: env.API_KEY,
            api_secret: env.API_SECRET,
        });
    }

    //================================= sign up Admin =================================//
    /**
     * * destructuring data from body
     * * check email is already exist or not
     * * hash password
     * * generate folder id
     * * upload image to cloudinary
     * * generate token
     * * generate object for create admin
     * * create admin
     * * create token verification
     * * send email
     */
    async signUpAdminServices(req: any, body: dto.SignUpBodyDTO, file: any) {
        // * destructuring data from body
        const { name, email, password } = body;
        try {
            // * check email is already exist or not
            const isEmailExist = await this.adminModel.findOne({ where: { email } });
            if (isEmailExist) {
                throw new BadRequestException({ message: 'Email is already exist', status: 400 });
            }

            // * hash password
            const hashedPassword = bcrypt.hashSync(password, env.SALT_ROUNDS);
            if (!hashedPassword) {
                throw new BadRequestException({ message: 'Password not hashed', status: 400 });
            }

            if (!file) {
                throw new NotFoundException({ message: 'Image not found', status: 404 });
            }

            // * generate folder id
            const folderId = UniqueString.generateUniqueString(5)
            if (!folderId) {
                throw new BadRequestException({ message: 'Folder id not generated', status: 400 });
            }

            // * upload image to cloudinary
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: `${env.MAIN_FOLDER}/admins/${folderId}`
            });

            // * generate token
            const token = await this.jwtService.signAsync({ email, name }, { secret: env.SECRET_LOGIN_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN })
            if (!token) {
                throw new BadRequestException({ message: 'Token not generated', status: 400 });
            }

            // * generate object for create admin
            const adminObj = {
                name,
                email,
                password: hashedPassword,
                image: { secure_url, public_id },
                folderId,
                token
            }

            // * create admin
            const admin = await this.adminModel.create(adminObj);
            if (!admin) {
                throw new BadRequestException({ message: 'Admin not created', status: 400 });
            }

            // * create token verification
            const verificationToken = await this.jwtService.signAsync({ email }, { secret: env.SECRET_VERIFICATION_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN });
            const confirmationLink = `${req.protocol}://${req.headers.host}/admin/confirm-email/${verificationToken}`

            // * send email
            const isEmailSent = await this.sendEmailService.sendEmail(email,
                'welcome to our app', `<h1>Click on the link to confirm your email</h1>
            <a href="${confirmationLink}">Confirm Email</a>`)
            if (!isEmailSent) {
                throw new InternalServerErrorException({ message: `Email is not sent ${email}.`, status: 400 })
            }

            return admin
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

    //================================= verify Email Admin =================================//
    /**
     * * destructuring data from params
     * * decode token
     * * update isEmailVerified to true
     */
    async verifyEmailAdminServices(params: dto.verifyEmailPararmDTO) {
        // * destructuring data from params
        const { token } = params;
        try {
            // * decode token
            const { email } = await this.jwtService.verifyAsync(token, { secret: env.SECRET_VERIFICATION_TOKEN });
            if (!email) {
                throw new BadRequestException({ message: 'invalid token', status: 400 });
            }

            // * update isEmailVerified to true
            const admin = await this.adminModel.update({ isEmailVerified: true }, { where: { email } });
            if (!admin) {
                throw new BadRequestException({ message: 'Email not verified', status: 400 });
            }

            return admin
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

    //================================= sign in Admin =================================//
    /**
     * * destructuring data from body
     * * check email is already exist or not
     * * compare password
     * * generate token
     * * update token
     * * get admin after update
     */
    async signInAdminServices(body: dto.signInBodyDTO) {
        // * destructuring data from body
        const { email, password } = body;
        try {
            // * check email is already exist or not
            const admin = await this.adminModel.findOne({ where: { email, isEmailVerified: true } });
            if (!admin) {
                throw new BadRequestException({ message: 'please verify your email', status: 400 });
            }

            // * compare password
            const isPasswordMatch = bcrypt.compareSync(password, admin.password);
            if (!isPasswordMatch) {
                throw new BadRequestException({ message: 'Password not match', status: 400 });
            }

            // * generate token
            const token = await this.jwtService.signAsync({ email, id: admin.id, role: admin.role }, { secret: env.SECRET_LOGIN_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN })
            if (!token) {
                throw new BadRequestException({ message: 'Error generating token', status: 400 })
            }

            // * update token 
            const adminUpdate = await this.adminModel.update({ token }, { where: { email } })
            if (!adminUpdate) {
                throw new BadRequestException({ message: 'Error updating token', status: 400 })
            }

            // * get admin after update
            const afterUpdate = await this.adminModel.findByPk(admin.id)
            if (!afterUpdate) {
                throw new NotFoundException({ message: 'admin not found', status: 404 })
            }

            return afterUpdate
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

    //=============================== update Account Admin =================================//
    /**
     * * destructuring data from headers
     * * destructure data from body
     * * check if email already exists
     * * if admin wants to update name
     * * if admin wants to update email
     * * if admin wants to update image
     * * save admin
     */
    async updateAccountAdminServices(body: dto.updateAccountBodyDTO, req: any, file: any) {
        // * destructuring data from headers
        const { id } = req.authUser
        // * destructure data from body
        const { name, email, oldPublicId } = body

        try {
            // * check if email already exists
            const admin = await this.adminModel.findByPk(id);
            if (!admin) {
                throw new NotFoundException({ message: 'admin not found', status: 404 })
            }

            // * if admin wants to update name
            if (name) {
                admin.name = name
            }

            // * if admin wants to update email
            if (email) {
                if (admin.email === email) {
                    throw new BadRequestException({ message: 'this email the same as the old email', status: 400 })
                }

                const checkEmail = await this.adminModel.findOne({ where: { email } });
                if (checkEmail) {
                    throw new BadGatewayException({ message: 'email already exists, please enter another email', status: 400 })
                }
                admin.email = email
            }

            // * if admin wants to update image
            if (oldPublicId) {
                if (!req.file.path) {
                    throw new BadRequestException({ message: 'please upload image', status: 400 })
                }
                const newPublicId = oldPublicId.split(`${admin.folderId}/`)[1]
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `${env.MAIN_FOLDER}/admins/${admin.folderId}`,
                    public_id: newPublicId
                })
                admin.image = { secure_url, public_id }
            }

            // * save admin
            await admin.save()

            return admin
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
    //=============================== get data Admin =================================//
    /**
     * * destructuring data from headers
     * * check if email already exists
     */
    async getDataAdminServices(req: any) {
        // * destructuring data from headers
        const { id } = req.authUser

        try {
            // * check if email already exists
            const admin = await this.adminModel.findByPk(id, { attributes: ['name', 'email', 'image', 'role'] })
            if (!admin) {
                throw new NotFoundException({ message: 'admin not found', status: 404 })
            }

            return admin
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
    //=================================== delete Account Admin =================================//
    /**
     * * destructuring data from headers
     * * check if email already exists
     */
    async deleteAccountAdminServices(req: any) {
        try {
            // * destructuring data from headers
            const { id } = req.authUser

            // * check if email already exists
            const admin = await this.adminModel.destroy({ where: { id } })
            if (!admin) {
                throw new NotFoundException({ message: 'admin not deleted', status: 404 })
            }

            return admin
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
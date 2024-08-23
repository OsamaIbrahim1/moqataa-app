import { InjectModel } from "@nestjs/sequelize";
import { BadGatewayException, BadRequestException, HttpException, HttpStatus, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../../DB/Schemas";
import * as env from '../../config'
import UniqueString from '../../utils/generate-Unique-String'
import { signInBodyDTO, SignUpBodyDTO, updateAccountBodyDTO, verifyEmailPararmDTO } from "../../DTO";
import { SendEmailService } from "../../common/services";
import { OAuth2Client } from 'google-auth-library';

export class UserService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
        private jwtService: JwtService,
        private sendEmailService: SendEmailService
    ) {
        cloudinary.config({
            cloud_name: env.CLOUD_NAME,
            api_key: env.API_KEY,
            api_secret: env.API_SECRET,
        });
    }

    //================================== sign up ==================================//
    /**
     * * destructuring data from body
     * * check if email already exists
     * * hash password
     * * upload image to cloudinary
     * * generate token
     * * generate object user
     * * create user
     * * create token verification
     * * send email
     */
    async signUpServices(req: any, body: SignUpBodyDTO, file: any) {
        // * destructure data from body
        const { email, password, name } = body;

        try {
            // * check if email already exists
            const checkEmail = await this.userModel.findOne({ where: { email } });
            if (checkEmail) {
                throw new BadRequestException({
                    message: "Email already exists", status: 400,
                });
            }

            // * hash password
            const hashedPassword = await bcrypt.hash(password, env.SALT_ROUNDS);
            if (!hashedPassword) {
                throw new BadRequestException({ message: "Error hashing password", status: 400 });
            }

            if (!file) {
                throw new BadRequestException({ message: "please upload image", status: 400 });
            }

            // * upload image to cloudinary
            const folderId = UniqueString.generateUniqueString(5)
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: `${env.MAIN_FOLDER}/users/${folderId}`,
            });

            // * generate token 
            const token = await this.jwtService.signAsync({ email, name }, { secret: env.SECRET_LOGIN_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN });
            if (!token) {
                throw new BadRequestException({ message: "Error generating token", status: 400 });
            }

            // * generate object user
            const userObj = {
                email,
                password: hashedPassword,
                name,
                image: { secure_url, public_id },
                folderId,
                token
            }

            // * create user
            const user = await this.userModel.create(userObj);
            if (!user) {
                throw new BadRequestException({ message: "Error creating user", status: 400 });
            }

            // * create token verification
            const verificationToken = await this.jwtService.signAsync({ email }, { secret: env.SECRET_VERIFICATION_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN });
            const confirmationLink = `${req.protocol}://${req.headers.host}/user/confirm-email/${verificationToken}`

            // * send email
            const isEmailSent = await this.sendEmailService.sendEmail(email,
                'welcome to our app', `<h1>Click on the link to confirm your email</h1>
            <a href="${confirmationLink}">Confirm Email</a>`)
            if (!isEmailSent) {
                throw new InternalServerErrorException({ message: `Email is not sent ${email}.`, status: 400 })
            }

            return user
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

    //================================== verify email ==================================//
    /**
     * * destructuring data from params
     * *decode token
     * * update isEmailVerified to true
     */
    async verifyEmailServices(params: verifyEmailPararmDTO) {
        // * destructure data from params
        const { token } = params
        try {
            // * decode token
            const { email } = await this.jwtService.verifyAsync(token, { secret: env.SECRET_VERIFICATION_TOKEN })
            if (!email) {
                throw new BadRequestException({ message: 'Error verifying email', status: 400 })
            }

            // * update isEmailVerified to true
            const user = await this.userModel.update({ isEmailVerified: true }, { where: { email } })
            if (!user) {
                throw new BadRequestException({ message: 'email not verified', status: 404 })
            }

            return user
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

    //=============================== sign in ==================================//
    /**
     * * destructuring data from body
     * * check if email exists
     * * check if password is correct
     * * generate token
     * * get user after update
     */
    async signInServices(body: signInBodyDTO) {
        // * destructure data from body
        const { email, password } = body
        try {
            // * check if email exists
            const user = await this.userModel.findOne({ where: { email, isEmailVerified: true } })
            if (!user) {
                throw new NotFoundException({ message: 'please verify your email', status: 404 })
            }

            // * check if password is correct
            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (!isPasswordCorrect) {
                throw new BadRequestException({ message: 'Password is incorrect', status: 400 })
            }

            // * generate token
            const token = await this.jwtService.signAsync({ email, id: user.id, role: user.role }, { secret: env.SECRET_LOGIN_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN })
            if (!token) {
                throw new BadRequestException({ message: 'Error generating token', status: 400 })
            }

            // * update token 
            const userUpdate = await this.userModel.update({ token }, { where: { email } })
            if (!userUpdate) {
                throw new BadRequestException({ message: 'Error updating token', status: 400 })
            }

            // * get user after update
            const afterUpdate = await this.userModel.findByPk(user.id)
            if (!afterUpdate) {
                throw new NotFoundException({ message: 'user not found', status: 404 })
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

    //================================ update account ==================================//
    /**
     * * destructuring data from headers
     * * destructure data from body
     * * check if email already exists
     * * if user wants to update name
     * * if user wants to update email
     * * if user wants to update image
     * * save user
     */
    async updateAccountServices(body: updateAccountBodyDTO, req: any, file: any) {
        // * destructuring data from headers
        const { id } = req.authUser
        // * destructure data from body
        const { name, email, oldPublicId } = body

        try {
            // * check if email already exists
            const user = await this.userModel.findByPk(id);
            if (!user) {
                throw new NotFoundException({ message: 'user not found', status: 404 })
            }

            // * if user wants to update name
            if (name) {
                user.name = name
            }

            // * if user wants to update email
            if (email) {
                if (user.email === email) {
                    throw new BadRequestException({ message: 'this email the same as the old email', status: 400 })
                }

                const checkEmail = await this.userModel.findOne({ where: { email } });
                if (checkEmail) {
                    throw new BadGatewayException({ message: 'email already exists, please enter another email', status: 400 })
                }
                user.email = email
            }

            // * if user wants to update image
            if (oldPublicId) {
                if (!req.file.path) {
                    throw new BadRequestException({ message: 'please upload image', status: 400 })
                }
                const newPublicId = oldPublicId.split(`${user.folderId}/`)[1]
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `${env.MAIN_FOLDER}/users/${user.folderId}`,
                    public_id: newPublicId
                })
                user.image = { secure_url, public_id }
            }

            // * save user
            await user.save()

            return user
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

    //================================ get user ==================================//
    /**
     * * destructuring data from headers
     * * get user
     */
    async getUserServices(req: any) {
        // * destructuring data from headers
        const { id } = req.authUser

        try {
            // * get user
            const user = await this.userModel.findByPk(id, { attributes: ['name', 'email', 'image', 'role'] })
            if (!user) {
                throw new NotFoundException({ message: 'user not found', status: 404 })
            }

            return user
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

    //================================ delete account ==================================//
    /**
     * * destructuring data from headers
     * * delete user
     */
    async deleteAccountServices(req: any) {
        // * destructuring data from headers
        const { id } = req.authUser
        try {
            // * delete user
            const user = await this.userModel.destroy({ where: { id } })
            if (!user) {
                throw new NotFoundException({ message: 'user not found', status: 404 })
            }

            return user
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

//     //================================= login With Gemail==================================//
//     async loginWithGemailServices(body: any) {
//         // * destructure data from body
//         const { idToken } = body
//         try {

//             const client = new OAuth2Client();
//             async function verify() {
//                 const ticket = await client.verifyIdToken({
//                     idToken,
//                     audience: env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
//                     // Or, if multiple clients access the backend:
//                     //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//                 });
//                 const payload = ticket.getPayload();
//                 return payload
//             }
//             const result = await verify().catch(console.error);

//             if(!result.email_verified){
//                 throw new BadRequestException({ message: 'email not verified', status: 400 })
//             }
//             console.log("result: ", result)
//             // * get user by email
//                 const user = await this.userModel.findOne({ where: { email: result.email, provider: 'GOOGLE' } });
//                 if (!user) {
//                     throw new NotFoundException({ message: 'user not found', status: 404 })
//                 }


//         } catch (err) {
//             throw new HttpException({
//                 error: err['response'].message,
//                 status: err['response'].status,
//                 timestamp: new Date().toISOString()
//             }, err['response'].status, {
//                 cause: err
//             });
//         }
//     }
}
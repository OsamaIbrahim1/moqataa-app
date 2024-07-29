import { BadRequestException, CanActivate, ExecutionContext, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Admin, User } from '../DB/Schemas';
import * as env from '../config';
import { Role } from 'src/utils';

// @Injectable()
// export class AuthGuard implements CanActivate {
//     constructor(
//         @InjectModel(User)
//         private userModel: typeof User,
//         private jwtService: JwtService
//     ) { }

//     async canActivate(
//         context: ExecutionContext,
//     ): Promise<object> {

//         const req = context.switchToHttp().getRequest();
//         const { accesstoken } = req.headers;

//         if (!accesstoken) {
//             throw new BadRequestException(`please login first`)
//         }
//         if (!accesstoken.startsWith(env.PREFIX_LOGIN_TOKEN)) {
//             throw new BadRequestException(`invalid token prefix`);
//         }

//         const token = accesstoken.split(env.PREFIX_LOGIN_TOKEN)[1];

//         const decodedData = this.jwtService.verify(token, { secret: env.SECRET_LOGIN_TOKEN });
//         if (!decodedData.id) {
//             throw new BadRequestException(`invalid token payload`);
//         }

//         // check user
//         const findUser = await this.userModel.findByPk(decodedData.id, { attributes: ['id', 'email', 'role'] });
//         if (!findUser) { throw new BadRequestException(`please SignUp first`); }

//         // * TokenExpiredError: jwt expired

//         req.authUser = findUser

//         return req

//     }
// }

// @Injectable()
// export class AuthGuardAdmin implements CanActivate {
//     constructor(
//         @InjectModel(Admin)
//         private adminModel: typeof Admin,
//         private jwtService: JwtService
//     ) { }

//     async canActivate(
//         context: ExecutionContext,
//     ): Promise<object> {

//         const req = context.switchToHttp().getRequest();
//         const { accesstoken } = req.headers;
//         try {
//             if (!accesstoken) {
//                 throw new BadRequestException({ message: `please login first`, status: 400 })
//             }
//             if (!accesstoken.startsWith(env.PREFIX_LOGIN_TOKEN)) {
//                 throw new BadRequestException({ message: `invalid token prefix`, status: 400 });
//             }

//             const token = accesstoken.split(env.PREFIX_LOGIN_TOKEN)[1];

//             const decodedData = this.jwtService.verify(token, { secret: env.SECRET_LOGIN_TOKEN });
//             if (!decodedData.id) {
//                 throw new BadRequestException({ message: `invalid token payload`, status: 400 });
//             }

//             // check user
//             const findAdmin = await this.adminModel.findByPk(decodedData.id, { attributes: ['id', 'email', 'role'] });
//             if (!findAdmin) { throw new NotFoundException({ message: `please SignUp first`, status: 404 }); }

//             // * TokenExpiredError: jwt expired

//             req.authUser = findAdmin

//             return req

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
// }

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectModel(Admin)
        private adminModel: typeof Admin,
        @InjectModel(User)
        private userModel: typeof User,
        private jwtService: JwtService
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<object> {

        const req = context.switchToHttp().getRequest();
        const { accesstoken } = req.headers;
        try {
            if (!accesstoken) {
                throw new BadRequestException({ message: `please login first`, status: 400 })
            }
            if (!accesstoken.startsWith(env.PREFIX_LOGIN_TOKEN)) {
                throw new BadRequestException({ message: `invalid token prefix`, status: 400 });
            }

            const token = accesstoken.split(env.PREFIX_LOGIN_TOKEN)[1];

            const decodedData = this.jwtService.verify(token, { secret: env.SECRET_LOGIN_TOKEN });
            if (!decodedData.id) {
                throw new BadRequestException({ message: `invalid token payload`, status: 400 });
            }

            if (decodedData.role === Role.ADMIN) {
                const findAdmin = await this.adminModel.findByPk(decodedData.id, { attributes: ['id', 'email', 'role'] });
                if (!findAdmin) { throw new NotFoundException({ message: `please SignUp first`, status: 404 }); }

                req.authUser = findAdmin

                return req
            } else if (decodedData.role === Role.USER) {
                const findAdmin = await this.userModel.findByPk(decodedData.id, { attributes: ['id', 'email', 'role'] });
                if (!findAdmin) { throw new NotFoundException({ message: `please SignUp first`, status: 404 }); }

                req.authUser = findAdmin

                return req
            }

            // * TokenExpiredError: jwt expired


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

import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private configService : ConfigService,
    ){
        super({
            secretOrKey : configService.get('JWT_SECRET'),
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload : JwtPayload):Promise<UserEntity>{
        const {username} = payload;
        const user = await this.userRepository.findOne({ where:{ username: username }})

        if(!user){
            throw new UnauthorizedException();
        }

        return user; 
    }
}
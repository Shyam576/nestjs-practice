import { authCredentialsDto } from './dto/auth-credentials.dto';
import { Body, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
    ){}
    

    async createUser(
        createUserDto: CreateUserDto
    ): Promise<UserEntity>{

       const {username, password } = createUserDto; 

        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(password, salt);

        const createDto ={
            username: username,
            password: hashedPassword,
        }
        const result = this.userRepository.create(createDto);
       try{
         await this.userRepository.save(result);
        }catch(err){
            if (err.code === 23505){
                throw new ConflictException('Username already exists')
            }else{
                throw new InternalServerErrorException(err.code);
            }
        }
       return result;
    }

    async signinUser(
        authCredentialsDto: authCredentialsDto
    ):Promise<{ accessToken : string}>{
        const {username, password} = authCredentialsDto;

        const user = await this.userRepository.findOne({where: {username: username}})

        if(user && (await bcrypt.compare(password, user.password))){
            const payLoad : JwtPayload = {username};
            const accessToken =  this.jwtService.sign(payLoad);

            return {accessToken};
        }else{
            throw new UnauthorizedException('Please check your username and password');
        }


    }
}

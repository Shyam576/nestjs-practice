import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { authCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
@ApiTags('auth-user')
export class AuthController {

    constructor(
        private authService : AuthService,
    ){}

    @Post('signup')
    @ApiOperation({summary: 'Create a new user'})
    @ApiResponse({status: 201, description: 'User created successfully' })
    async createUser(
        @Body() createUserDto: CreateUserDto
    ): Promise<UserEntity>{
        return await this.authService.createUser(createUserDto)
    }
    
    @Post('signin')
    @ApiOperation({summary: ' Sign in to your account'})
    @ApiResponse({status: 200, description: 'Success'})
    async siginUser(
        @Body() authCredentialsDto:authCredentialsDto
    ): Promise<UserEntity>{
        return await this.authService.signinUser(authCredentialsDto)
    }
}


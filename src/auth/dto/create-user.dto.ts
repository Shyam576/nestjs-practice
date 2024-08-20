import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{
    @ApiProperty({ type: String })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @ApiProperty({ type: String })
    @IsString()
    @MinLength(8)
    @MaxLength(34)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
        { message: 'The passowrd is too week'})
    password: string;
}
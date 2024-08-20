import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class authCredentialsDto{
    @ApiProperty({ type: "string" })
    @IsString()
    username: string;

    @ApiProperty({ type: "string" })
    @IsString()
    password:string    
}
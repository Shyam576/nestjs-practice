import { UnprocessableEntityException } from "@nestjs/common";

export class InvalidStatusException extends UnprocessableEntityException {
    constructor(error?: string){
        super('Task not found', error);
    }
}
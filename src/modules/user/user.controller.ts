/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { VerifySignatureDto } from './dto/verify-signature.dto';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ){}
    
    @Get('nonce/:wallet-address')
    async getNonce(@Param('wallet-address') walletAddress: string): Promise<{nonce : string}> {
        const nonce = await this.userService.getNonce();
        return { nonce };
    }

    @Post('verify-signature')
    async verifySignature(@Body() body: VerifySignatureDto): Promise<{ accessToken: string }> {
        const accessToken = await this.userService.verifySignature(body);
        return { accessToken };
    }
}

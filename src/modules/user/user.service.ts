/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as ethers from 'ethers';
import { NoncesService } from './nonce.service';
import { VerifySignatureDto } from './dto/verify-signature.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly noncesService: NoncesService,
    private readonly jwtService: JwtService,
  ) {}
    
  getNonce(): string {
    return  this.noncesService.createNonce()
  }

  async verifySignature(data: VerifySignatureDto): Promise<string> {
    const { signedMessage, message, address } = data;

    // 1. Retrieve and validate the nonce from the database/cache
    // const storedNonce = await this.noncesService.findAndInvalidateNonce(address, message);
    // if (!storedNonce) {
    //   throw new UnauthorizedException('Invalid or expired nonce');
    // }

    // 2. Verify the signature cryptographically
    const recoveredAddress = ethers.verifyMessage(message, signedMessage);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }

    // 3. Generate and return the JWT token
    const payload = { sub: address };
    return await this.jwtService.signAsync(payload)
  }
}

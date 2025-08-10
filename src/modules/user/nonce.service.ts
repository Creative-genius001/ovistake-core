/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import { ErrorMessages } from 'src/types/errors';

@Injectable()
export class NoncesService {

  constructor(
    // @InjectRepository(Nonce)
    // private readonly noncesRepository: Repository<Nonce>,
    
  ) {}

  createNonce(): string {
    try {
      const nonceString = crypto.randomBytes(32).toString('hex');
      
      // 2. Create a new nonce entity
  

      // 3. Save the new nonce to the database
        return nonceString;
    } catch (err) {
      throw new InternalServerErrorException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  // async findAndInvalidateNonce(walletAddress: string, nonce: string): Promise<boolean> {
  //   try {
  //     // Find the nonce in the database by address and nonce string and then delete if true
      

  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to validate and invalidate nonce.');
  //   }
  // }
}
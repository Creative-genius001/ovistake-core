/* eslint-disable prettier/prettier */
export class VerifySignatureDto {
    readonly signedMessage : string;
    readonly message : string;
    readonly address : string;
}
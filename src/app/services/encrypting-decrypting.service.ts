import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptingDecryptingService {
  private secretKey = "Innoveture!1234";

  constructor() { }


  //To encrypt input data
  public encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }
  
  //To decrypt input data
  public decrypt(dataToDecrypt: string) {
    return CryptoJS.AES.decrypt(dataToDecrypt, this.secretKey).toString(CryptoJS.enc.Utf8);
  }
}

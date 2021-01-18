export class PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: Date;
}

export class ContractPost {
  user?: string;
  stake?: number;
  post?: string;
  time?: Date;
}

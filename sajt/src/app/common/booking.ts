export class Booking {
  id: string;
  productId: number;
  pinCode: number;
  createDate: Date;
  bookingDate: Date;
  returnDate: Date;
  userId: number;
  actual: boolean;
  clientReturnDate: Date;
  expectedStart: Date;
  expectedEnd: Date;
  cost: number;
}

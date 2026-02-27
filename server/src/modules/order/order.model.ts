import { getModelForClass, prop } from "@typegoose/typegoose";
import { Car, Reservation } from "../car/car.model.js";



export class PhysicalPerson {
  @prop({ required: true, type: () => String })
  name!: string;

  @prop({ required: true, type: () => String })
  email!: string;

  @prop({ required: true, type: () => String })
  address!: string;

  @prop({ required: true, type: () => String })
  phone!: string
}

export class JuridicalPerson {
  @prop({ required: true, type: () => String })
  companyName!: string;

  @prop({ required: true, type: () => String })
  registrationNumber!: string; // VAT / CUI

  @prop({ required: true, type: () => String })
  email!: string;

  @prop({ required: true, type: () => String })
  address!: string;

  @prop({ required: true, type: () => String })
  phone!: string
}



export class Order {
  @prop({ required: true, enum: ["physical", "juridical"], type: () => String })
  customerType!: "physical" | "juridical";

  @prop({ required: true, type: () => Object })
  person?: PhysicalPerson | JuridicalPerson;


  @prop({ required: true, type: () => Car })
  car!: Car

  @prop({ required: true, type: () => Reservation })
  timeInterval!: Reservation

  @prop({ required: true, type: () => String })
  currency!: string; // "eur", "ron", etc

  @prop({ required: true, type: () => String })
  plata!: "online" | "fizic"


  @prop({ type: () => String })
  orderId?: string

  @prop({ default: "pending", type: () => String })
  paymentStatus?: "pending" | "paid" | "failed";

  @prop({ required: true, type: () => String })
  location!: string
}


export const orderModel = getModelForClass(Order, { schemaOptions: { timestamps: true } })
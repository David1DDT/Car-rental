import { getModelForClass, prop } from "@typegoose/typegoose";

export class Car {
    @prop({required: true})
    public name!: string

    @prop({required: true})
    public category!: string[]

    @prop()
    public reservations?: {startDate: Date, endDate: Date}[]

    

}
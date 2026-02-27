import { getModelForClass, prop } from "@typegoose/typegoose";

export class Reservation {
    @prop({required: true, type: () => Date})
    public startDate!: Date

    @prop({required: true, type: () => Date})
    public endDate!: Date
}

export class Car {
    @prop({required: true, type: () => String})
    public name!: string

    @prop({required: true, type: () => String})
    public transmission!: "manuala" | "automata"

    @prop({required: true, type: () => String})
    public fuel!: string

    @prop({required: true, type: () => Number})
    public price!: number

    @prop({required: true, type: () => String})
    public class!: string

    @prop({required: true, type: () => String})
    public category!: string

    @prop({required: true, type: () => String})
    public location!: string

    @prop({type: () => [Reservation]})
    public reservations?: Reservation[]

    @prop({required: true, type: () => [String]})
    public images!: string[]

}

export const CarModel = getModelForClass(Car)
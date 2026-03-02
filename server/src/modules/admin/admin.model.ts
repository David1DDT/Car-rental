import { prop, getModelForClass, pre } from "@typegoose/typegoose";
import argon2 from "argon2";


@pre<Admin>("save", async function () {
    if (!this.isModified("password")) return
    this.password = await argon2.hash(this.password)
})
export class Admin {
    @prop({ required: true, unique: true, type: () => String })
    username!: string

    @prop({ required: true, minlength: 8, type: () => String })
    password!: string

    public async comparePassword(password: string): Promise<boolean> {
        return argon2.verify(this.password, password)
    }
}

export const adminModel = getModelForClass(Admin, { schemaOptions: { timestamps: true } })
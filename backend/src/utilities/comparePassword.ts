import bcrypt from "bcrypt"
export const comparedPassword=async(plainnPassword:string,hashedPassword:string):Promise<boolean>=>{
    return await bcrypt.compare(plainnPassword,hashedPassword)
}
import {randomBytes} from 'crypto'

export function generateInviteCode(length=8):string {
    return randomBytes(length).toString("hex");
}
export function generateTaskCode():string {
    return randomBytes(length).toString("hex");
}
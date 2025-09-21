import { IUser } from '../type';

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}
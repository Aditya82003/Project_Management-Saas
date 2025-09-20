export type IUser = {
    id: string;
    name: string;
    email: string;
    password?: string | null;
    profilePicture?: string | null;
    isActive: boolean;
    lastLogin?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    currentWorkspaceId?: string | null;

    comparePassword?(value: string): Promise<boolean>;
    omitPassword?(): Omit<IUser, "password">;
}
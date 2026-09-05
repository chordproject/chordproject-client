export type User = {
    uid: string;
    name: string;
    email: string;
    emailVerified: boolean;
    avatar?: string;
    declaredGroupName?: string;
    groupId?: string | null;
    groupPromptDismissed?: boolean;
}

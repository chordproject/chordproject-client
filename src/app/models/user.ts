export class User {
    id: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    provider: string;
    picture: string;
    likedSongbookId: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        this.id = obj.uid;
        this.displayName = obj.displayName;
        this.email = obj.email;
        this.emailVerified = obj.emailVerified;
        this.provider = obj.providerData[0].providerId;
        this.picture = obj.photoURL;
    }
}

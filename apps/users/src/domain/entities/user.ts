export class User{
    private _id: number;
    private _username:string
    private _password:string


    get id() {
        return this._id;
    }

    get username(){
        return this._username
    }
}
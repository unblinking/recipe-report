interface IUserModel {
  readonly id: number | undefined
  readonly email: string
}

class UserModel implements IUserModel {
  private _id?: number | undefined
  private _username: string
  private _password: string
  private _email: string
  private _date_created: Date
  private _date_last_login: Date
  private _date_deleted: Date

  constructor(
    id: number | undefined,
    username: string,
    password: string,
    email: string,
    date_created: Date,
    date_last_login: Date,
    date_deleted: Date
  ) {
    this._id = id
    this._username = username
    this._password = password
    this._email = email
    this._date_created = date_created
    this._date_last_login = date_last_login
    this._date_deleted = date_deleted
  }

  public get id(): number | undefined {
    return this._id
  }
  public set id(id: number | undefined) {
    this._id = id
  }

  public get username(): string {
    return this._username
  }
  public set username(username: string) {
    this._username = username
  }

  public get password(): string {
    return this._password
  }
  public set password(password: string) {
    this._password = password
  }

  public get email(): string {
    return this._email
  }
  public set email(email: string) {
    this._email = email
  }

  public get date_created(): Date {
    return this._date_created
  }
  public set date_created(date_created: Date) {
    this._date_created = date_created
  }

  public get date_last_login(): Date {
    return this._date_last_login
  }
  public set date_last_login(date_last_login: Date) {
    this._date_last_login = date_last_login
  }

  public get date_deleted(): Date {
    return this._date_deleted
  }
  public set date_deleted(date_deleted: Date) {
    this._date_deleted = date_deleted
  }
}

export default UserModel

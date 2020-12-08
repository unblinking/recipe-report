/**
 * User model.
 *
 * @see {@link https://coryrylan.com/blog/rich-domain-models-with-typescript Rich Domain Models with TypeScript}
 */

/**
 * User model interface.
 *
 * @interface IUserModel
 */
export interface IUserModel {
  id?: string
  username?: string
  password?: string
  email?: string
  date_created?: Date
  date_last_login?: Date
  date_deleted?: Date
}

/**
 * User model concrete class.
 *
 * @class UserModel
 * @implements {IUserModel}
 */
export class UserModel implements IUserModel {
  private state: IUserModel = {}

  constructor(
    id: string,
    username: string,
    password: string,
    email: string,
    date_created: Date,
    date_last_login: Date,
    date_deleted: Date
  ) {
    this.set_id(id)
    this.set_username(username)
    this.set_password(password)
    this.set_email(email)
    this.set_date_created(date_created)
    this.set_date_last_login(date_last_login)
    this.set_date_deleted(date_deleted)
  }

  public get id(): string | undefined {
    return this.state.id
  }
  public set_id(id: string): void {
    this.state.id = id
  }

  public get username(): string | undefined {
    return this.state.username
  }
  public set_username(username: string): void {
    this.state.username = username
  }

  public get password(): string | undefined {
    return this.state.password
  }
  public set_password(password: string): void {
    this.state.password = password
  }

  public get email(): string | undefined {
    return this.state.email
  }
  public set_email(email: string): void {
    this.state.email = email
  }

  public get date_created(): Date | undefined {
    return this.state.date_created
  }
  public set_date_created(date_created: Date): void {
    this.state.date_created = date_created
  }

  public get date_last_login(): Date | undefined {
    return this.state.date_last_login
  }
  public set_date_last_login(date_last_login: Date): void {
    this.state.date_last_login = date_last_login
  }

  public get date_deleted(): Date | undefined {
    return this.state.date_deleted
  }
  public set_date_deleted(date_deleted: Date): void {
    this.state.date_deleted = date_deleted
  }
}

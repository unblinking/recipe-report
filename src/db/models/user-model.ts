/**
 * User model.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * User model interface.
 *
 * @export
 * @interface IUserModel
 */
export interface IUserModel {
  id?: string
  username?: string
  password?: string
  email_address?: string
  date_created?: Date | undefined
  date_activated?: Date | undefined
  date_last_login?: Date | undefined
  date_deleted?: Date | undefined
}

/**
 * User model concrete class.
 *
 * @export
 * @class UserModel
 * @implements {IUserModel}
 */
export class UserModel implements IUserModel {
  private state: IUserModel = {}

  constructor(props: IUserModel) {
    this.setId(props.id)
    this.setUsername(props.username)
    this.setPassword(props.password)
    this.setEmailAddress(props.email_address)
    this.setDateCreated(props.date_created)
    this.setDateActivated(props.date_activated)
    this.setDateLastLogin(props.date_last_login)
    this.setDateDeleted(props.date_deleted)
  }

  /**
   * UUID/GUID primary key of the user record.
   * id UUID PRIMARY KEY DEFAULT gen_random_uuid()
   */
  public get id(): string | undefined {
    return this.state.id
  }
  public setId(id: string | undefined): void {
    this.state.id = id
  }

  /**
   * Unique user display name.
   * username VARCHAR (50) UNIQUE NOT NULL
   */
  public get username(): string | undefined {
    return this.state.username
  }
  public setUsername(username: string | undefined): void {
    this.state.username = username
  }

  /**
   * Encrypted user password using the pgcrypto crypt function, and gen_salt
   * with the blowfish algorithm and iteration count of 8.
   * password TEXT NOT NULL
   */
  public get password(): string | undefined {
    return this.state.password
  }
  public setPassword(password: string | undefined): void {
    this.state.password = password
  }

  /**
   * Unique email address for the user.
   * email_address TEXT UNIQUE NOT NULL
   */
  public get email_address(): string | undefined {
    return this.state.email_address
  }
  public setEmailAddress(email_address: string | undefined): void {
    this.emailAddressSanityCheck(email_address)
    this.state.email_address = email_address
  }

  /**
   * The datetime when the user record was created in the database.
   * date_created TIMESTAMPTZ NOT NULL
   */
  public get date_created(): Date | undefined {
    return this.state.date_created
  }
  public setDateCreated(date_created: Date | undefined): void {
    this.state.date_created = date_created
  }

  /**
   * The datetime when the user record was activated to allow login.
   * date_activated TIMESTAMPTZ NOT NULL
   */
  public get date_activated(): Date | undefined {
    return this.state.date_activated
  }
  public setDateActivated(date_activated: Date | undefined): void {
    this.state.date_activated = date_activated
  }

  /**
   * The datetime when the user last logged into the system successfully.
   * date_last_login TIMESTAMPTZ
   */
  public get date_last_login(): Date | undefined {
    return this.state.date_last_login
  }
  public setDateLastLogin(date_last_login: Date | undefined): void {
    this.state.date_last_login = date_last_login
  }

  /**
   * Soft delete datetime when the user was marked as deleted.
   * date_deleted TIMESTAMPTZ
   */
  public get date_deleted(): Date | undefined {
    return this.state.date_deleted
  }
  public setDateDeleted(date_deleted: Date | undefined): void {
    this.state.date_deleted = date_deleted
  }

  /**
   * Email address sanity check. Make sure it looks reasonable.
   *
   * @private
   * @param {(string | undefined)} email_address
   * @memberof UserModel
   */
  private emailAddressSanityCheck(email_address: string | undefined): void {
    // A regular expression to do a quick sanity-check.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email_address) throw new Error(`User email address is not defined.`)
    if (!regex.test(email_address))
      throw new Error(`Seemingly invalid user email address.`)
  }
}

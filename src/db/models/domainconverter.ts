/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Domain converter.
 *
 * Create domain model instances from existing API data as well as convert them
 * back to plain data objects.
 *
 * @see {@link https://coryrylan.com/blog/rich-domain-models-with-typescript Rich Domain Models with TypeScript}
 */

export interface Type<T> extends Function {
  new (...args: any[]): T
}

export class DomainConverter {
  static fromDto<T>(domain: Type<T>, dto: any): T {
    const instance = Object.create(domain.prototype)
    instance.state = dto
    return instance as T
  }

  static toDto<T>(domain: any): T {
    return domain.state as T
  }
}

/**
 * Example use
 *

const userDto: IUserModel = {
  username: `Joshua15`,
  password: encryptedPassword,
  email: `joshua15@unblinking.io`,
}

const userHydrated = DomainConverter.fromDto<UserModel>(
  UserModel,
  userDto
)
console.log(userHydrated)

const userDehydrated = DomainConverter.toDto<UserModel>(userHydrated)
console.log(userDehydrated)

*/

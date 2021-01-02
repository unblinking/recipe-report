/**
 * Response models.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

interface IServiceResponse<T> {
  success?: boolean
  error?: Error
  item?: T
}

abstract class ServiceResponse<T> implements IServiceResponse<T> {
  private state: IServiceResponse<T> = {}

  constructor(success: boolean = false, error?: Error, item?: T) {
    this.setSuccess(success)
    this.setError(error)
    this.setItem(item)
  }

  public get success(): boolean | undefined {
    return this.state.success
  }
  public setSuccess(success: boolean | undefined): void {
    this.state.success = success
  }

  public get error(): Error | undefined {
    return this.state.error
  }
  public setError(error: Error | undefined): void {
    this.state.error = error
  }

  public get item(): T | undefined {
    return this.state.item
  }
  public setItem(item: T | undefined): void {
    this.state.item = item
  }
}

export class UserRegistrationResponse<
  UserModel
> extends ServiceResponse<UserModel> {}

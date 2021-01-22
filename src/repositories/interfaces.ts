/**
 * Repository interfaces.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { QueryResult } from 'pg'

export interface IRead {
  findOneById(id: string): Promise<QueryResult>
}

export interface IWrite<T> {
  createOne(item: T): Promise<QueryResult>
  // update(id: string, item: T): Promise<boolean>
  // delete(id: string): Promise<boolean>
}

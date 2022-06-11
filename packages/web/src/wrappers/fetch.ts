/**
 * Fetch.
 *
 * A typescript wrapper for the Fetch API that handles errors gracefully, with
 * helper functions for each HTTP method.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API}
 *
 * Based on a blog post by Alexander Eckert, July 12, 2020.
 * @see {@link https://eckertalex.dev/blog/typescript-fetch-wrapper}
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report Web Application.
 * @see {@link https://github.com/unblinking/recipe-report}
 *
 * Recipe.Report Web App is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report Web App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */

/**
 * Fetch wrapper for HTTP requests.
 */
async function http<T>(path: string, config: RequestInit): Promise<T> {
  const request = new Request(path, config)
  const response = await fetch(request)
  // may error if there is no body, return empty array
  return response.json().catch(() => ({}))
}

/**
 * HTTP GET method helper function.
 */
export async function get<T>(path: string, token?: string): Promise<T> {
  const init = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return await http<T>(path, init)
}

/**
 * HTTP POST method helper function.
 */
export async function post<T, U>(path: string, body: T, token?: string): Promise<U> {
  const init = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  }
  return await http<U>(path, init)
}

/**
 * HTTP PUT method helper function.
 */
export async function put<T, U>(path: string, body: T, token?: string): Promise<U> {
  const init = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  }
  return await http<U>(path, init)
}

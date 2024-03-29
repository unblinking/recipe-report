/**
 * Feature mapper.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report.
 * @see {@link https://github.com/unblinking/recipe-report}
 *
 * Recipe.Report is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import type { FeatureDto } from '@recipe-report/domain/dtos'
import type { IFeature } from '@recipe-report/domain/interfaces'
import { Err, errInternal, Feature } from '@recipe-report/domain/models'
import { DisplayName, UniqueId } from '@recipe-report/domain/values'

export class FeatureMap {
  public static dtoToDomain(featureDto: FeatureDto): Feature {
    if (!this.isFeature(featureDto)) {
      throw new Err(`DOMAIN_OBJECT`, `FeatureMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return Feature.create(
      {
        name: DisplayName.create(featureDto.name),
        description: featureDto.description,
        date_created: featureDto.date_created ? new Date(featureDto.date_created) : undefined,
        date_deleted: featureDto.date_deleted ? new Date(featureDto.date_deleted) : undefined,
      },
      UniqueId.create(featureDto.id),
    )
  }

  public static dbToDomain(dbResult: FeatureDto, id: string): Feature {
    if (!this.isFeature(dbResult)) {
      throw new Err(`DOMAIN_OBJECT`, `FeatureMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return Feature.create(
      {
        name: DisplayName.create(dbResult.name),
        description: dbResult.description,
        date_created: dbResult.date_created ? new Date(dbResult.date_created) : undefined,
        date_deleted: dbResult.date_deleted ? new Date(dbResult.date_deleted) : undefined,
      },
      UniqueId.create(id),
    )
  }

  public static domainToDto(feature: Feature): FeatureDto {
    return {
      id: feature.id.value,
      name: feature.name.value,
      description: feature.description,
      date_created: feature.date_created?.toString(),
      date_deleted: feature.date_deleted?.toString(),
    }
  }

  // Type-guard using a type-predicate method.
  public static isFeature(raw: unknown): raw is IFeature {
    if (!(raw as IFeature).name) return false
    if (!(raw as IFeature).description) return false
    return true
  }
}

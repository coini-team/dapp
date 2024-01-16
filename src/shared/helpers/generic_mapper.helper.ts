import { Logger } from '@nestjs/common';

export class GenericMapper {
  private readonly _logger = new Logger(':::: GenericMapper ::::');

  public map<T, U>(entity: T, dtoType: new () => U): U {
    // Create a new instance of the dto.
    const dto = new dtoType();
    // Assign the entity fields to the dto.
    Object.assign(dto, entity);
    // Return the dto.
    return dto;
  }
}

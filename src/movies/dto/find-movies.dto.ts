import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class FindMoviesDto {
  @IsString()
  @MinLength(1)
  public title: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  @Type(() => Number)
  public year: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  public page:number = 1;
}
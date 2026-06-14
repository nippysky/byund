import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AssetsService } from "./assets.service";
import { CreateAssetDto } from "./dto/create-asset.dto";
import { UpdateAssetDto } from "./dto/update-asset.dto";

@ApiTags("Assets")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("assets")
export class AssetsController {
  constructor(private readonly assets: AssetsService) {}

  @Get()
  @ApiOperation({ summary: "List all assets in workspace" })
  @ApiQuery({ name: "type", required: false })
  @ApiQuery({ name: "owner", required: false })
  @ApiQuery({ name: "status", required: false })
  findAll(@Query("type") type?: string, @Query("owner") owner?: string) {
    return this.assets.findAll({ type, owner });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get asset details" })
  findOne(@Param("id") id: string) {
    return this.assets.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Register a new asset" })
  create(@Body() dto: CreateAssetDto) {
    return this.assets.create(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update asset details" })
  update(@Param("id") id: string, @Body() dto: UpdateAssetDto) {
    return this.assets.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Archive an asset" })
  remove(@Param("id") id: string) {
    return this.assets.remove(id);
  }
}

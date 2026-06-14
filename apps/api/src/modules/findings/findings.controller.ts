import { Controller, Get, Post, Patch, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { FindingsService } from "./findings.service";
import { CreateFindingDto } from "./dto/create-finding.dto";
import { UpdateFindingDto } from "./dto/update-finding.dto";

@ApiTags("Findings")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("findings")
export class FindingsController {
  constructor(private readonly findings: FindingsService) {}

  @Get()                @ApiOperation({ summary: "List findings"      }) findAll() { return this.findings.findAll(); }
  @Get(":id")           @ApiOperation({ summary: "Get finding"        }) findOne(@Param("id") id: string) { return this.findings.findOne(id); }
  @Post()               @ApiOperation({ summary: "Log new finding"    }) create(@Body() dto: CreateFindingDto) { return this.findings.create(dto); }
  @Patch(":id")         @ApiOperation({ summary: "Update finding"     }) update(@Param("id") id: string, @Body() dto: UpdateFindingDto) { return this.findings.update(id, dto); }
  @Patch(":id/resolve") @ApiOperation({ summary: "Resolve finding"    }) resolve(@Param("id") id: string, @Body("resolution") resolution: string) { return this.findings.resolve(id, resolution); }
}

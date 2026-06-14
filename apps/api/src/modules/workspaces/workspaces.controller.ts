import { Controller, Get, Post, Patch, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { WorkspacesService } from "./workspaces.service";

@ApiTags("Workspaces")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly workspaces: WorkspacesService) {}

  @Get("me")          @ApiOperation({ summary: "Get current user workspace" }) getMyWorkspace()                                     { return this.workspaces.getMyWorkspace(); }
  @Get(":id/members") @ApiOperation({ summary: "List workspace members"     }) getMembers(@Param("id") id: string)                  { return this.workspaces.getMembers(id); }
  @Post(":id/invite") @ApiOperation({ summary: "Invite member"              }) invite(@Param("id") id: string, @Body("email") email: string, @Body("role") role: string) { return this.workspaces.invite(id, email, role); }
}

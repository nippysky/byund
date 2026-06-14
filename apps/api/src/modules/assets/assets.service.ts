import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAssetDto } from "./dto/create-asset.dto";
import { UpdateAssetDto } from "./dto/update-asset.dto";

// TODO: inject PrismaService — stub for now
@Injectable()
export class AssetsService {
  async findAll(filters: { type?: string; owner?: string }) {
    // return this.prisma.asset.findMany({ where: { type: filters.type, ownerId: filters.owner } });
    return [];
  }

  async findOne(id: string) {
    // const asset = await this.prisma.asset.findUnique({ where: { id }, include: { owner: true, reviews: true, findings: true } });
    // if (!asset) throw new NotFoundException("Asset not found");
    return { id };
  }

  async create(dto: CreateAssetDto) {
    // return this.prisma.asset.create({ data: { ...dto, workspaceId: ctx.workspaceId } });
    return { id: "new-id", ...dto };
  }

  async update(id: string, dto: UpdateAssetDto) {
    // return this.prisma.asset.update({ where: { id }, data: dto });
    return { id, ...dto };
  }

  async remove(id: string) {
    // soft delete — never hard delete, audit trail must remain
    // return this.prisma.asset.update({ where: { id }, data: { archivedAt: new Date() } });
    return { archived: true };
  }
}

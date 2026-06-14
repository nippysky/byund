import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkspacesService {
  async getMyWorkspace()              { return { id: "ws-placeholder", name: "NIPPYSKY LTD" }; }
  async getMembers(id: string)        { return []; }
  async invite(id: string, email: string, role: string) { return { invited: email, role }; }
}

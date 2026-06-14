import { Controller, Get, Post, Patch, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { ReviewsService } from "./reviews.service";
import { CompleteReviewDto } from "./dto/complete-review.dto";

@ApiTags("Reviews")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get()                    @ApiOperation({ summary: "List all reviews"           }) findAll()                                { return this.reviews.findAll(); }
  @Get("due")               @ApiOperation({ summary: "Reviews due in next 14 days"}) getDue()                                 { return this.reviews.getDue(); }
  @Get(":id")               @ApiOperation({ summary: "Get review detail"          }) findOne(@Param("id") id: string)         { return this.reviews.findOne(id); }
  @Post(":id/complete")     @ApiOperation({ summary: "Mark review as completed"   }) complete(@Param("id") id: string, @Body() dto: CompleteReviewDto) { return this.reviews.complete(id, dto); }
}

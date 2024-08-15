import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req,
  ) {
    return this.transactionService.createTransaction(
      createTransactionDto,
      +req.user.id,
    );
  }

  @Get('pagination')
  @UseGuards(JwtAuthGuard)
  findTransactionsWithPagination(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
  ) {
    return this.transactionService.findTransactionsWithPagination(
      +req.user.id,
      +page,
      +limit,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findTransactions(@Req() req) {
    return this.transactionService.findTransactions(+req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findTransaction(@Param('id') id: string) {
    return this.transactionService.findTransaction(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.updateTransaction(+id, updateTransactionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeTransaction(@Param('id') id: string) {
    return this.transactionService.removeTransaction(+id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    id: number,
  ) {
    const newTransaction = this.transactionRepository.create({
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: { id: +createTransactionDto.category },
      user: { id },
    });

    return await this.transactionRepository.save(newTransaction);
  }

  async findTransactions(id: number) {
    return await this.transactionRepository.find({
      where: {
        user: { id },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findTransaction(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });

    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.transactionRepository.preload({
      id,
      ...updateTransactionDto,
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    return await this.transactionRepository.save(transaction);
  }

  async removeTransaction(id: number) {
    const transaction = await this.findTransaction(id);

    await this.transactionRepository.remove(transaction);
    return transaction;
  }

  async findTransactionsWithPagination(
    id: number,
    page: number,
    limit: number,
  ) {
    return await this.transactionRepository.find({
      where: {
        user: { id },
      },
      relations: ['user', 'category'],
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findAllByType(id: number, type: string) {
    const transaction = await this.transactionRepository.find({
      where: {
        user: { id },
        type,
      },
    });
    const total = transaction.reduce((acc, obj) => acc + obj.amount, 0);

    return total;
  }
}

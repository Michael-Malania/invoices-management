import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
// mongoose.set('strictPopulate', false);

@Injectable()
export class DatabaseRepo {
  async create<T>(
    body: Partial<T>,
    model: mongoose.Model<T>,
  ): Promise<T | null> {
    try {
      const result = await model.create(body);
      return result as T;
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  }

  async createMany<T>(
    bodies: Partial<T>[],
    model: mongoose.Model<T>,
  ): Promise<T[] | null> {
    try {
      const results = await model.insertMany(bodies);
      return results as T[];
    } catch (error) {
      console.error('Error creating multiple documents:', error);
      return null;
    }
  }

  async findById<T>(
    id: mongoose.Types.ObjectId,
    model: mongoose.Model<T>,
  ): Promise<T | null> {
    try {
      const result = await model.findById(id).exec();
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAllContent<T>(
    params: mongoose.FilterQuery<T>,
    model: mongoose.Model<T>,
    projection?: object,
    populateOptions?: mongoose.PopulateOptions,
  ): Promise<Partial<T>[]> {
    try {
      let query;

      if (populateOptions) {
        query = model.find(params, projection).populate(populateOptions);
      } else {
        query = model.find(params, projection);
      }
      const result = await query.lean().exec();
      return result as Partial<T>[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getOneContent<T>(
    params: mongoose.FilterQuery<T>,
    model: mongoose.Model<T>,
    projection?: object,
    populateOptions?: mongoose.PopulateOptions,
  ): Promise<Partial<T> | null> {
    try {
      let query;

      if (populateOptions) {
        query = model.findOne(params, projection).populate(populateOptions);
      } else {
        query = model.findOne(params, projection);
      }
      const result = await query.lean().exec();
      return result as Partial<T>;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

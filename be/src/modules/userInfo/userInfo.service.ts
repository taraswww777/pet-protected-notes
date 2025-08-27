import { db, schema } from '../../db';
import { eq } from 'drizzle-orm';
import { BaseService } from '../../utils/BaseService';
import { UserInfoInsert, UserInfoSelect, UserInfoUpdateBody } from './userInfo.validation.schema';

export class UserInfoService extends BaseService {
  constructor() {
    super();
    this.serviceName = 'UserInfoService';
  }

  async getByUserId(userId: number): Promise<UserInfoSelect | undefined> {
    const [info] = await db.select()
      .from(schema.userInfo)
      .where(eq(schema.userInfo.userId, userId))
      .limit(1)
      .execute();

    return info;
  }

  async createOrUpdate(
    userId: number,
    data: UserInfoUpdateBody
  ): Promise<UserInfoSelect> {
    const existingInfo = await this.getByUserId(userId);

    if (existingInfo) {
      // Обновляем только переданные поля
      const updateData: Partial<UserInfoInsert> = {};

      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.secondName !== undefined) updateData.secondName = data.secondName;
      if (data.thirdName !== undefined) updateData.thirdName = data.thirdName;

      const [updatedInfo] = await db.update(schema.userInfo)
        .set(updateData)
        .where(eq(schema.userInfo.userId, userId))
        .returning();

      return updatedInfo;
    }

    // Создаем новую запись
    const [newInfo] = await db.insert(schema.userInfo)
      .values({
        userId,
        firstName: data.firstName || null,
        secondName: data.secondName || null,
        thirdName: data.thirdName || null
      })
      .returning();
    return newInfo;
  }

  async delete(userId: number): Promise<boolean> {
    const [deletedInfo] = await db.delete(schema.userInfo)
      .where(eq(schema.userInfo.userId, userId))
      .returning();

    return !!deletedInfo;
  }
}

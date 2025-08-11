import { db, schema } from '../../db';
import { eq } from 'drizzle-orm';
import { BaseService } from '../../utils/BaseService';


export class UserInfoService extends BaseService {
  constructor() {
    super();

    this.serviceName = 'UserInfoService';
  }

  async getByUserId(userId: number): Promise<schema.UserInfoSelect | undefined> {
    const [info] = await db.select()
      .from(schema.userInfo)
      .where(eq(schema.userInfo.userId, userId))
      .limit(1)
      .execute();

    return info;
  }

  async createOrUpdate(
    userId: number,
    data: Partial<schema.UserInfoInsert>,
  ): Promise<schema.UserInfoSelect> {
    const existingInfo = await this.getByUserId(userId);

    if (existingInfo) {
      const [updatedInfo] = await db.update(schema.userInfo)
        .set(data)
        .where(eq(schema.userInfo.userId, userId))
        .returning();
      return updatedInfo;
    }

    const [newInfo] = await db.insert(schema.userInfo)
      .values({ ...data, userId })
      .returning();
    return newInfo;
  }

  async delete(userId: number): Promise<schema.UserInfoSelect | undefined> {
    const [deletedInfo] = await db.delete(schema.userInfo)
      .where(eq(schema.userInfo.userId, userId))
      .returning();
    return deletedInfo;
  }
}

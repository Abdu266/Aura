import { 
  users, episodes, triggers, episodeTriggers, medications, medicationLogs, 
  reliefActivities, insights,
  type User, type InsertUser, type Episode, type InsertEpisode,
  type Trigger, type InsertTrigger, type EpisodeTrigger, type InsertEpisodeTrigger,
  type Medication, type InsertMedication, type MedicationLog, type InsertMedicationLog,
  type ReliefActivity, type InsertReliefActivity, type Insight, type InsertInsight
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, count } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Episode methods
  getEpisodes(userId: number, limit?: number): Promise<Episode[]>;
  getEpisode(id: number): Promise<Episode | undefined>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
  updateEpisode(id: number, updates: Partial<InsertEpisode>): Promise<Episode | undefined>;
  getEpisodesInRange(userId: number, startDate: Date, endDate: Date): Promise<Episode[]>;

  // Trigger methods
  getTriggers(userId: number): Promise<Trigger[]>;
  createTrigger(trigger: InsertTrigger): Promise<Trigger>;
  updateTrigger(id: number, updates: Partial<InsertTrigger>): Promise<Trigger | undefined>;
  deleteTrigger(id: number): Promise<boolean>;

  // Episode trigger methods
  addEpisodeTrigger(episodeTrigger: InsertEpisodeTrigger): Promise<EpisodeTrigger>;
  getEpisodeTriggers(episodeId: number): Promise<Trigger[]>;

  // Medication methods
  getMedications(userId: number): Promise<Medication[]>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, updates: Partial<InsertMedication>): Promise<Medication | undefined>;
  deleteMedication(id: number): Promise<boolean>;

  // Medication log methods
  getMedicationLogs(userId: number, limit?: number): Promise<MedicationLog[]>;
  createMedicationLog(medicationLog: InsertMedicationLog): Promise<MedicationLog>;
  getMedicationLogsForEpisode(episodeId: number): Promise<MedicationLog[]>;

  // Relief activity methods
  getReliefActivities(userId: number, limit?: number): Promise<ReliefActivity[]>;
  createReliefActivity(reliefActivity: InsertReliefActivity): Promise<ReliefActivity>;

  // Insight methods
  getInsights(userId: number, limit?: number): Promise<Insight[]>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  markInsightAsRead(id: number): Promise<boolean>;

  // Analytics methods
  getEpisodeCount(userId: number, days: number): Promise<number>;
  getWeeklyEpisodeData(userId: number): Promise<{ date: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Episode methods
  async getEpisodes(userId: number, limit = 50): Promise<Episode[]> {
    return await db
      .select()
      .from(episodes)
      .where(eq(episodes.userId, userId))
      .orderBy(desc(episodes.startTime))
      .limit(limit);
  }

  async getEpisode(id: number): Promise<Episode | undefined> {
    const [episode] = await db.select().from(episodes).where(eq(episodes.id, id));
    return episode || undefined;
  }

  async createEpisode(episode: InsertEpisode): Promise<Episode> {
    const [newEpisode] = await db.insert(episodes).values(episode).returning();
    return newEpisode;
  }

  async updateEpisode(id: number, updates: Partial<InsertEpisode>): Promise<Episode | undefined> {
    const [episode] = await db.update(episodes).set(updates).where(eq(episodes.id, id)).returning();
    return episode || undefined;
  }

  async getEpisodesInRange(userId: number, startDate: Date, endDate: Date): Promise<Episode[]> {
    return await db
      .select()
      .from(episodes)
      .where(
        and(
          eq(episodes.userId, userId),
          gte(episodes.startTime, startDate),
          lte(episodes.startTime, endDate)
        )
      )
      .orderBy(desc(episodes.startTime));
  }

  // Trigger methods
  async getTriggers(userId: number): Promise<Trigger[]> {
    return await db
      .select()
      .from(triggers)
      .where(and(eq(triggers.userId, userId), eq(triggers.isActive, true)))
      .orderBy(triggers.name);
  }

  async createTrigger(trigger: InsertTrigger): Promise<Trigger> {
    const [newTrigger] = await db.insert(triggers).values(trigger).returning();
    return newTrigger;
  }

  async updateTrigger(id: number, updates: Partial<InsertTrigger>): Promise<Trigger | undefined> {
    const [trigger] = await db.update(triggers).set(updates).where(eq(triggers.id, id)).returning();
    return trigger || undefined;
  }

  async deleteTrigger(id: number): Promise<boolean> {
    const result = await db.update(triggers).set({ isActive: false }).where(eq(triggers.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Episode trigger methods
  async addEpisodeTrigger(episodeTrigger: InsertEpisodeTrigger): Promise<EpisodeTrigger> {
    const [newEpisodeTrigger] = await db.insert(episodeTriggers).values(episodeTrigger).returning();
    return newEpisodeTrigger;
  }

  async getEpisodeTriggers(episodeId: number): Promise<Trigger[]> {
    const result = await db
      .select({ trigger: triggers })
      .from(episodeTriggers)
      .innerJoin(triggers, eq(episodeTriggers.triggerId, triggers.id))
      .where(eq(episodeTriggers.episodeId, episodeId));
    
    return result.map(r => r.trigger);
  }

  // Medication methods
  async getMedications(userId: number): Promise<Medication[]> {
    return await db
      .select()
      .from(medications)
      .where(and(eq(medications.userId, userId), eq(medications.isActive, true)))
      .orderBy(medications.name);
  }

  async createMedication(medication: InsertMedication): Promise<Medication> {
    const [newMedication] = await db.insert(medications).values(medication).returning();
    return newMedication;
  }

  async updateMedication(id: number, updates: Partial<InsertMedication>): Promise<Medication | undefined> {
    const [medication] = await db.update(medications).set(updates).where(eq(medications.id, id)).returning();
    return medication || undefined;
  }

  async deleteMedication(id: number): Promise<boolean> {
    const result = await db.update(medications).set({ isActive: false }).where(eq(medications.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Medication log methods
  async getMedicationLogs(userId: number, limit = 50): Promise<MedicationLog[]> {
    return await db
      .select()
      .from(medicationLogs)
      .where(eq(medicationLogs.userId, userId))
      .orderBy(desc(medicationLogs.takenAt))
      .limit(limit);
  }

  async createMedicationLog(medicationLog: InsertMedicationLog): Promise<MedicationLog> {
    const [newMedicationLog] = await db.insert(medicationLogs).values(medicationLog).returning();
    return newMedicationLog;
  }

  async getMedicationLogsForEpisode(episodeId: number): Promise<MedicationLog[]> {
    return await db
      .select()
      .from(medicationLogs)
      .where(eq(medicationLogs.episodeId, episodeId))
      .orderBy(desc(medicationLogs.takenAt));
  }

  // Relief activity methods
  async getReliefActivities(userId: number, limit = 50): Promise<ReliefActivity[]> {
    return await db
      .select()
      .from(reliefActivities)
      .where(eq(reliefActivities.userId, userId))
      .orderBy(desc(reliefActivities.completedAt))
      .limit(limit);
  }

  async createReliefActivity(reliefActivity: InsertReliefActivity): Promise<ReliefActivity> {
    const [newReliefActivity] = await db.insert(reliefActivities).values(reliefActivity).returning();
    return newReliefActivity;
  }

  // Insight methods
  async getInsights(userId: number, limit = 10): Promise<Insight[]> {
    return await db
      .select()
      .from(insights)
      .where(eq(insights.userId, userId))
      .orderBy(desc(insights.createdAt))
      .limit(limit);
  }

  async createInsight(insight: InsertInsight): Promise<Insight> {
    const [newInsight] = await db.insert(insights).values(insight).returning();
    return newInsight;
  }

  async markInsightAsRead(id: number): Promise<boolean> {
    const result = await db.update(insights).set({ isRead: true }).where(eq(insights.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Analytics methods
  async getEpisodeCount(userId: number, days: number): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [result] = await db
      .select({ count: count(episodes.id) })
      .from(episodes)
      .where(
        and(
          eq(episodes.userId, userId),
          gte(episodes.startTime, startDate)
        )
      );

    return result.count;
  }

  async getWeeklyEpisodeData(userId: number): Promise<{ date: string; count: number }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const episodeData = await db
      .select()
      .from(episodes)
      .where(
        and(
          eq(episodes.userId, userId),
          gte(episodes.startTime, startDate),
          lte(episodes.startTime, endDate)
        )
      );

    // Group by date
    const grouped = episodeData.reduce((acc, episode) => {
      const date = episode.startTime.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Fill in missing dates with 0
    const result = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        count: grouped[dateStr] || 0
      });
    }

    return result;
  }
}

export const storage = new DatabaseStorage();

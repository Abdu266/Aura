import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  darkMode: boolean("dark_mode").default(false),
  fontSize: text("font_size").default("medium"), // small, medium, large
  highContrast: boolean("high_contrast").default(false),
  emergencyContact: text("emergency_contact"),
  emergencyContactName: text("emergency_contact_name"),
  timezone: text("timezone").default("UTC"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Migraine episodes table
export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  painLevel: integer("pain_level").notNull(), // 1-10 scale
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in minutes
  location: text("location"), // head area affected
  symptoms: text("symptoms").array(), // array of symptoms
  notes: text("notes"),
  weatherPressure: decimal("weather_pressure"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Triggers table
export const triggers = pgTable("triggers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(), // food, stress, weather, sleep, etc.
  severity: integer("severity"), // 1-5 impact level
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Episode triggers junction table
export const episodeTriggers = pgTable("episode_triggers", {
  id: serial("id").primaryKey(),
  episodeId: integer("episode_id").notNull().references(() => episodes.id),
  triggerId: integer("trigger_id").notNull().references(() => triggers.id),
  severity: integer("severity"), // 1-5 how much this trigger contributed
  createdAt: timestamp("created_at").defaultNow(),
});

// Medications table
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  dosage: text("dosage"),
  type: text("type").notNull(), // preventive, abortive, rescue
  instructions: text("instructions"),
  sideEffects: text("side_effects").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medication logs table
export const medicationLogs = pgTable("medication_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  medicationId: integer("medication_id").notNull().references(() => medications.id),
  episodeId: integer("episode_id").references(() => episodes.id),
  takenAt: timestamp("taken_at").notNull(),
  dosage: text("dosage"),
  effectiveness: integer("effectiveness"), // 1-5 scale
  sideEffects: text("side_effects").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relief activities table
export const reliefActivities = pgTable("relief_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  episodeId: integer("episode_id").references(() => episodes.id),
  type: text("type").notNull(), // breathing, cold_therapy, relaxation, etc.
  duration: integer("duration"), // in minutes
  effectiveness: integer("effectiveness"), // 1-5 scale
  completedAt: timestamp("completed_at").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insights table for AI-generated patterns
export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // pattern, prediction, recommendation
  title: text("title").notNull(),
  message: text("message").notNull(),
  confidence: decimal("confidence"), // 0-1 confidence score
  data: json("data"), // additional structured data
  isRead: boolean("is_read").default(false),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  episodes: many(episodes),
  triggers: many(triggers),
  medications: many(medications),
  medicationLogs: many(medicationLogs),
  reliefActivities: many(reliefActivities),
  insights: many(insights),
}));

export const episodesRelations = relations(episodes, ({ one, many }) => ({
  user: one(users, {
    fields: [episodes.userId],
    references: [users.id],
  }),
  episodeTriggers: many(episodeTriggers),
  medicationLogs: many(medicationLogs),
  reliefActivities: many(reliefActivities),
}));

export const triggersRelations = relations(triggers, ({ one, many }) => ({
  user: one(users, {
    fields: [triggers.userId],
    references: [users.id],
  }),
  episodeTriggers: many(episodeTriggers),
}));

export const episodeTriggersRelations = relations(episodeTriggers, ({ one }) => ({
  episode: one(episodes, {
    fields: [episodeTriggers.episodeId],
    references: [episodes.id],
  }),
  trigger: one(triggers, {
    fields: [episodeTriggers.triggerId],
    references: [triggers.id],
  }),
}));

export const medicationsRelations = relations(medications, ({ one, many }) => ({
  user: one(users, {
    fields: [medications.userId],
    references: [users.id],
  }),
  medicationLogs: many(medicationLogs),
}));

export const medicationLogsRelations = relations(medicationLogs, ({ one }) => ({
  user: one(users, {
    fields: [medicationLogs.userId],
    references: [users.id],
  }),
  medication: one(medications, {
    fields: [medicationLogs.medicationId],
    references: [medications.id],
  }),
  episode: one(episodes, {
    fields: [medicationLogs.episodeId],
    references: [episodes.id],
  }),
}));

export const reliefActivitiesRelations = relations(reliefActivities, ({ one }) => ({
  user: one(users, {
    fields: [reliefActivities.userId],
    references: [users.id],
  }),
  episode: one(episodes, {
    fields: [reliefActivities.episodeId],
    references: [episodes.id],
  }),
}));

export const insightsRelations = relations(insights, ({ one }) => ({
  user: one(users, {
    fields: [insights.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEpisodeSchema = createInsertSchema(episodes).omit({
  id: true,
  createdAt: true,
});

export const insertTriggerSchema = createInsertSchema(triggers).omit({
  id: true,
  createdAt: true,
});

export const insertEpisodeTriggerSchema = createInsertSchema(episodeTriggers).omit({
  id: true,
  createdAt: true,
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
  createdAt: true,
});

export const insertMedicationLogSchema = createInsertSchema(medicationLogs).omit({
  id: true,
  createdAt: true,
});

export const insertReliefActivitySchema = createInsertSchema(reliefActivities).omit({
  id: true,
  createdAt: true,
});

export const insertInsightSchema = createInsertSchema(insights).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type Episode = typeof episodes.$inferSelect;

export type InsertTrigger = z.infer<typeof insertTriggerSchema>;
export type Trigger = typeof triggers.$inferSelect;

export type InsertEpisodeTrigger = z.infer<typeof insertEpisodeTriggerSchema>;
export type EpisodeTrigger = typeof episodeTriggers.$inferSelect;

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;

export type InsertMedicationLog = z.infer<typeof insertMedicationLogSchema>;
export type MedicationLog = typeof medicationLogs.$inferSelect;

export type InsertReliefActivity = z.infer<typeof insertReliefActivitySchema>;
export type ReliefActivity = typeof reliefActivities.$inferSelect;

export type InsertInsight = z.infer<typeof insertInsightSchema>;
export type Insight = typeof insights.$inferSelect;

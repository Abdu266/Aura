import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEpisodeSchema, insertTriggerSchema, insertMedicationSchema, 
  insertMedicationLogSchema, insertReliefActivitySchema, insertInsightSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Episodes endpoints
  app.get("/api/episodes", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const episodes = await storage.getEpisodes(userId, limit);
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch episodes" });
    }
  });

  app.post("/api/episodes", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const episodeData = insertEpisodeSchema.parse({ ...req.body, userId });
      const episode = await storage.createEpisode(episodeData);
      res.json(episode);
    } catch (error) {
      res.status(400).json({ error: "Invalid episode data" });
    }
  });

  app.get("/api/episodes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const episode = await storage.getEpisode(id);
      if (!episode) {
        return res.status(404).json({ error: "Episode not found" });
      }
      res.json(episode);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch episode" });
    }
  });

  app.patch("/api/episodes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const episode = await storage.updateEpisode(id, updates);
      if (!episode) {
        return res.status(404).json({ error: "Episode not found" });
      }
      res.json(episode);
    } catch (error) {
      res.status(400).json({ error: "Failed to update episode" });
    }
  });

  // Triggers endpoints
  app.get("/api/triggers", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const triggers = await storage.getTriggers(userId);
      res.json(triggers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch triggers" });
    }
  });

  app.post("/api/triggers", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const triggerData = insertTriggerSchema.parse({ ...req.body, userId });
      const trigger = await storage.createTrigger(triggerData);
      res.json(trigger);
    } catch (error) {
      res.status(400).json({ error: "Invalid trigger data" });
    }
  });

  app.delete("/api/triggers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTrigger(id);
      if (!success) {
        return res.status(404).json({ error: "Trigger not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete trigger" });
    }
  });

  // Episode triggers
  app.post("/api/episodes/:episodeId/triggers", async (req, res) => {
    try {
      const episodeId = parseInt(req.params.episodeId);
      const { triggerId, severity } = req.body;
      const episodeTrigger = await storage.addEpisodeTrigger({
        episodeId,
        triggerId,
        severity
      });
      res.json(episodeTrigger);
    } catch (error) {
      res.status(400).json({ error: "Failed to add episode trigger" });
    }
  });

  app.get("/api/episodes/:episodeId/triggers", async (req, res) => {
    try {
      const episodeId = parseInt(req.params.episodeId);
      const triggers = await storage.getEpisodeTriggers(episodeId);
      res.json(triggers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch episode triggers" });
    }
  });

  // Medications endpoints
  app.get("/api/medications", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const medications = await storage.getMedications(userId);
      res.json(medications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch medications" });
    }
  });

  app.post("/api/medications", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const medicationData = insertMedicationSchema.parse({ ...req.body, userId });
      const medication = await storage.createMedication(medicationData);
      res.json(medication);
    } catch (error) {
      res.status(400).json({ error: "Invalid medication data" });
    }
  });

  app.patch("/api/medications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const medication = await storage.updateMedication(id, updates);
      if (!medication) {
        return res.status(404).json({ error: "Medication not found" });
      }
      res.json(medication);
    } catch (error) {
      res.status(400).json({ error: "Failed to update medication" });
    }
  });

  app.delete("/api/medications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMedication(id);
      if (!success) {
        return res.status(404).json({ error: "Medication not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete medication" });
    }
  });

  // Medication logs endpoints
  app.get("/api/medication-logs", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const logs = await storage.getMedicationLogs(userId, limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch medication logs" });
    }
  });

  app.post("/api/medication-logs", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const logData = insertMedicationLogSchema.parse({ ...req.body, userId });
      const log = await storage.createMedicationLog(logData);
      res.json(log);
    } catch (error) {
      res.status(400).json({ error: "Invalid medication log data" });
    }
  });

  // Relief activities endpoints
  app.get("/api/relief-activities", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getReliefActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch relief activities" });
    }
  });

  app.post("/api/relief-activities", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const activityData = insertReliefActivitySchema.parse({ ...req.body, userId });
      const activity = await storage.createReliefActivity(activityData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid relief activity data" });
    }
  });

  // Insights endpoints
  app.get("/api/insights", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const insights = await storage.getInsights(userId, limit);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  app.post("/api/insights/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markInsightAsRead(id);
      if (!success) {
        return res.status(404).json({ error: "Insight not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark insight as read" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/episode-count", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const count = await storage.getEpisodeCount(userId, days);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch episode count" });
    }
  });

  app.get("/api/analytics/weekly-episodes", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const data = await storage.getWeeklyEpisodeData(userId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weekly episode data" });
    }
  });

  // User preferences endpoints
  app.get("/api/user/preferences", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        darkMode: user.darkMode,
        fontSize: user.fontSize,
        highContrast: user.highContrast,
        emergencyContact: user.emergencyContact,
        emergencyContactName: user.emergencyContactName,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user preferences" });
    }
  });

  app.patch("/api/user/preferences", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const updates = req.body;
      const user = await storage.updateUser(userId, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        darkMode: user.darkMode,
        fontSize: user.fontSize,
        highContrast: user.highContrast,
        emergencyContact: user.emergencyContact,
        emergencyContactName: user.emergencyContactName,
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to update user preferences" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

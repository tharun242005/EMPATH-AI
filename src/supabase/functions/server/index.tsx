/// <reference path="./deno.d.ts" />
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8080a8fc/health", (c) => {
  return c.json({ status: "ok" });
});

// Emotion detection keywords and patterns
const emotionKeywords: Record<string, string[]> = {
  sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'gloomy', 'heartbroken', 'crying', 'tears'],
  angry: ['angry', 'furious', 'mad', 'rage', 'irritated', 'annoyed', 'frustrated', 'upset'],
  anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy', 'panicked', 'overwhelmed'],
  fearful: ['scared', 'afraid', 'frightened', 'terrified', 'fearful', 'panic', 'threatened'],
  happy: ['happy', 'joyful', 'excited', 'pleased', 'glad', 'delighted', 'cheerful', 'wonderful'],
  hopeful: ['hopeful', 'optimistic', 'confident', 'positive', 'encouraged', 'better'],
  distressed: ['help', 'crisis', 'emergency', 'suicide', 'harm', 'die', 'end it', 'can\'t go on'],
};

const harassmentKeywords = [
  'harass', 'threat', 'stalk', 'abuse', 'assault', 'blackmail', 'force', 'unwanted', 
  'inappropriate', 'uncomfortable', 'scared', 'violated', 'bully', 'intimidate'
];

// Analyze message for emotion and severity
app.post("/make-server-8080a8fc/api/analyze_message", async (c) => {
  try {
    const { text, user_id } = await c.req.json();
    
    if (!text) {
      return c.json({ error: 'Message text is required' }, 400);
    }

    const lowerText = text.toLowerCase();
    
    // Detect emotion
    let detectedEmotion = 'neutral';
    let maxMatches = 0;
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion;
      }
    }
    
    // Calculate severity (0-5 scale)
    let severity = 0;
    const distressKeywords = emotionKeywords.distressed || [];
    const distressMatches = distressKeywords.filter(keyword => lowerText.includes(keyword)).length;
    
    if (distressMatches > 0) {
      severity = 5;
      detectedEmotion = 'distressed';
    } else if (detectedEmotion === 'angry' || detectedEmotion === 'fearful') {
      severity = 3;
    } else if (detectedEmotion === 'anxious' || detectedEmotion === 'sad') {
      severity = 2;
    } else if (detectedEmotion === 'neutral') {
      severity = 1;
    }
    
    // Check for harassment indicators
    const harassmentMatches = harassmentKeywords.filter(keyword => lowerText.includes(keyword)).length;
    const harassmentLabel = harassmentMatches > 0 ? 'potential_harassment' : 'none';
    
    if (harassmentMatches > 2) {
      severity = Math.max(severity, 4);
    }
    
    // Store anonymized interaction if user_id provided
    if (user_id) {
      try {
        await kv.set(`interaction_${Date.now()}`, {
          user_id,
          emotion: detectedEmotion,
          severity,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error storing interaction:', error);
      }
    }
    
    return c.json({
      emotion: detectedEmotion,
      emotion_score: maxMatches > 0 ? 0.7 + (maxMatches * 0.1) : 0.5,
      harassment_label: harassmentLabel,
      severity,
      summary: `Detected ${detectedEmotion} emotion with severity level ${severity}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error analyzing message:', error);
    return c.json({ error: 'Failed to analyze message', details: error.message }, 500);
  }
});

// Generate empathetic AI response
app.post("/make-server-8080a8fc/api/respond", async (c) => {
  try {
    const { text, context } = await c.req.json();
    
    if (!text) {
      return c.json({ error: 'Message text is required' }, 400);
    }

    const lowerText = text.toLowerCase();
    
    // Detect emotion for context
    let emotion = 'neutral';
    for (const [emo, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        emotion = emo;
        break;
      }
    }
    
    // Generate empathetic response based on emotion
    let reply = '';
    const suggestions: string[] = [];
    
    switch (emotion) {
      case 'sad':
        reply = "I hear you, and I'm truly sorry you're going through this. It takes courage to share these feelings. Remember that sadness is a natural emotion, and it's okay to feel this way. Would you like to talk more about what's causing these feelings?";
        suggestions.push('breathing_exercise', 'journaling');
        break;
        
      case 'angry':
        reply = "I can sense your frustration, and your feelings are completely valid. Anger often comes from feeling hurt or unheard. Let's work through this together. What's at the heart of these feelings?";
        suggestions.push('cooling_down', 'express_safely');
        break;
        
      case 'anxious':
        reply = "I understand how overwhelming anxiety can feel. You're not alone in this. Let's take a moment to breathe together. What specific thoughts or situations are triggering this anxiety?";
        suggestions.push('breathing_exercise', 'grounding_technique');
        break;
        
      case 'fearful':
        reply = "I can see you're feeling scared, and that must be really difficult. Your safety and wellbeing matter. If you're in immediate danger, please contact emergency services. Otherwise, let's talk about what's making you feel this way.";
        suggestions.push('safety_plan', 'call_help');
        break;
        
      case 'distressed':
        reply = "I'm deeply concerned about what you're going through. Please know that you matter, and there are people who want to help. If you're having thoughts of harming yourself, please reach out to a crisis helpline immediately. They're available 24/7 and want to support you.";
        suggestions.push('call_help', 'crisis_resources', 'legal_info');
        break;
        
      case 'happy':
        reply = "It's wonderful to hear some positivity! I'm glad you're experiencing these good feelings. What's bringing you joy today?";
        break;
        
      case 'hopeful':
        reply = "That's such a positive outlook! Hope is a powerful feeling. I'm here to support you as you move forward. What are you hopeful about?";
        break;
        
      default:
        reply = "Thank you for sharing that with me. I'm here to listen and support you. How are you feeling right now? Is there anything specific you'd like to talk about?";
    }
    
    // Check for harassment mentions
    const harassmentDetected = harassmentKeywords.some(keyword => lowerText.includes(keyword));
    if (harassmentDetected) {
      reply += "\n\nI noticed you mentioned something that might be related to harassment or unwanted behavior. If you're experiencing harassment, you have rights and options. Would you like information about legal resources or support services?";
      suggestions.push('legal_info', 'safety_plan');
    }
    
    return c.json({
      reply,
      suggestions,
      voice: reply, // For TTS
      emotion_detected: emotion,
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return c.json({ error: 'Failed to generate response', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);
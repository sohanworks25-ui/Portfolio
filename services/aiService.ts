
import { GoogleGenAI } from "@google/genai";
import { PortfolioData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an answer to a visitor's question based on the portfolio data.
 */
export const getVisitorAssistantResponse = async (question: string, data: PortfolioData) => {
  const context = `
    You are an AI assistant for Sohan's personal portfolio. 
    Here is Sohan's data:
    Name: ${data.profile.name}
    Role: ${data.profile.designation}
    Bio: ${data.profile.bio}
    Skills: ${data.skills.map(s => s.name).join(', ')}
    Projects: ${data.projects.map(p => p.title + ': ' + p.description).join('; ')}
    Experience: ${data.experience.map(e => e.role + ' at ' + e.company).join(', ')}
    
    Answer the following question about Sohan as a helpful, professional assistant. 
    If you don't know the answer, politely ask the user to use the contact form.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: question,
    config: {
      systemInstruction: context,
    },
  });

  return response.text;
};

/**
 * Refines a bio or about me text to be more professional.
 */
export const refineProfileText = async (text: string, type: 'bio' | 'about') => {
  const prompt = `Refine the following ${type} text for a professional portfolio. Make it engaging, confident, and concise. Keep the length similar to the original: "${text}"`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

/**
 * Drafts a reply to a contact message.
 */
export const draftMessageReply = async (incomingMessage: string, senderName: string, sohanData: PortfolioData) => {
  const prompt = `
    Draft a professional, friendly email reply to this message from ${senderName}: "${incomingMessage}".
    The reply should be from ${sohanData.profile.name} (${sohanData.profile.designation}).
    Keep it under 100 words.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

/**
 * Generates a project description and tech stack based on a title.
 */
export const suggestProjectDetails = async (title: string) => {
  const prompt = `Based on the project title "${title}", provide a 2-sentence professional description and a comma-separated list of 5 modern technologies that would likely be used to build it. Format the response exactly like this: Description: [Your description] | Tech: [Tech 1, Tech 2, ...]`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  const text = response.text || '';
  const [descPart, techPart] = text.split('|');
  
  return {
    description: descPart?.replace('Description:', '').trim() || '',
    tech: techPart?.replace('Tech:', '').trim().split(',').map(t => t.trim()) || []
  };
};

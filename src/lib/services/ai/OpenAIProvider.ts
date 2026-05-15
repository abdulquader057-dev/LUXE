import { AIProvider, ChatMessage, AIResponse } from "./index";

export class OpenAIProvider implements AIProvider {
  name = "OpenAI";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(messages: ChatMessage[], context?: any): Promise<AIResponse> {
    // In a real production app, this would call a serverless function 
    // to protect the API key. For this architecture demonstration:
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Intelligent Parsing Logic (Simulated)
      // Real implementation would use function calling or structured output
      return {
        content,
        type: content.includes("RECOMMEND") ? "recommendation" : "text",
      };
    } catch (error) {
      console.error("OpenAI Provider Error:", error);
      throw error;
    }
  }
}

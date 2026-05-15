import { Product } from "@/types";

export type AIModel = "gpt-4o" | "gemini-pro" | "llama-3" | "qwen-max" | "claude-3-5-sonnet";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  type?: "text" | "product" | "recommendation" | "action";
  metadata?: any;
}

export interface AIResponse {
  content: string;
  type: "text" | "product" | "recommendation" | "action";
  data?: any;
}

export interface AIProvider {
  name: string;
  generateResponse(messages: ChatMessage[], context?: any): Promise<AIResponse>;
  streamResponse?(messages: ChatMessage[], context?: any): AsyncIterable<string>;
}

export class AIService {
  private static instance: AIService;
  private provider: AIProvider | null = null;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public setProvider(provider: AIProvider) {
    this.provider = provider;
  }

  public async chat(messages: ChatMessage[], context?: any): Promise<AIResponse> {
    if (!this.provider) {
      // Fallback to internal mock logic if no provider is configured
      return this.mockChatResponse(messages);
    }
    return this.provider.generateResponse(messages, context);
  }

  private mockChatResponse(messages: ChatMessage[]): AIResponse {
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (lastMessage.includes("recommend") || lastMessage.includes("suggest")) {
      return {
        content: "Based on your style profile, I've curated these futuristic pieces for you.",
        type: "recommendation",
        data: { query: lastMessage }
      };
    }

    return {
      content: "I am LUXE, analyzing your request through my neural fashion engine...",
      type: "text"
    };
  }
}

export const aiService = AIService.getInstance();

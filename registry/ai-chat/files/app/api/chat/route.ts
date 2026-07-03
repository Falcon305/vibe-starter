import { anthropic } from "@ai-sdk/anthropic";
import { type UIMessage, convertToModelMessages, streamText } from "ai";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

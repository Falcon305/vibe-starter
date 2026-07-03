"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="min-h-40 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="text-sm">
            <span className="font-medium">{message.role === "user" ? "You" : "Assistant"}: </span>
            {message.parts.map((part, index) =>
              part.type === "text" ? <span key={index}>{part.text}</span> : null,
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask something..."
        />
        <Button type="submit" disabled={status !== "ready"}>
          Send
        </Button>
      </form>
    </div>
  );
}

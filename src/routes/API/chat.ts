import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = {
role: "user" | "assistant";
content: string;
};

export const Route = createFileRoute("/api/chat")({
server: {
handlers: {
POST: async ({ request }) => {
try {
const body: unknown = await request.json();

      if (
        typeof body !== "object" ||
        body === null ||
        !("messages" in body) ||
        !Array.isArray(body.messages)
      ) {
        return Response.json(
          { error: "Please provide a valid messages array." },
          { status: 400 },
        );
      }

      const messages = body.messages as ChatMessage[];

      if (messages.length === 0 || messages.length > 30) {
        return Response.json(
          { error: "Send between 1 and 30 messages." },
          { status: 400 },
        );
      }

      for (const message of messages) {
        if (
          typeof message !== "object" ||
          message === null ||
          !["user", "assistant"].includes(message.role) ||
          typeof message.content !== "string" ||
          message.content.trim().length === 0 ||
          message.content.length > 4000
        ) {
          return Response.json(
            { error: "A message is invalid or too long." },
            { status: 400 },
          );
        }
      }

      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        return Response.json(
          {
            error:
              "AYANFE AI is not connected to an AI provider yet. Please configure the server API key.",
          },
          { status: 503 },
        );
      }

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are AYANFE AI, an intelligent, helpful, respectful assistant created by Ayanfe Innovation Labs Limited. Give clear, accurate, useful answers. Explain technical concepts in beginner-friendly steps when appropriate. Never claim certainty when you are unsure.",
              },
              ...messages.map((message) => ({
                role: message.role,
                content: message.content.trim(),
              })),
            ],
            max_tokens: 1000,
          }),
        },
      );

      if (!response.ok) {
        console.error("AI provider request failed:", response.status);

        return Response.json(
          {
            error:
              response.status === 429
                ? "The AI service is busy or its usage limit has been reached."
                : "The AI service could not complete your request. Please try again.",
          },
          {
            status:
              response.status === 429
                ? 429
                : 502,
          },
        );
      }

      const result = await response.json();

      const answer =
        result &&
        typeof result === "object" &&
        "choices" in result &&
        Array.isArray(result.choices) &&
        typeof result.choices[0]?.message?.content === "string"
          ? result.choices[0].message.content
          : null;

      if (!answer) {
        return Response.json(
          { error: "The AI service returned an empty answer." },
          { status: 502 },
        );
      }

      return Response.json({ answer });
    } catch {
      return Response.json(
        { error: "Unable to process your message. Please try again." },
        { status: 500 },
      );
    }
  },
},

},
});

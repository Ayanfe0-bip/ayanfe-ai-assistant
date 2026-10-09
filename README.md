# Ayanfe AI Assistant

PROJECT NAME: AYANFE AI



COMPANY: Ayanfe Innovation Labs Limited.



PROJECT VISION:

Build a modern, professional, mobile-first AI assistant platform called AYANFE AI. It should be an original product with its own identity, not a clone of another AI platform.



BRAND AND DESIGN:



- Product name: AYANFE AI.

- Use a premium, clean, modern interface.

- Primary colors: deep emerald green, white, and subtle gold accents.

- Use a simple, elegant layout with readable typography.

- Make the entire interface responsive and optimized for Android phones, tablets, and desktop browsers.

- Create a professional logo treatment using the product name and a simple original AI-inspired symbol.

- Include light and dark themes if practical without compromising the initial build.



MAIN NAVIGATION:

Create a mobile-friendly navigation system with these sections:



1. New Chat

2. Chat History

3. AI Writing

4. AI Learning Tutor

5. Coding Assistant

6. Documents

7. Image Tools

8. Settings



INITIAL VERSION — MVP:

Focus on creating a functional frontend foundation for the following features:



- AI chat interface with a message input and send button.

- User and assistant message bubbles.

- A loading indicator while the assistant is responding.

- A new-conversation action.

- A conversation-history sidebar on desktop and suitable navigation on mobile.

- Quick-start prompts for writing, learning, coding, and general questions.

- A clear empty state for new conversations.

- Responsive layouts that work well on narrow phone screens.

- Helpful error and empty states.

- A settings screen prepared for future account and preference management.



IMPORTANT FUNCTIONALITY:



- Implement real interface interactions rather than a static mockup.

- Until a real AI backend is connected, clearly indicate that the chat is in demonstration mode. Do not pretend that simulated responses come from a real AI.

- Do not hard-code fake AI intelligence or claim that external AI services have been connected.

- Organize the code into reusable components.

- Use TypeScript and the framework supported by the Lovable project.

- Follow good accessibility and mobile usability practices.

- Do not introduce unnecessary dependencies.



FUTURE ARCHITECTURE:

Prepare the application to support:



- Supabase authentication and database storage.

- Persistent user conversation history.

- A secure server-side AI endpoint.

- OpenAI API integration.

- Voice input and spoken AI responses.

- Document analysis, image capabilities, business assistance, and translation.



SECURITY:



- Never expose API keys, service-role keys, passwords, or other secrets in client-side code.

- Never place secrets in public repository files.

- Do not invent API credentials or create fake authentication.

- Do not enable insecure database policies to make features appear functional.



PROJECT MANAGEMENT:



- Build on the current project rather than creating unnecessary duplicate applications.

- Keep the implementation maintainable and ready for GitHub version control.

- Do not connect a new Supabase project or create database tables yet.

- Do not install paid services or initiate paid API usage.

- Prioritize a polished, working mobile interface over adding every planned feature.

- At the end, summarize the files created, the features that actually work, and anything still requiring implementation.



FIRST MILESTONE:

Deliver the AYANFE AI frontend foundation with a professional landing or welcome experience, a functional chat interface in demonstration mode, mobile navigation, quick-start prompts, and placeholder pages for the planned AI tools.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bfa99780-3fa3-4d8a-b2cc-e22d2a1a9b0b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

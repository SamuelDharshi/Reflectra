# Voice endpoint for chat function

This document describes the `action=voice` flow implemented in `netlify/functions/chat.ts`.

Flow
- Client sends audio (base64) in the request body as `audio_base64` (or `audio_url` pointing to a remote file).
- Server attempts STT using ElevenLabs (`ELEVEN_API_KEY` required). If not available, a placeholder transcription is returned.
- The transcription is sent to the AI (Gemini via `GEMINI_API_KEY`) with a short prompt requesting a concise reply.
- The AI reply is synthesized using ElevenLabs (`ELEVEN_API_KEY`), producing base64 audio in the response.

Request
- POST /.netlify/functions/chat?action=voice
- Body (JSON):
  - `audio_base64` (string): required unless `audio_url` is provided
  - `audio_url` (string): optional, a remote URL to audio file
  - `userContext` (optional): user context array

Environment variables
- `ELEVEN_API_KEY` - (required for STT & TTS) ElevenLabs API key used for both speech-to-text and text-to-speech
- `GEMINI_API_KEY` - (optional) used for Gemini AI responses
- `MODEL_NAME` - (optional) Gemini model name (defaults to `gemini-2.0-flash`)
- `VOICE_ID` - (optional) voice id for ElevenLabs (defaults to `alloy`)

Response
- JSON:
  - `success`: boolean
  - `transcription`: string
  - `sttProvider`: string
  - `aiText`: the brief AI reply
  - `aiProvider`: which provider produced the text
  - `audio_base64`: base64-encoded audio (mp3) if ElevenLabs produced audio
  - `ttsProvider`: which TTS provider was used

Notes
- Ensure the environment variables are set in Netlify site settings.
- The AI response is forced to be brief (30 words max) to suit quick voice replies.

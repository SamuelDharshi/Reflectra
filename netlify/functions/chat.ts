import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import FormData from 'form-data';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// Use Netlify Function environment variables
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.MODEL_NAME || 'gemini-2.0-flash';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const handler: Handler = async (event) => {
  console.log('chat function called with method:', event.httpMethod);
  console.log('Request body:', event.body);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message, userContext } = JSON.parse(event.body || '{}');
    const action = (event?.queryStringParameters || {})['action'] || '';

    // If action=voice, handle STT -> AI -> TTS flow
    if (action === 'voice') {
      return await handleVoiceFlow(event, { userContext });
    }

    console.log('Parsed chat data:', { message, userContext });

    if (!message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false,
          error: 'Message is required',
          response: ''
        })
      };
    }

    // Build context-aware prompt
    let systemPrompt = `You are a wise, empathetic AI reflection assistant. You help people with personal growth, self-reflection, and decision-making.`;
    
    if (userContext && userContext.length > 0) {
      const contextSummary = userContext.map((reflection: any) => {
        const coreValues = reflection.core_values || reflection.userData?.coreValues || [];
        const lifeGoals = reflection.life_goals || reflection.userData?.lifeGoals || [];
        const struggles = reflection.current_struggles || reflection.userData?.currentStruggles || [];
        
        return `Previous reflection: Values: ${Array.isArray(coreValues) ? coreValues.join(', ') : 'None'}, Goals: ${Array.isArray(lifeGoals) ? lifeGoals.join(', ') : 'None'}, Struggles: ${Array.isArray(struggles) ? struggles.join(', ') : 'None'}`;
      }).join('\n');
      
      systemPrompt += `\n\nUser's reflection history:\n${contextSummary}\n\nUse this context to provide personalized, relevant advice.`;
    }

    const fullPrompt = `${systemPrompt}

User's message: "${message}"

Provide a thoughtful, empathetic response that:
1. Acknowledges their message and any relevant context
2. Offers practical, actionable advice
3. Encourages self-reflection and growth
4. Maintains a supportive, conversational tone
5. Keeps the response under 200 words

Respond as if you're having a caring conversation with someone who trusts you with their personal growth journey.`;

    console.log('Generated chat prompt for AI');

    let responseText = '';
    let aiProvider = '';

    if (geminiApiKey && geminiApiKey.trim() !== '') {
      try {
        console.log('Calling Gemini API for chat response...');
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: geminiModel });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        responseText = response?.text?.() ?? '';
        aiProvider = `Gemini (${geminiModel})`;
        console.log('Gemini chat response received');
      } catch (geminiError: any) {
        console.error('Gemini chat API failed:', geminiError);
      }
    } else {
      console.error('Gemini API key is not configured.');
    }

    if (!responseText || responseText.trim().length === 0) {
      console.log('Using contextual fallback response.');
      responseText = generateContextualFallback(message);
      aiProvider = 'Fallback Assistant';
    }
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true,
        response: responseText.trim(),
        provider: aiProvider,
        error: null,
        fallback: aiProvider === 'Fallback Assistant'
      })
    };
  } catch (error: any) {
    console.error('Error in chat function:', error);
    
    // Provide contextual fallback responses
    const fallbackResponse = generateContextualFallback(
      JSON.parse(event.body || '{}').message || 'general'
    );
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        response: fallbackResponse,
        provider: 'Fallback Assistant',
        error: 'Service temporarily unavailable',
        fallback: true
      })
    };
  }
};

function generateContextualFallback(message: string): string {
  const userInput = message.toLowerCase();
  
  if (userInput.includes('value')) {
    return "Values are the compass that guides our decisions. What principles matter most to you in life? Understanding your core values can help you make choices that feel authentic and fulfilling.";
  } else if (userInput.includes('goal')) {
    return "Goals give us direction and purpose. What dreams are you working toward? Sometimes breaking big goals into smaller, actionable steps makes them feel more achievable.";
  } else if (userInput.includes('struggle') || userInput.includes('difficult') || userInput.includes('problem')) {
    return "Struggles are part of growth. What challenges are you facing right now? Remember, every obstacle is an opportunity to learn something new about yourself.";
  } else if (userInput.includes('decision') || userInput.includes('choose') || userInput.includes('choice')) {
    return "Decisions can feel overwhelming. What choice are you trying to make? Sometimes it helps to consider which option aligns best with your values and long-term goals.";
  } else if (userInput.includes('stress') || userInput.includes('anxious') || userInput.includes('worried')) {
    return "It's natural to feel stressed sometimes. What's weighing on your mind? Taking a step back and focusing on what you can control often helps bring clarity.";
  } else if (userInput.includes('future') || userInput.includes('plan')) {
    return "Planning for the future shows great self-awareness. What vision do you have for yourself? Remember, the future is built through the choices we make today.";
  } else if (userInput.includes('relationship') || userInput.includes('friend') || userInput.includes('family')) {
    return "Relationships are such an important part of our lives. What's happening in your relationships that you'd like to explore? Sometimes understanding our own needs helps us connect better with others.";
  } else if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('hey')) {
    return "Hello! I'm here to help you reflect and explore your thoughts. What's been on your mind lately? Whether it's about decisions, goals, or just life in general, I'm here to listen and offer support.";
  } else {
    return "I'm here to help you reflect and explore your thoughts. What's been on your mind lately? Feel free to share what you're thinking about - whether it's a decision you're facing, goals you're working toward, or anything else that's important to you.";
  }
}

export { handler };

// --- Voice flow helpers ---
async function handleVoiceFlow(event: any, opts: any) {
  try {
    const body = JSON.parse(event.body || '{}');
    const audio_base64 = body.audio_base64 || body.audio || null; // base64
    const audio_url = body.audio_url || null; // optional remote URL
    const voiceId = process.env.VOICE_ID || 'alloy';

    console.log('Voice flow started:', { 
      hasAudio: !!audio_base64, 
      hasUrl: !!audio_url,
      hasElevenKey: !!process.env.ELEVEN_API_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY
    });

    if (!audio_base64 && !audio_url) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: 'No audio provided (send audio_base64 or audio_url)' })
      };
    }

    // 1) Transcribe audio with ElevenLabs STT (requires ELEVEN_API_KEY)
    let transcription = '';
    let sttProvider = 'none';
    if (process.env.ELEVEN_API_KEY) {
      try {
        console.log('Starting ElevenLabs transcription...');
        transcription = await transcribeWithElevenLabs(audio_base64, audio_url);
        sttProvider = 'eleven-stt';
        console.log('Transcription successful:', transcription);
      } catch (e: any) {
        console.error('ElevenLabs transcription failed:', e?.message || e);
        console.error('Full error:', e);
        transcription = '';
      }
    } else {
      console.warn('ELEVEN_API_KEY not set, skipping transcription');
    }

    if (!transcription) {
      // Fallback placeholder
      transcription = 'Transcription not available. Please enable ELEVEN_API_KEY for speech-to-text.';
      sttProvider = 'placeholder';
    }

    // 2) Generate brief AI response (try Gemini first, then Claude as fallback)
    const briefPrompt = buildBriefPrompt(transcription, opts.userContext);
    let aiText = '';
    let aiProvider = '';
    
    // Try Gemini first
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('Generating AI response with Gemini...');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: process.env.MODEL_NAME || 'gemini-2.0-flash' });
        const result = await model.generateContent(briefPrompt);
        const response = await result.response;
        aiText = response?.text?.() ?? '';
        aiProvider = `Gemini (${process.env.MODEL_NAME || 'default'})`;
        console.log('AI response generated:', aiText);
      } catch (e: any) {
        console.error('Gemini voice response failed:', e?.message || e);
        console.error('Full error:', e);
        
        // If Gemini fails (quota/error), try Claude as fallback
        if (process.env.VITE_CLAUDE_API_KEY) {
          try {
            console.log('Trying Claude as fallback...');
            const Anthropic = await import('@anthropic-ai/sdk');
            const claude = new Anthropic.default({ apiKey: process.env.VITE_CLAUDE_API_KEY });
            const message = await claude.messages.create({
              model: 'claude-3-5-sonnet-20241022',
              max_tokens: 150,
              messages: [{ role: 'user', content: briefPrompt }]
            });
            aiText = message.content[0].type === 'text' ? message.content[0].text : '';
            aiProvider = 'Claude (Sonnet 3.5)';
            console.log('Claude fallback successful:', aiText);
          } catch (claudeError: any) {
            console.error('Claude fallback also failed:', claudeError?.message || claudeError);
          }
        }
      }
    } else {
      console.warn('GEMINI_API_KEY not set, using fallback');
    }

    if (!aiText) {
      // Use a succinct fallback
      aiText = generateContextualFallback(transcription).split('\n')[0];
      aiProvider = 'Fallback Assistant';
      console.log('Using fallback response:', aiText);
    }

    // Ensure brevity: enforce short reply (trim to first 1-2 sentences)
    aiText = forceBrief(aiText, 30); // 30 words max

    // 3) Synthesize with ElevenLabs
    let audio_base64_out = '';
    let ttsProvider = 'none';
    if (process.env.ELEVEN_API_KEY) {
      try {
        console.log('Synthesizing speech with ElevenLabs...');
        audio_base64_out = await synthesizeWithElevenLabs(aiText, voiceId);
        ttsProvider = 'elevenlabs';
        console.log('TTS successful, audio length:', audio_base64_out?.length);
      } catch (e: any) {
        console.error('ElevenLabs TTS failed:', e?.message || e);
        console.error('Full error:', e);
      }
    } else {
      console.warn('ELEVEN_API_KEY not set, skipping TTS');
    }

    console.log('Voice flow completed:', { sttProvider, aiProvider, ttsProvider });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        transcription,
        sttProvider,
        aiText,
        aiProvider,
        audio_base64: audio_base64_out,
        ttsProvider
      })
    };
  } catch (err: any) {
    console.error('handleVoiceFlow error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: err?.message || String(err) })
    };
  }
}

function buildBriefPrompt(transcription: string, userContext: any) {
  let systemPrompt = `You are a concise, empathetic AI reflection assistant. Respond in a brief, helpful way.`;
  if (userContext && userContext.length > 0) {
    systemPrompt += ` Use the user's context to personalize the response.`;
  }

  const prompt = `${systemPrompt}\n\nUser said: "${transcription}"\n\nRespond in 1-3 short sentences, keep it under 30 words, supportive and actionable.`;
  return prompt;
}

function forceBrief(text: string, maxWords = 30) {
  if (!text) return '';
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(' ').trim() + '...';
}

async function transcribeWithOpenAI(base64Audio: string | null, audioUrl: string | null) {
  // Uses OpenAI Whisper if OPENAI_API_KEY is set. Accepts base64 audio or remote URL.
  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) throw new Error('OPENAI_API_KEY not set');

    const form = new FormData();

    if (base64Audio) {
      const buffer = Buffer.from(base64Audio, 'base64');
      form.append('file', buffer, { filename: 'audio.mp3', contentType: 'audio/mpeg' });
    } else if (audioUrl) {
      const resp = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      const buf = Buffer.from(resp.data);
      form.append('file', buf, { filename: 'audio.mp3', contentType: 'audio/mpeg' });
    }

    form.append('model', 'whisper-1');

    const res = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        ...form.getHeaders()
      }
    });

    if (res.status >= 400) {
      throw new Error(`OpenAI STT failed: ${res.status} ${JSON.stringify(res.data)}`);
    }

    return res.data?.text || '';
  } catch (err: any) {
    console.error('transcribeWithOpenAI error:', err?.message || err);
    throw err;
  }
}

async function synthesizeWithElevenLabs(text: string, voiceId: string) {
  try {
    const apiKey = process.env.ELEVEN_API_KEY;
    if (!apiKey) throw new Error('ELEVEN_API_KEY not set');

    // ElevenLabs streaming endpoint - return audio/mpeg
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

    const resp = await axios.post(url, { text }, {
      responseType: 'arraybuffer',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg'
      }
    });

    const audioBuffer = Buffer.from(resp.data);
    return audioBuffer.toString('base64');
  } catch (err: any) {
    console.error('synthesizeWithElevenLabs error:', err?.message || err);
    throw err;
  }
}

// ElevenLabs speech-to-text helper
async function transcribeWithElevenLabs(base64Audio: string | null, audioUrl: string | null) {
  try {
    const apiKey = process.env.ELEVEN_API_KEY;
    if (!apiKey) throw new Error('ELEVEN_API_KEY not set');

    // Initialize ElevenLabs client
    const elevenlabs = new ElevenLabsClient({
      apiKey: apiKey
    });

    let audioBlob: Blob;

    if (base64Audio) {
      // Convert base64 to buffer and create blob
      const buffer = Buffer.from(base64Audio, 'base64');
      audioBlob = new Blob([buffer], { type: 'audio/webm' });
    } else if (audioUrl) {
      // Fetch remote audio and create blob
      const resp = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      const buf = Buffer.from(resp.data);
      audioBlob = new Blob([buf], { type: 'audio/mpeg' });
    } else {
      throw new Error('No audio provided');
    }

    // Use ElevenLabs SDK for speech-to-text
    const transcription = await elevenlabs.speechToText.convert({
      file: audioBlob,
      modelId: "scribe_v1",
      tagAudioEvents: false,
      languageCode: "eng",
      diarize: false
    });

    // Extract text from transcription response
    // The SDK returns the transcription object directly with a 'text' property
    const result = transcription as any;
    console.log('ElevenLabs transcription result:', result);
    return result?.text || result?.transcription || JSON.stringify(result);
  } catch (err: any) {
    console.error('transcribeWithElevenLabs error:', err?.message || err);
    throw err;
  }
}
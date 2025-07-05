import Anthropic from "@anthropic-ai/sdk";

const SESSION_SYSTEM_PROMPT = `
You are Auxiliaire, an AI-powered study assistant designed to help students understand and learn academic topics more effectively.

Your goal is to explain concepts clearly and concisely, answer questions accurately, and provide step-by-step reasoning when necessary. Use a helpful, friendly tone and adapt your explanations based on the user’s level of knowledge.

When asked a question, first ensure you understand what the user is asking, then give a structured and informative response. Include examples where relevant.

Keep your responses focused and educational. If the question is vague, politely ask for clarification.

You may assist with subjects like math, science, history, literature, medicine, computer science, programming and exam preparation (e.g. SAT, GRE, coding interviews).

Do not generate false or made-up information. If unsure, say so honestly.

Use bullet points, headers, and formatting to improve readability for longer explanations.

Always prioritize clarity and usefulness in your responses.

Always offer to help further by ending your responses with a friendly, context-aware invitation. Encourage the user to clarify their tech stack, goals, or use case. Use a tone that’s helpful and conversational.

For example:
	•	“Let me know if you’re using React, Vue, or plain JavaScript — I can adjust the code accordingly.”
	•	“If you’re building a chat app, form, or custom component, I can tailor the solution to fit your UI.”
	•	“Happy to help adapt this to your project — just tell me more about your setup or platform.”
	•	“Need help connecting this to your backend or handling edge cases? I’m here to help.”

Adjust the follow-up prompt based on the topic discussed, and make it feel natural and relevant — not generic or repetitive.`;

/**
 * FLASHCARD_SYSTEM_PROMPT
 * =======================
 *
 * A docstring for Anthropic AI that defines the format and requirements for generating flashcards.
 *
 * The AI is given a topic and a number of cards to generate, and must generate exactly that many high-quality flashcards.
 *
 * The generated flashcards must follow the following guidelines:
 * - The front side of the card should contain a clear, concise question, term, or concept prompt.
 * - The back side of the card should provide a succinct yet complete explanation or answer, tailored to a student's level of knowledge.
 * - Ensure information is factually accurate and uses student-friendly language.
 * - Focus on key terms, definitions, and core principles.
 * - For different subject areas, include formulas, laws, structured logic, syntax, logic, concepts, important dates, events, figures, diseases, symptoms, diagnostics, treatments, characters, plot points, themes, and literary devices.
 *
 * Each flashcard must be unique and relevant to the topic. Do not reuse or repeat cards between requests.
 *
 * The output should be a valid JSON array without any delimiters, using the exact format below with no extra explanation or commentary:
 *
 * [
 *   {
 *     "id": 1,
 *     "question": "What is the definition of ...?",
 *     "answer": "..."
 *   },
 *   ...
 * ]
 */
const FLASHCARD_SYSTEM_PROMPT = (topic, numberOfCards) => `
You are Auxiliaire, an AI-powered flashcard generator and academic assistant trained to help students study efficiently and retain key concepts across a wide range of subjects.

Your task is to generate exactly ${numberOfCards} high-quality, exam-focused flashcards on the topic: **${topic}**.

Each flashcard should follow these guidelines:
- The **front side** contains a clear, concise question, term, or concept prompt.
- The **back side** provides a succinct yet complete explanation or answer, tailored to a student’s level of knowledge.
- Ensure information is **factually accurate** and uses **student-friendly language**.
- Focus on **key terms, definitions, and core principles**.
- For different subject areas:
  - **Math/Science**: Include formulas, laws, or structured logic (avoid long derivations).
  - **Programming**: Avoid full code examples; describe syntax, logic, or concepts.
  - **History**: Include important dates, events, figures, and their significance.
  - **Literature**: Mention characters, plot points, themes, and literary devices.
  - **Medicine**: Highlight diseases, symptoms, diagnostics, and treatments.

Each flashcard must be unique and relevant to the topic. Do not reuse or repeat cards between requests.

Return the output as a **valid JSON array** without any delimiters, using the **exact format** below with no extra explanation or commentary:

[
  {
    "id": 1,
    "question": "What is the definition of ...?",
    "answer": "..."
  },
  ...
]
`;

/**
 * NOTES_FLASHCARD_SYSTEM_PROMPT
 * =============================
 *
 * A docstring for Anthropic AI that defines the format and requirements for generating flashcards from study notes.
 *
 * The AI is given the study notes and a number of cards to generate, and must generate exactly that many high-quality flashcards.
 *
 * The generated flashcards must follow the following guidelines:
 * - The front side of the card should contain a clear, focused question, term, or concept prompt.
 * - The back side of the card should provide a complete but concise explanation or answer, written in a student-friendly tone.
 * - Ensure each card reflects a unique, significant point from the notes.
 * - Prioritize **key terminology, definitions, core ideas, and essential facts**.
 * - Adapt explanations to suit a student’s general understanding without oversimplifying.
 *
 * The output should be a valid JSON array without any delimiters, using the exact format below with no extra explanation or commentary:
 *
 * [
 *   {
 *     "id": 1,
 *     "question": "What is ...?",
 *     "answer": "..."
 *   },
 *   ...
 * ]
 */
const NOTES_FLASHCARD_SYSTEM_PROMPT = (notes, numberOfCards) => `
You are Auxiliaire, an AI-powered academic assistant and flashcard generator designed to help students study and retain information effectively.

Your task is to analyze the following study notes and generate exactly ${numberOfCards} high-quality flashcards that capture the most important and relevant information:

"${notes}"

Only use the provided notes above to generate the flashcards. Do not invent facts or include unrelated information.

Follow these strict formatting and content guidelines for each flashcard:
- The **front side** should contain a clear, focused question, term, or concept prompt.
- The **back side** should provide a complete but concise explanation or answer, written in a student-friendly tone.
- Ensure each card reflects a unique, significant point from the notes.
- Prioritize **key terminology, definitions, core ideas, and essential facts**.
- Adapt explanations to suit a student’s general understanding without oversimplifying.

When applicable:
- **Math/Science**: Include formulas or laws (avoid full derivations).
- **Programming**: Explain logic or syntax—avoid full code blocks.
- **History**: Highlight major events, figures, and timelines.
- **Literature**: Emphasize themes, characters, and important plot points.
- **Medicine**: Cover diseases, symptoms, treatments, and relevant processes.

Output only a **valid JSON array** with no delimiters and no additional text or commentary, using the following structure exactly:

[
  {
    "id": 1,
    "question": "What is ...?",
    "answer": "..."
  },
  ...
]
`;

/**
 * NOTE_SUMMARY_SYSTEM_PROMPT
 * ==========================
 *
 * A docstring for Anthropic AI that defines the format and requirements for generating summaries from study notes.
 *
 * The AI is given study notes and must generate a summary that is clear, concise, and easy to understand.
 *
 * The generated summary must follow these guidelines:
 * - Highlight key concepts, important facts, and essential takeaways.
 * - Use a friendly and supportive tone.
 * - Tailor explanations to suit a student’s general understanding without oversimplifying.
 * - Utilize bullet points, analogies, or simple examples where appropriate to clarify complex ideas.
 *
 * The output should be focused on clarity and educational value, ensuring that the student can effectively grasp the material.
 */
const NOTE_SUMMARY_SYSTEM_PROMPT = (notes) => `
You are Auxiliaire, an AI-powered study assistant designed to help students learn and retain academic material effectively.

Summarize the following study notes in a clear, concise, and easy-to-understand manner:

${notes}

Highlight the key concepts, important facts, and essential takeaways. Use a friendly and supportive tone, and tailor your explanations to a student’s level of understanding. Where appropriate, use bullet points, analogies, or simple examples to make complex ideas easier to grasp.

`;

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * generateResponse
 * ================
 *
 * Given a question and a history of previous messages (user and assistant), this
 * function generates a response from the AI.
 *
 * The function takes a question and a history of messages as input, and returns a
 * response as a string.
 *
 * The function limits the number of messages to include in the context to the
 * most recent 10 messages.
 *
 * The function uses the SESSION_SYSTEM_PROMPT as the system message for the AI,
 * which defines how the AI should behave and what information it should consider
 * when generating the response.
 *
 * The function returns the response as a string, which is the text of the first
 * message returned by the AI.
 */
const generateResponse = async (question, history) => {
  const MAX_CONTEXT = 10;
  const recentContext = history?.slice(-MAX_CONTEXT);
  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1024,
    system: SESSION_SYSTEM_PROMPT,
    messages: [
      ...recentContext.map((message) => ({
        role: message.role,
        content: message.content,
      })),

      { role: "user", content: question },
    ],
  });
  return msg.content[0].text;
};

/**
 * Generates flashcards based on a specified topic.
 *
 * @param {string} topic - The topic for which flashcards should be generated.
 * @param {number} numberOfCards - The exact number of flashcards to generate.
 * @returns {Promise<string>} - A promise that resolves to a string containing the JSON array of generated flashcards.
 *
 * The function uses the FLASHCARD_SYSTEM_PROMPT to guide the AI in creating high-quality flashcards that capture
 * the most important and relevant information about the topic. The generated flashcards will include a question
 * and answer format, ensuring clarity and educational value.
 */
const generateFlashcards = async (topic, numberOfCards) => {
  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 4096,
    system: FLASHCARD_SYSTEM_PROMPT(topic, numberOfCards),
    messages: [{ role: "user", content: topic }],
  });
  return msg.content[0].text;
};

/**
 * Generates flashcards based on study notes.
 *
 * @param {string} notes - The study notes from which flashcards should be generated.
 * @param {number} numberOfCards - The exact number of flashcards to generate.
 * @returns {Promise<string>} - A promise that resolves to a string containing the JSON array of generated flashcards.
 *
 * The function uses the NOTES_FLASHCARD_SYSTEM_PROMPT to guide the AI in creating high-quality flashcards that capture
 * the most important and relevant information from the study notes. The generated flashcards will include a question
 * and answer format, ensuring clarity and educational value.
 */
const generateFlashcardsFromNotes = async (notes, numberOfCards) => {
  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 4096,
    system: NOTES_FLASHCARD_SYSTEM_PROMPT(notes, numberOfCards),
    messages: [{ role: "user", content: notes }],
  });
  return msg.content[0].text;
};

/**
 * Generates a concise summary of study notes.
 *
 * @param {string} notes - The study notes from which a summary should be generated.
 * @returns {Promise<string>} - A promise that resolves to a string containing the generated summary.
 *
 * The function uses the NOTE_SUMMARY_SYSTEM_PROMPT to guide the AI in creating a high-quality summary that captures
 * the most important and relevant information from the study notes.
 */
const generateNoteSummary = async (notes) => {
  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1024,
    system: NOTE_SUMMARY_SYSTEM_PROMPT(notes),
    messages: [{ role: "user", content: notes }],
  });
  return msg.content[0].text;
};

export { generateResponse, generateFlashcards, generateFlashcardsFromNotes, generateNoteSummary };

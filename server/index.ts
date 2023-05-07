import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Initialize chat history with a system message
const chatHistory: Array<ChatCompletionRequestMessage> = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
];

app.post("/message", async (req, res) => {
  const message = req.body.message;

  // Add the user's message to the chat history
  chatHistory.push({
    role: "user",
    content: message,
  });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatHistory,
    });

    const response = completion.data.choices[0].message?.content;

    // Add the GPT's response to the chat history
    chatHistory.push({
    role: "assistant",
    content: response as string,
    });

    console.log(chatHistory)

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the message." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

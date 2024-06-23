# Railway Train Reservation Assistant

This project is a railway train reservation assistant built using the OpenAI API. The assistant helps users find train details between specific stations and book trains based on user input.

## Features

- Retrieve train details between specified stations.
- Book trains based on available options.
- Interact with the assistant through a command-line interface.

## Prerequisites

- Node.js installed on your machine.
- An OpenAI API key.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your OpenAI API key. Create a `.env` file in the root directory and add your API key:

   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

## Usage

1. Run the script:

   ```bash
   node <script_name>.js
   ```

2. Interact with the assistant via the command-line interface. For example:

   ```
   Could you help me book a train from Mumbai to Pune?
   ```

## Code Overview

The main code consists of the following parts:

1. **Context Initialization:**

   ```typescript
   let context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
     {
       role: "system",
       content: "You are a helpful railway train reservation assistant.",
     },
   ];
   ```

2. **Function Definitions:**

   - `getTrainDetailsBetweenStations(source: string, destination: string)`
   - `bookTrain(train: string)`

3. **Main Function `multipleFun`:**
   This function handles the interaction with the OpenAI model and the tool functions.

   ```typescript
   async function multipleFun() {
     // Function implementation
   }
   ```

4. **Event Listener for User Input:**
   ```typescript
   process.stdin.addListener("data", async (data: string) => {
     const userInput = data.toString().trim();
     context.push({
       role: "user",
       content: userInput,
     });
     await multipleFun();
   });
   ```

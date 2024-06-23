import OpenAI from "openai";

const model = new OpenAI();

let context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "You are a helpful railway train reservation assistant.",
  },
  // {
  //   role: "user",
  //   content: "Could you help me book a train from Mumbai to Pune?",
  // },
];

async function multipleFun() {
  function getTrainDetailsBetweenStations(source: string, destination: string) {
    if (source === "Mumbai" && destination === "Pune") {
      return ["Train 1", "Train 2", "Train 3"];
    } else if (source === "Delhi" && destination === "Mumbai") {
      return ["Train 4", "Train 5", "Train 6"];
    } else {
      return ["No trains found"];
    }
  }

  function bookTrain(train: string) {
    if (train === "Train 1" || train === "Train 2" || train === "Train 3") {
      return `${train} booked successfully`;
    } else if (train === "Train 4") {
      return "Train 4 booked successfully";
    } else {
      return "No trains found";
    }
  }

  const res = await model.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
    temperature: 0,
    tools: [
      {
        type: "function",
        function: {
          name: "getTrainDetailsBetweenStations",
          description: "Get train details between two stations",
          parameters: {
            type: "object",
            properties: {
              source: {
                type: "string",
                description: "Source station",
              },
              destination: {
                type: "string",
                description: "Destination station",
              },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "bookTrain",
          description: "Book a train",
          parameters: {
            type: "object",
            properties: {
              train: {
                type: "string",
                description: "Train name",
              },
            },
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  if (
    res.choices[0].finish_reason === "tool_calls" &&
    res.choices[0].message.tool_calls
  ) {
    context.push(res.choices[0].message);

    if (
      res.choices[0].message.tool_calls[0].function.name ===
      "getTrainDetailsBetweenStations"
    ) {
      const toolCall = res.choices[0].message.tool_calls?.[0];
      const rawArguments = toolCall.function.arguments;
      const { source, destination } = JSON.parse(rawArguments);
      const trains = getTrainDetailsBetweenStations(source, destination);
      context.push({
        role: "tool",
        content: trains.join(", "),
        tool_call_id: toolCall.id,
      });
      const res2 = await model.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: context,
      });

      console.log(res2.choices[0].message.content);
    } else if (
      res.choices[0].message.tool_calls[0].function.name === "bookTrain"
    ) {
      context.push(res.choices[0].message);
      const toolCall = res.choices[0].message.tool_calls?.[0];
      const rawArguments = toolCall.function.arguments;
      const { train } = JSON.parse(rawArguments);
      const bookingStatus = bookTrain(train);
      context.push({
        role: "tool",
        content: bookingStatus,
        tool_call_id: toolCall.id,
      });
      const res2 = await model.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: context,
      });

      console.log(res2.choices[0].message.content);
    }
  }
}

process.stdin.addListener("data", async (data: string) => {
  const userInput = data.toString().trim();
  context.push({
    role: "user",
    content: userInput,
  });
  await multipleFun();
});

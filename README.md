# LangChain Implementation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gabrantoniette/gabrantoniette/main/assets/generated/languages/lang-chain-implementation-dark.svg">
  <img src="https://raw.githubusercontent.com/gabrantoniette/gabrantoniette/main/assets/generated/languages/lang-chain-implementation-light.svg" alt="Languages in lang-chain-implementation, by share of code">
</picture>

A small, readable study of how to build an HTTP chat endpoint on top of a
[LangGraph.js](https://github.com/langchain-ai/langgraphjs) state graph. A
Fastify server receives a question, runs it through a graph that **identifies
the intent** of the message and **routes** it to the right node, and returns the
result.

The only intents so far are text transformations — *make this uppercase* and
*convert to lowercase*. They are deliberately simple, so the focus stays on the
graph itself: typed state, conditional edges, one node per responsibility, and a
graph that opens in LangSmith Studio with Chat mode available.

## How it works

```
                        ┌─► uppercase ─┐
START ─► identifyIntent ┼─► lowercase ─┼─► chatResponse ─► END
                        └─► fallback ──┘
```

| Node | What it does |
| --- | --- |
| `identifyIntent` | Reads the last message and sets `command` to `uppercase` if it contains "upper", `lowercase` if it contains "lower", otherwise `unknown`. |
| `uppercase` / `lowercase` | Transform `output` accordingly. |
| `fallback` | Answers `Unknown command. Try 'make this uppercase' or 'convert to lowercase'`. |
| `chatResponse` | Wraps `output` in an `AIMessage` and appends it to `messages`. |

The state extends LangGraph's `MessagesZodState`, which is what exposes
`langgraph_type: "messages"` in the schema and lets LangSmith Studio offer **Chat**
mode. `output` and `command` have defaults, so a client only has to send `messages`.

## Endpoint

`POST /chat` with a JSON body `{ "question": "<at least 5 characters>" }`. The
response body is the resulting text.

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Make that sentence UPPER CASE"}'
# MAKE THAT SENTENCE UPPER CASE

curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"hello world"}'
# Unknown command. Try 'make this uppercase' or 'convert to lowercase'
```

## Project structure

```
├── src/
│   ├── index.ts                  starts the Fastify server on port 3000
│   ├── server.ts                 POST /chat, validates the body, invokes the graph
│   └── graph/
│       ├── graph.ts              state schema, nodes and edges
│       ├── factory.ts            graph export used by LangGraph's dev server
│       └── nodes/                one file per node
├── test/
│   └── router.e2e.test.ts        end-to-end tests through Fastify's inject()
├── langgraph.json                graph registration for the LangGraph CLI
└── .env.example
```

**Stack:** TypeScript · Node.js · Fastify · LangGraph.js · LangChain · Zod.

## Running

Requires **Node.js 24 or newer**, which runs the TypeScript sources directly.

```bash
npm install
cp .env.example .env     # add your LangSmith API key if you want tracing
npm run dev              # server on http://localhost:3000
```

### Tests

```bash
npm test                 # three end-to-end scenarios: upper, lower and unknown
npm run test:dev         # same, in watch mode
```

The tests call the endpoint in-process with Fastify's `inject()`, so they do not
open a port and need no network access.

### LangSmith Studio

```bash
npm run langgraph:serve
```

Starts the LangGraph dev server on port 2024 with the `agent` graph registered
(see `langgraph.json`). Open the Studio link it prints and use **Chat** mode.

## License

[MIT](LICENSE)

import {
    StateGraph,
    START,
    END,
    MessagesZodState,
} from '@langchain/langgraph'
import { z } from 'zod/v3'
import { identifyIntent } from './nodes/identifyIntentNodes.ts'
import { chatResponseNode } from './nodes/chatResponseNode.ts'


const GraphState = MessagesZodState.extend({
    output: z.string().default(''),
    command: z.enum(['uppercase', 'lowercase', 'unknown']).default('unknown'),
})

export type GraphState = z.infer<typeof GraphState>

export function buildGraph() {
    const workflow = new StateGraph({
        stateSchema: GraphState
    })

    .addNode("Identify Intent", identifyIntent)
    .addNode("Chat Response", chatResponseNode)

    // .addNode("IdentifyCommand", (state: GraphState) => {

    //     return {
    //         ...state,
    //         output: "",
    //     }
    // })

    .addEdge(START, "Identify Intent")
    .addEdge("Identify Intent", "Chat Response")
    .addEdge("Chat Response", END)

    return workflow.compile()
}
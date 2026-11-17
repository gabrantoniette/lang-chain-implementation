import {
    StateGraph,
    MessagesZodMeta,
    START,
    END,
} from '@langchain/langgraph'
import { withLangGraph } from '@langchain/langgraph/zod'
import { z } from 'zod'
import { BaseMessage } from 'langchain'


const GraphState = z.object({
    message: withLangGraph(
        z.custom<BaseMessage[]>(),
        MessagesZodMeta
    ),
    output: z.string(),
    command: z.enum(['uppercase', 'lowercase', 'unknown']),
}) 

export type GraphState = z.infer<typeof GraphState>

export function buildGraph() {
    const workflow = new StateGraph({
        stateSchema: GraphState
    })

    .addNode("IdentifyCommand", (state: GraphState) => {

        return {
            ...state,
            output: "test",
        }
    })

    .addEdge(START, "IdentifyCommand")
    .addEdge("IdentifyCommand", END)

    return workflow.compile()
}
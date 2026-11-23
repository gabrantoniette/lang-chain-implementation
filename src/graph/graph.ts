import {
    StateGraph,
    START,
    END,
    MessagesZodState,
} from '@langchain/langgraph'
import { z } from 'zod/v3'
import { identifyIntent } from './nodes/identifyIntentNodes.ts'
import { chatResponseNode } from './nodes/chatResponseNode.ts'
import { lowerCaseNode } from './nodes/lowerCase.ts'
import { upperCaseNode } from './nodes/upperCase.ts'
import { fallbackNode } from './nodes/fallBack.ts'


const GraphState = MessagesZodState.extend({
    output: z.string().default(''),
    command: z.enum(['uppercase', 'lowercase', 'unknown']).default('unknown'),
})

export type GraphState = z.infer<typeof GraphState>

export function buildGraph() {
    const workflow = new StateGraph({
        stateSchema: GraphState
    })

    .addNode("identifyIntent", identifyIntent)
    .addNode("chatResponse", chatResponseNode)

    .addNode('uppercase', upperCaseNode)
    .addNode('lowercase', lowerCaseNode)
    .addNode('fallback', fallbackNode)

    .addEdge(START, "identifyIntent")
    .addConditionalEdges(
        "identifyIntent",
        (state: GraphState) => {
            switch(state.command) {
                case 'uppercase':
                    return 'uppercase';
                case 'lowercase':
                    return 'lowercase';
                default:
                    return 'fallback'
            }
        },
        {
            'uppercase': 'uppercase',
            'lowercase': 'lowercase',
            'fallback': 'fallback',
        }
    )
    .addEdge("uppercase", "chatResponse")
    .addEdge("lowercase", "chatResponse")
    .addEdge("fallback", "chatResponse")

    .addEdge("chatResponse", END)

    return workflow.compile()
}
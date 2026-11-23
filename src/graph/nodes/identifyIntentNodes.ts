import { type GraphState } from "../graph.ts"

export function identifyIntent(state: GraphState): GraphState {

    const input = state.messages.at(-1)?.text.toLowerCase() ?? ""

    let command: GraphState["command"] = "unknown"

    if (input.includes("upper")) {
        command = "uppercase"
    } else if (input.includes("lower")) {
        command = "lowercase"
    }
    return {
        ...state,
        command,
        output: input,
    }
}
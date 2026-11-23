import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from '../src/server.ts'


test('Upper Case Sentence Validation', async () => {
    const app = createServer()

    const msg = "Make that sentence UPPER CASE"
    const expected = msg.toUpperCase()

    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body:{ question: msg }
    })
    assert.equal(response.statusCode, 200)
    assert.equal(response.body, expected)
})

test('Lower Case Sentence Validation', async () => {
    const app = createServer()

    const msg = "Make that sentence lower case"
    const expected = msg.toLowerCase()

    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body:{ question: msg }
    })
    assert.equal(response.statusCode, 200)
    assert.equal(response.body, expected)
})

test('Unknown Command Validation', async () => {
    const app = createServer()

    const msg = "hello world"
    const msgLower = msg.toLowerCase()
    const expected = msgLower.includes('upper')
        ? msg.toUpperCase()
        : msgLower.includes('lower')
            ? msg.toLowerCase()
            : "Unknown command. Try 'make this uppercase' or 'convert to lowercase'"

    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body:{ question: msg }
    })
    assert.equal(response.statusCode, 200)
    assert.equal(response.body, expected)
})
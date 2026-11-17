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

import { connect } from 'mqtt'

const TOPIC_PUB = 'emoji'
const TOPIC_SUB = 'log'
const BROKER = 'ws://' + location.hostname

const client = connect(BROKER)

client.on('connect', () => {
  console.log('mqtt connected')
})

client.subscribe(TOPIC_SUB)

export const onMessage = (callback?: (payload: any) => {}) => {
  client.on('message', (topic, payload, packet) => {
    // payload is buffer
    console.log(payload.toString())

    if (callback) callback(payload)
  })
}

export const publish = (message: string) => {
  client.publish(TOPIC_PUB, message)
}

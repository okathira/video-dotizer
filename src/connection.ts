import { connect } from 'mqtt'

const TOPIC_PUB = 'm5'
const TOPIC_SUB = 'log'
const BROKER = 'mqtt://test.mosquitto.org'

const client = connect(BROKER)

client.on('connect', () => {
  console.log('mqtt connected')
})

export const onMessage = (callback: (payload: any) => {}) => {
  client.on('message', (topic, payload, packet) => {
    // payload is buffer
    console.log(payload.toString())

    callback(payload)
  })
}

export const subscribe = () => {
  client.subscribe(TOPIC_SUB)
}

export const publish = (message: string) => {
  client.publish(TOPIC_PUB, message)
}

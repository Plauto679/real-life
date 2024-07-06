import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'

export const app = new Frog({})

// First frame
app.frame('/', (c) => {
  return c.res({
    image: (
      <div style={{
        alignItems: 'center',
        background: 'black',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}>
        <div style={{
          color: 'white',
          fontSize: 60,
          fontStyle: 'normal',
          lineHeight: 1.4,
          padding: '0 120px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          ¿Con quien entrenaste hoy?
        </div>
      </div>
    ),
    intents: [
      <Button action="/second">Atestigua</Button>,
    ],
  })
})

// Second frame
app.frame('/second', (c) => {
  return c.res({
    image: (
      <div style={{
        alignItems: 'center',
        background: 'linear-gradient(to right, #432889, #17101F)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}>
        <div style={{
          color: 'white',
          fontSize: 60,
          fontStyle: 'normal',
          lineHeight: 1.4,
          padding: '0 120px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          Choose an option:
        </div>
      </div>
    ),
    intents: [
      <Button action="/third" value="Ciclismo">Ciclismo</Button>,
      <Button action="/third" value="Correr">Correr</Button>,
      <Button action="/third" value="Futbol">Futbol</Button>,
      <Button action="/third" value="Padel">Padel</Button>,
    ],
  })
})

// Third frame
app.frame('/third', (c) => {
  const { buttonValue } = c
  return c.res({
    image: (
      <div style={{
        alignItems: 'center',
        background: 'linear-gradient(to right, #17101F, #432889)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}>
        <div style={{
          color: 'white',
          fontSize: 60,
          fontStyle: 'normal',
          lineHeight: 1.4,
          padding: '0 120px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          You selec
          -..ted: {buttonValue}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="ID/ENS/Address" />,
      <Button action="/fourth">Send</Button>,
    ],
  })
})


  app.use('/*', serveStatic({ root: './public' }))
  devtools(app, { serveStatic })

  if (typeof Bun !== 'undefined') {
    Bun.serve({
    fetch: app.fetch,
    port: 3000,
  })
  console.log('Server is running on port 3000')
}
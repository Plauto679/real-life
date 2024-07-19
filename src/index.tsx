import { Button, Frog, TextInput } from 'frog';
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';

export const app = new Frog({
  title: 'oncedao',
  imageAspectRatio: '1:1',
  imageOptions: {width:630,height:1200}
});

// First frame
app.frame('/', (c) => {
  return c.res({
    image: (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
        <img src="https://oncedao.s3.eu-central-1.amazonaws.com/image1.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}/>
      </div>
    ),
    intents: [
      <Button action="/second">Iniciar atestación</Button>,
    ],
  });
});
// Second frame
app.frame('/second', (c) => {
  return c.res({
    image: (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
        <img src="https://oncedao.s3.eu-central-1.amazonaws.com/image2.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}/>
      </div>
    ),
    intents: [
      <Button action="/third" value="Ciclismo">Ciclismo</Button>,
      <Button action="/third" value="Correr">Correr</Button>,
      <Button action="/third" value="Futbol">Futbol</Button>,
      <Button action="/third" value="Padel">Padel</Button>,
    ],
  });
});

// Third frame
app.frame('/third', (c) => {
  const { buttonValue } = c;
  return c.res({
    image: (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
        <img src="https://oncedao.s3.eu-central-1.amazonaws.com/image3.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}/>
      </div>
    ),
    intents: [
      <TextInput placeholder="ID/ENS/Address" />,
      <Button action="/fourth">Attest</Button>,
    ],
  });
});

// Third frame
app.frame('/fourth', (c) => {
  const { buttonValue } = c;
  return c.res({
    image: (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
        <img src="https://oncedao.s3.eu-central-1.amazonaws.com/image4.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}/>
      </div>
    ),
    intents: [
      <Button action="/fourth">View in EAS explorer</Button>,
    ],
  });
});


app.use('/*', serveStatic({ root: './public' }));
devtools(app, { serveStatic });

if (typeof Bun !== 'undefined') {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  });
  console.log('Server is running on port 3000');
}
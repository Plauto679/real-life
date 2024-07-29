import { Button, Frog, TextInput } from 'frog';
import { neynar } from 'frog/hubs';
import { serveStatic } from 'frog/serve-static';
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { abi } from '../abi.js';

export const app = new Frog<{ State: State }>({
  title: 'oncedao',
  basePath:'/api',
  imageAspectRatio: '1:1',
  imageOptions: { width: 630, height: 1200 },
  verify: false,
  initialState: {
    values:[]
  },
   hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }) // This must be updated in the future 
});
type State = {
  values: string[]
}

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
        <img src="https://oncedao.xyz/wp-content/uploads/2024/07/Attest.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
    ),
    intents: [
      <Button action="/second">Iniciar atestación</Button>,
    ],
  });
});

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
        <img src="https://oncedao.xyz/wp-content/uploads/2024/07/What.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
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

app.frame('/third', (c) => {
  const { buttonValue ,deriveState
  } = c;

  const state = deriveState(previousState => {
    if (buttonValue) previousState.values.push(buttonValue)
  })

  return c.res({
    image: (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
        <img src="https://oncedao.xyz/wp-content/uploads/2024/07/Who.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
    ),
    intents: [
      <TextInput placeholder="ID/ENS/Address" />,
      <Button.Transaction target='/attest' action="/fourth" >Attest</Button.Transaction>,
    ],
  });
});

app.frame('/fourth', (c) => {
  const { transactionId } = c;
  return c.res({
    image: (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
        <img src="https://oncedao.xyz/wp-content/uploads/2024/07/Congrats.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
    ),
    intents: [
      <Button.Link href={`https://arbiscan.io/tx/${transactionId}`}>View in explorer</Button.Link>,
    ],
  }); 
});

app.transaction('/attest', async (c) => {
  const { address, inputText,previousState } = c
  console.table([
    { Label: 'Input Text', Value: inputText },
    { Label: 'Button Value', Value: previousState.values.toString() },
    { Label: 'Address', Value: address }
  ]);
  const schemaUID = "0x6300691fac046f07d74a15cb0d6e171f16a7ae3e08de8536ae0a1bb5a111596a";
  const schemaString = "string Actividad,uint32 Dia_y_Hora,string Detalle";
  const schemaEncoder = new SchemaEncoder(schemaString);
  const encodedData = schemaEncoder.encodeData([
    { name: "Actividad", value: previousState.values.toString() || '', type: "string" },
    { name: "Dia_y_Hora", value: Math.floor(new Date().getTime() / 1000) || '', type: "uint32" },
    { name: "Detalle", value: inputText || '', type: "string" },
  ]);
  const requestData = [
    address, // Address partner
    0, // expiration time
    false, // revocable
    '0x0000000000000000000000000000000000000000000000000000000000000000', // (Optional) The UID of a referenced attestation. Use ZERO_BYTES32 if there is no reference.
    encodedData, // Encoded data
    0 // value
  ];
  const args = [
    schemaUID,
    requestData
  ];
  return c.contract({
    abi,
    chainId: 'eip155:42161',
    functionName: 'attest',
    args: [args],
    to: '0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458'
  });
});

app.use('/*', serveStatic({ root: './public' }));


if (typeof Bun !== 'undefined') {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  });
  console.log('Server is running on port 3000');
}

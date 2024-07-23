import { Button, Frog, parseEther, TextInput } from 'frog';
import { devtools } from 'frog/dev';
import { neynar } from 'frog/hubs';
import { serveStatic } from 'frog/serve-static';
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { abi } from '../abi.js';

export const app = new Frog({
  title: 'oncedao',
  imageAspectRatio: '1:1',
  imageOptions: { width: 630, height: 1200 },
 // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
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
        <img src="https://oncedao.s3.eu-central-1.amazonaws.com/image1.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
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
        <img src="https://oncedao.s3.eu-central-1.amazonaws.com/image2.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
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
  console.log('Button value:', buttonValue);

  return c.res({
    image: (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
        <img src="https://oncedao.s3.eu-central-1.amazonaws.com/image3.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
    ),
    intents: [
      <TextInput placeholder="ID/ENS/Address" />,
      <Button.Transaction target='/attest' action="/fourth">Attest</Button.Transaction>,
    ],
  });
});

// Fourth frame
app.frame('/fourth', (c) => {
  return c.res({
    image: (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
        <img src="https://oncedao.s3.eu-central-1.amazonaws.com/image4.png" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
    ),
    intents: [
      <Button action="https://explorer.attestation.id">View in EAS explorer</Button>,
    ],
  });
});

// Attestation transaction
app.transaction('/attest', async (c) => {
  const { inputText, buttonValue, address } = c;
  console.table([
    { Label: 'Input Text', Value: inputText },
    { Label: 'Button Value', Value: buttonValue },
    { Label: 'Address', Value: address }
  ]);


  const schemaUID = "0x9BA4C8CB4D768FC0944A88CA9EAE53F5A4417D5C5EEAE40F9CD7CA6B0054DE59";
  const schemaString = "bytes32 activity, address partner";
  const schemaEncoder = new SchemaEncoder(schemaString);
  const encodedData = schemaEncoder.encodeData([
    { name: "activity", value: buttonValue || '', type: "bytes32" },
    { name: "partner", value: inputText || '', type: "address" },
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
 console.log(args)
  return c.contract({
    abi,
    chainId: 'eip155:11155111',
    functionName: 'attest',
    args: [args],
    to: '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
  });
});

// app.use('/*', serveStatic({ root: './public' }));
devtools(app, { serveStatic });

if (typeof Bun !== 'undefined') {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  });
  console.log('Server is running on port 3000');
}

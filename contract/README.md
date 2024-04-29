# Guest Book Contract

Contrato inteligente para registro de datos de vehículos, para rastreo, pago de infracciones y asistente en accidentes automovilisticos

```ts
this.messages = [];


/*Clase TrackingVehicle, se basa en el contrato GuessBook, en esta clase se adquienen las mediciones de sensores colocados en el vehiculo:
  Velocidad, aceleración, posisión de (x,y,z), estado de encendido y distancia recorrida
  Las mediciones se realizan cuando la encendido tienen un valor true
  */
  @call({ payableFunction: true })
  add_reg({act_vel, act_acel, x_act, y_act, z_act,dist_rec,ini }: { act_vel:number,act_acel:number,x_act:number, y_act:number, z_act:number,dist_rec:number,ini:boolean}) {
   //se pregunta si el vehículo está encendido, si es así se registran las variables
    if(ini){
      const sender = near.predecessorAccountId();//cuenta en donde se guardarna los registros
      const registro: VehicleMonitor = {sender, act_vel, act_acel,x_act,y_act,z_act,dist_rec,ini};//datos del registro
      this.messages.push(registro);//se inserta el registro en la cuenta espacificada
    }
    
  }

  @view({})
  // Se hace una consulta de un registro guardado.
  get_reg({ from_index = 0, limit = 10 }: { from_index: number, limit: number }): VehicleMonitor[] {
    return this.messages.toArray().slice(from_index, from_index + limit);
  }


  @view({})
  //consulta del historial de registros
  total_regs(): number { return this.messages.length }

```

<br />

# Quickstart

1. Make sure you have installed [node.js](https://nodejs.org/en/download/package-manager/) >= 16.
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

<br />

## 1. Build and Deploy the Contract
You can automatically compile and deploy the contract in the NEAR testnet by running:

```bash
npm run deploy
```

Once finished, check the `neardev/dev-account` file to find the address in which the contract was deployed:

```bash
cat ./neardev/dev-account
# e.g. dev-1659899566943-21539992274727
```

<br />

## 2. Retrieve the Stored Messages
`get_messages` is a read-only method (`view` method) that returns a slice of the vector `messages`.

`View` methods can be called for **free** by anyone, even people **without a NEAR account**!

```bash
near view <dev-account> get_messages '{"from_index":0, "limit":10}'
```

<br />

## 3. Add a Message
`add_message` adds a message to the vector of `messages` and marks it as premium if the user attached more than `0.1 NEAR`.

`add_message` is a payable method for which can only be invoked using a NEAR account. The account needs to attach money and pay GAS for the transaction.

```bash
# Use near-cli to donate 1 NEAR
near call <dev-account> add_message '{"text": "a message"}' --amount 0.1 --accountId <account>
```

**Tip:** If you would like to add a message using your own account, first login into NEAR using:

```bash
# Use near-cli to login your NEAR account
near login
```

and then use the logged account to sign the transaction: `--accountId <your-account>`.

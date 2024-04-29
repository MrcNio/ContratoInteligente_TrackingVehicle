/*En este contrato se registran variables de sensores colocados en vehiculo, esto con el fin de realizar rastreos en caso de robo, 
  tambien pretende ser de ayuda para el deslinde de responsabilidades en accidentes automivilisticos, asi como un asistente en asignación 
  y pago de infracciones de transito.
  se emplean tres métodos uno para el registro de variables add_reg, y dos para consultas get_reg y total_reg
*/
import { NearBindgen, near, call, view, Vector } from 'near-sdk-js'
import { POINT_ONE, VehicleMonitor } from './model'

@NearBindgen({})
/*Clase TrackingVehicle, en esta clase se adquienen las mediciones de sensores colocados en el vehiculo:
  Velocidad, aceleración, posisión de (x,y,z), estado de encendido y distancia recorrida
  Las mediciones se realizan cuando la encendido tienen un valor true
  */
class TrackingVehicle {
  messages: Vector<VehicleMonitor> = new Vector<VehicleMonitor>("v-uid");

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
}

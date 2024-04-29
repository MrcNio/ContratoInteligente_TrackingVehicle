export const POINT_ONE = '100000000000000000000000';

export class VehicleMonitor{
  sender: string;
  velocidad: number;
  aceleracion: number;
  xpos: number;
  ypos: number;
  zpos: number;
  distancia: number;
  encendido: number;

  constructor({ sender, velocidad, aceleracion, xpos, ypos, zpos,distancia,encendido}: VehicleMonitor) {
    this.sender = sender;
    this.velocidad = velocidad;
    this.aceleracion = aceleracion;
    this.xpos = xpos;
    this.ypos = ypos;
    this.zpos = zpos;
    this.distancia = distancia;
    this.encendido = encendido;
  }
}
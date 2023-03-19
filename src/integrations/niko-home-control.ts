import controller from 'niko-home-control'

export default class NikoHomeControl {
  static defaultOptions = {
    ip: '192.168.1.36',
    port: 8000,
    timeout: 20000,
    events: true
  }
  controller;

  constructor(options = {}) {
    controller.init({...options, ...NikoHomeControl.defaultOptions})
    console.log(controller);
    
  }
}
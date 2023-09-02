
import makeMdns from 'multicast-dns'
import address from 'address';
const devices = {}

export class MdnsDiscovery {
  mdns
  /**
   * list of services and their devices
   * 
   * @example ```js
   * console.log(discovery.services) // [{name: _googlecast._tcp.local, devices: [deviceName]}]
   * ```
   */
  services: {name: string, devices?: string[]}[]

  /**
   * 
   * @example
   * discovery.devices[devicename]
   */
  devices: {
    [index: string]: {
      service?
      id?
      address?
      data?
    }
  }

  constructor() {
    this.mdns = makeMdns({loopback: false});
    this.mdns.on('response', this.handleResponse)
  }

  sendResponse() {

  }

  /**
   * manual send query and ask for the service related devices
   */
  sendQuery(deviceName, type) {
    this.mdns.query({
      questions:[{
        name: deviceName,
        type
      }]
    })
  }

  handleAnswers(answers) {
    for (const answer of answers) {
      if (answer.type === 'PTR') {
        const serviceName = answer.name
        const deviceName = answer.data
        !this.services.includes(serviceName) && this.addService(serviceName)

        if (!this.devices[deviceName]) {
          this.devices[deviceName] = {
            service: serviceName
          }
        }
        
      } else {
        console.log(answer.data)
        console.warn('found unsupported');
        console.warn(answer);
      }
    }
  }
  
  handleResponse (response) {
    this.handleAnswers(response.answers)
    const answers = response.answers
  }

  addService(name) {
    this.services.push({name})

  }

  addDevice(name, service) {
    this.devices[name] = {
      service
    }
    pubsub.publish('mdns-device-discoverd')
  }
}
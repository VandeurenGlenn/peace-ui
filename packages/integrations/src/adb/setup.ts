
import { isIP } from 'net'
import type { IntegrationSetup } from '@easy-home/types'

const setup: IntegrationSetup = {
  name: 'Setup Niko Home Control',
  info: 'someurl or extra info',
  entries: [
  {
    inputs: [
      {
        description: 'how to call this integration?',
        value: 'Niko Home Control',
        name: 'name',
        validate: (value: string) => {
          if (!value) return { error: 'name undefined'}
        }
      },
      {
        description: 'ip/hostname of the integration?',
        name: 'ip',
        value: '0.0.0.0',
        validate: (value: string) => {
          if (isIP(value) === 0) return { error: `${value} is not a valid ip` }
        }
      }
    ]
  },
  {
    /**
     * second view
     */
    description: 'Almost done!',
    options: [
      {
        description: 'enable notifications',
        name: 'notifications',
        enabled: false
      }
    ]
  }
]}

export default setup
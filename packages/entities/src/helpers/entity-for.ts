import {EntityType} from '@easy-home/types'
import { Dimmable, Light, Cover } from './../entities.js'

export default (type: EntityType) => {
  switch (type) {
    case 'light':
      return Light
    case 'dimmable':
      return Dimmable
    case 'cover':
      return Cover
    default:
      throw new Error(`Nothing found for: ${type}`)
  }
}
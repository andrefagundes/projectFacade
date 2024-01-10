import ValueObject from "../../../@shared/domain/value-object/value-object.interface"

type AddressProps = {
  street: string
  number: string
  zipCode: string
  city: string
  complement?: string
  state: string
}

export default class Address implements ValueObject {
  _street: string = ''
  _number: string = '0'
  _complement: string = ''
  _city: string = ''
  _state: string = ''
  _zipCode: string = ''

  constructor(address: AddressProps) {
    this._street = address.street
    this._number = address.number
    this._zipCode = address.zipCode
    this._city = address.city
    this._complement = address.complement
    this._state = address.state

    this.validate()
  }

  get street(): string {
    return this._street
  }

  get number(): string {
    return this._number
  }

  get complement(): string {
    return this._complement
  }

  get city(): string {
    return this._city
  }

  get state(): string {
    return this._state
  }

  get zipCode(): string {
    return this._zipCode
  }

  validate() {
    if (this._street.length === 0) {
      throw new Error('Street is required')
    }
    if (this._number.length === 0) {
      throw new Error('Number is required')
    }
    if (this._complement.length === 0) {
      throw new Error('Complement is required')
    }
    if (this._city.length === 0) {
      throw new Error('City is required')
    }
    if (this._state.length === 0) {
      throw new Error('State is required')
    }
    if (this._zipCode.length === 0) {
      throw new Error('Zip code is required')
    }
  }
}
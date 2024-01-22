import express, { Request, Response } from 'express'
import Address from '../../../modules/@shared/domain/value-object/address'
import { AddClientFacadeInputDto } from '../../../modules/client-adm/facade/client-adm.facade.interface'
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm.facade.factory'

export const clientAdmRoute = express.Router()

clientAdmRoute.post('/', async (req: Request, res: Response) => {
  const clientFacade = ClientAdmFacadeFactory.create()
  try {
    const clientDto: AddClientFacadeInputDto = {
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address({
        street: req.body.street,
        number: req.body.number,
        complement: req.body.complement,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
      }),
    }
    clientFacade.add(clientDto)
    res.status(201).send('Client add with success')
  } catch (err) {
    res.status(500).send(err)
  }
})

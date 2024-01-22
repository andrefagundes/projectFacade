import express, { Request, Response } from 'express'
import { FindInvoiceFacadeInputDto } from '../../../modules/invoice/facade/invoice.facade.interface'
import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.factory'

export const invoiceRoute = express.Router()

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
  const invoiceFacade = InvoiceFacadeFactory.create()
  try {
    const invoiceDto: FindInvoiceFacadeInputDto = {
      id: req.params.id,
    }
    const output = await invoiceFacade.find(invoiceDto)
    res.status(200).send(output)
  } catch (err) {
    res.status(500).send(err)
  }
})

import express, { Request, Response } from 'express'
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory'

export const productAdmRoute = express.Router()

productAdmRoute.post('/', async (req: Request, res: Response) => {
  try {
    const productFacade = ProductAdmFacadeFactory.create()
    const productAdmDto = {
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    }
    await productFacade.addProduct(productAdmDto)
    res.status(201).send('Product add with success')
  } catch (err) {
    res.status(500).send(err)
  }
})

productAdmRoute.get('/:id', async (req: Request, res: Response) => {
  const clientFacade = ProductAdmFacadeFactory.create()
  const output = await clientFacade.checkStock({ productId: req.params.id })

  res.format({
    json: async () => res.send(output),
  })
})

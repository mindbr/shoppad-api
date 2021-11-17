const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {
  try {
    const produtos = await prisma.produtosCompras.findMany();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtos)
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error)
    }
  }
}

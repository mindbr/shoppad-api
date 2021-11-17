const {
    Prisma,
    PrismaClient
} = require('@prisma/client')

const {
    processPrismaException
} = require('../../lib/prisma-custom');

const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {
    try {
        const data = JSON.parse(event.body)

        if (data instanceof Array) {
            const records = await prisma.produtosCompras.createMany({ data }).catch(reason => {
                const erroAmigavel = processPrismaException(reason);
    
                if (erroAmigavel) {
                    return {
                        statusCode: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ success: false, errors: [erroAmigavel] })
                    };
                } else {
                    return {
                        statusCode: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ success: false, errors: [{ error: 'NotDefined', message: 'Ocorreu um erro não catalogado!' }] })
                    };
                }
            }); 
            if (records) {
                return {
                    statusCode: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ success: true, salvos: records.count, records: data })
                };
            } else {
                return {
                    statusCode: 400,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ success: false, errors: [ { error: 'NotSaved', message: 'Registros não puderam ser salvos!' } ] })
                };
            }
        } else {
            const record = await prisma.produtosCompras.create({ data }).catch(reason => {
                const erroAmigavel = processPrismaException(reason);
    
                if (erroAmigavel) {
                    return {
                        statusCode: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ success: false, errors: [erroAmigavel] })
                    };
                } else {
                    return {
                        statusCode: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ success: false, errors: [{ error: 'NotDefined', message: 'Ocorreu um erro não catalogado!' }] })
                    };
                }
            });

            if (record) {
                res.json({ success: true, salvos: 1, record });   
            } else {
                res.status(400).json({ success: false, errors: [ { error: 'NotSaved', message: 'Registro não pode ser salvo!' } ] });   
            }
        }
    } catch (e) {
        if (e instanceof Prisma.PrismaClientRequestError) {
        if (e.code === 'P2002') {
            return {
            statusCode: 409,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Registro já existe.'
            })  
            }
        }
        }

        console.error(e)
        return { statusCode: 500 }
    }
}

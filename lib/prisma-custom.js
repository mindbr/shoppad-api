exports.processPrismaException = (reason) => {
    if (reason instanceof PrismaClientValidationError) {
        if (reason.message == null) return { error: 'ValidationError', message: 'Não foi possível realizar a pesquisa' };
        
        const message = reason.message.split('\n').reduce((acc, cur) => {
            if (cur.includes('Argument')) {
                const field = cur.substring(9, cur.indexOf(':'));
                const spec  = cur.substring(cur.indexOf('Provided '));

                acc += `Campo pesquisado [${field}]: ${spec.replace('Provided', 'Enviado').replace('expected','esperado')}`;
            }
            return acc;
        });
        
        return { error:  'ValidationError', message };
    } else {
        return { error: 'Unknown', message: reason.message };
    }
}

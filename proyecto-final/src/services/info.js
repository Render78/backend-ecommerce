export const generateUserErrorInfo = (user) => {
    return `Una o mas propiedades esta incompleta o no es valida
    Lista de propiedades:
    * first_name: Necesita ser un string, se recibió  ${user.first_name}
    * last_name: Necesita ser un string, se recibio ${user.last_name}
    * email: Necesita ser un string, se recibió ${user.email}
    * edad: Necesita ser un numero, se recibió ${user.age}
    * contraseña: Necesita ser un string se recibió ${typeof user.password}`
}

export const generateProductErrorInfo = (product) => {
    return `Una o mas propiedades esta incompleta o no es valida
    Lista de propiedades:
    * title: Necesita ser un string, se recibió  ${product.title}
    * description: Necesita ser un string, se recibio ${product.description}
    * category: Necesita ser un string, se recibió ${product.category}
    * price: Necesita ser un number, se recibió ${product.price}
    * thumbnail: Necesita ser un string, se recibió ${product.thumbnail}
    * code: Necesita ser un string, se recibió ${product.code}
    * stock: Necesita ser un number, se recibió ${product.stock}
    * status: Necesita ser un booleano, se recibió ${product.status}`
}
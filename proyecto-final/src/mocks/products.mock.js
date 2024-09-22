import { faker } from '@faker-js/faker'

const generateMockProduct = () => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    price: faker.commerce.price(1, 1000, 2, '$'),
    thumbnail: faker.image.url(),
    code: faker.string.uuid(),
    stock: faker.number.int({ min: 1, max: 100 }),
    status: faker.datatype.boolean()
});

const generateMockProducts = (count = 100) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push(generateMockProduct());
    }
    return products;
};

export default generateMockProducts;
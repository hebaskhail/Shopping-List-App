const request = require('supertest');
const app = require('../../../app');
const { products } = require('../../models/Product');
const { testProduct } = require('../dummyDate/product');
require('dotenv').config();

describe('Product API', () => {
    let authToken;
    let testProductId;



    // Before all tests, get auth token
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.USER_EMAIL,
                password: process.env.USER_PASSWORD
            });


        expect(loginResponse.status).toBe(200);
        authToken = loginResponse.body.token;
    });

    // Clear products after each test
    afterEach(() => {
        products.clear();
    });

    describe('POST /api/product', () => {
        it('should create a new product with valid data', async () => {
            const response = await request(app)
                .post('/api/product')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testProduct);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                success: true,
                statusCode: 201,
                message: 'Product created successfully',
                data: expect.objectContaining({
                    id: expect.any(Number),
                    name: testProduct.name,
                    quantity: testProduct.quantity,
                    price: testProduct.price
                })
            });

            testProductId = response.body.data.id;
        });

        it('should return validation error for negative quantity', async () => {
            const invalidProduct = {
                ...testProduct,
                quantity: -10
            };

            const response = await request(app)
                .post('/api/product')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidProduct);

            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                success: false,
                statusCode: 422,
                message: 'Quantity must be a non-negative integer',
                data: null
            });
        });

        it('should return validation error for negative price', async () => {
            const invalidProduct = {
                ...testProduct,
                price: -99.99
            };

            const response = await request(app)
                .post('/api/product')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidProduct);

            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                success: false,
                statusCode: 422,
                message: 'Price must be a number greater than 0',
                data: null
            });
        });

        it('should return validation error for empty name', async () => {
            const invalidProduct = {
                ...testProduct,
                name: ''
            };

            const response = await request(app)
                .post('/api/product')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidProduct);

            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                success: false,
                statusCode: 422,
                message: 'Name is required',
                data: null
            });
        });


    });

    describe('GET /api/product', () => {
        beforeEach(async () => {
            // Create a test product
            const response = await request(app)
                .post('/api/product')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testProduct);

            testProductId = response.body.data.id;
        });

        it('should return all products', async () => {
            const response = await request(app)
                .get('/api/product')
                .set('Authorization', `Bearer ${authToken}`)
                .query({ limit: 10, offset: 0 });


            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                statusCode: 200,
                message: 'Success',
                data: expect.objectContaining({
                    products: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: testProduct.name,
                            quantity: testProduct.quantity,
                            price: testProduct.price
                        })
                    ]),
                    total: expect.any(Number),

                })
            });
        });


        it('should return empty array when no products exist', async () => {
            products.clear();
            const response = await request(app)
                .get('/api/product')
                .set('Authorization', `Bearer ${authToken}`)
                .query({ limit: 10, offset: 0 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: 'Success',
                statusCode: 200,
                data: expect.objectContaining({
                    products:
                        []

                })
            });
        });
    });

    describe('PUT /api/product/:id', () => {
        beforeEach(async () => {
            // Create a test product
            const response = await request(app)
                .post('/api/product')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testProduct);

            testProductId = response.body.data.id;
        });

        it('should update product with valid data', async () => {
            const updateData = {
                name: "Updated Product",
                quantity: 50,
                price: 149.99
            };

            const response = await request(app)
                .put(`/api/product/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                statusCode: 200,
                message: 'Product updated successfully',
                data: expect.objectContaining({
                    id: testProductId,
                    ...updateData
                })
            });
        });

        it('should allow partial updates', async () => {
            const partialUpdate = {
                price: 199.99
            };

            const response = await request(app)
                .put(`/api/product/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(partialUpdate);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                statusCode: 200,
                message: 'Product updated successfully',
                data: expect.objectContaining({
                    id: testProductId,
                    name: testProduct.name,
                    quantity: testProduct.quantity,
                    price: partialUpdate.price
                })
            });
        });

        it('should return 404 for non-existent product', async () => {
            const response = await request(app)
                .put('/api/product/999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ price: 199.99 });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                statusCode: 404,
                message: 'Product not found',
                data: null
            });
        });
    });

    describe('DELETE /api/product/:id', () => {
        beforeEach(async () => {
            // Create a test product
            const response = await request(app)
                .post('/api/product')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testProduct);

            testProductId = response.body.data.id;
        });

        it('should delete existing product', async () => {
            const response = await request(app)
                .delete(`/api/product/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                statusCode: 200,
                message: 'Product deleted successfully',
            });


        });

        it('should return 404 for non-existent product', async () => {
            const response = await request(app)
                .delete('/api/product/999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                statusCode: 404,
                message: 'Product not found',
                data: null
            });
        });
    });
}); 
const request = require('supertest');
const app = require('../../app');
const { products } = require('../models/Product');
const { shoppingList } = require('../models/ShoppingList');
require('dotenv').config();

describe('Shopping List API', () => {
    let authToken;
    let testProductId;

    // Test data
    const testProduct = {
        name: "Test Product",
        quantity: 100,
        price: 99.99
    };


    // Before all tests, login and create a test product
    beforeAll(async () => {
        // Login to get auth token
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.USER_EMAIL,
                password: process.env.USER_PASSWORD
            });

        expect(loginResponse.status).toBe(200);
        authToken = loginResponse.body.token;

        // Create a test product
        const productResponse = await request(app)
            .post('/api/product')
            .set('Authorization', `Bearer ${authToken}`)
            .send(testProduct);

        testProductId = productResponse.body.data.id;
    });


    // Clear all data after all tests
    afterAll(() => {
        products.clear();
        shoppingList.items.clear();
    });

    describe('POST /api/shopping-list/:productId', () => {
        it('should add a product to shopping list with quantity of 1', async () => {
            const response = await request(app)
                .post(`/api/shopping-list/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                statusCode: 200,
                message: 'Product added to shopping list',
                data: expect.objectContaining({
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            productId: testProductId,
                            quantity: 1,
                            price: testProduct.price
                        })
                    ]),
                    total: testProduct.price
                })
            });
        });

        it('should fail when product has no available quantity', async () => {
            // First, update product to have 0 quantity
            await request(app)
                .put(`/api/product/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ quantity: 0 });

            const response = await request(app)
                .post(`/api/shopping-list/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                statusCode: 400,
                message: 'No more stock available to add this product',
                data: null
            });
        });

        it('should fail when product does not exist', async () => {
            const response = await request(app)
                .post(`/api/shopping-list/999`)
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

    describe('GET /api/shopping-list', () => {
        beforeEach(async () => {
            // Add a product to shopping list before each test
            await request(app)
                .post(`/api/shopping-list/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`);
        });

        it('should get shopping list with correct total', async () => {
            const response = await request(app)
                .get('/api/shopping-list')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                statusCode: 200,
                message: 'Shopping list retrieved successfully',
                data: expect.objectContaining({
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            productId: testProductId,
                            name: testProduct.name,
                            quantity: 1,
                            price: testProduct.price,
                            subTotal: testProduct.price
                        })
                    ]),
                    total: testProduct.price
                })
            });
        });

        it('should return empty shopping list when no items added', async () => {

            shoppingList.items.clear();

            const response = await request(app)
                .get('/api/shopping-list')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                statusCode: 200,
                message: 'Shopping list retrieved successfully',
                data: {
                    items: [],
                    total: 0
                }
            });
        });
    });

    describe('DELETE /api/shopping-list/:productId', () => {
        beforeEach(async () => {
            // Clear shopping list first
            shoppingList.items.clear();

            // First ensure we have a product with sufficient quantity
            const updateResponse = await request(app)
                .put(`/api/product/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    quantity: 10
                });

            // Then add it to shopping list
            const addResponse = await request(app)
                .post(`/api/shopping-list/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`);

            // Verify the shopping list has exactly one item
            const listResponse = await request(app)
                .get('/api/shopping-list')
                .set('Authorization', `Bearer ${authToken}`);
            console.log("Shopping list state before test:", JSON.stringify(listResponse.body.data.items, null, 2));
        });

        it('should remove product from shopping list', async () => {
            // Get current shopping list state
            const beforeDelete = await request(app)
                .get('/api/shopping-list')
                .set('Authorization', `Bearer ${authToken}`);
            
            // Ensure we have exactly one item before deletion
            expect(beforeDelete.body.data.items).toHaveLength(1);
            expect(beforeDelete.body.data.items[0].quantity).toBe(1);

            const response = await request(app)
                .delete(`/api/shopping-list/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                statusCode: 200,
                message: 'Product removed from shopping list',
                data: expect.objectContaining({
                    items: [],
                    total: 0
                })
            });

            // Verify the shopping list is empty after deletion
            const afterDelete = await request(app)
                .get('/api/shopping-list')
                .set('Authorization', `Bearer ${authToken}`);
            expect(afterDelete.body.data.items).toHaveLength(0);
        });

        it('should fail when removing non-existent product', async () => {
            const response = await request(app)
                .delete('/api/shopping-list/999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                statusCode: 404,
                message: 'Product not in shopping list',
                data: null
            });
        });
    });

    describe('Shopping List Business Logic', () => {
        it('should update shopping list total when product price changes', async () => {
            // First ensure we have a product with sufficient quantity
            await request(app)
                .put(`/api/product/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    quantity: 10 // Reset quantity to ensure we have stock
                });

            // Add product to shopping list
            await request(app)
                .post(`/api/shopping-list/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`);

            // Update product price
            const newPrice = 150;
            await request(app)
                .put(`/api/product/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    price: newPrice
                });

            // Get shopping list and verify new total
            const response = await request(app)
                .get('/api/shopping-list')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.items[0].price).toBe(newPrice);
        });

        it('should remove item from shopping list when product is deleted', async () => {
            // Add product to shopping list
            await request(app)
                .post(`/api/shopping-list/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`);

            // Delete the product
            await request(app)
                .delete(`/api/product/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`);

            // Get shopping list and verify item was removed
            const response = await request(app)
                .get('/api/shopping-list')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.items).toHaveLength(0);
            expect(response.body.data.total).toBe(0);
        });
    });
});

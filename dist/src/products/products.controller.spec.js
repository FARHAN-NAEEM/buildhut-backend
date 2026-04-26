"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
describe('ProductsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [products_controller_1.ProductsController],
            providers: [products_service_1.ProductsService],
        }).compile();
        controller = module.get(products_controller_1.ProductsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=products.controller.spec.js.map
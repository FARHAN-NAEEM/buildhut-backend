"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
describe('OrdersController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [orders_controller_1.OrdersController],
            providers: [orders_service_1.OrdersService],
        }).compile();
        controller = module.get(orders_controller_1.OrdersController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=orders.controller.spec.js.map
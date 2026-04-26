"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let PaymentService = class PaymentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async initPayment(orderId) {
        var _a, _b, _c;
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true },
        });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        const formData = {
            store_id: process.env.AAMARPAY_STORE_ID,
            signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
            tran_id: order.id,
            success_url: `http://localhost:5000/payment/success/${order.id}`,
            fail_url: `http://localhost:5000/payment/fail/${order.id}`,
            cancel_url: `http://localhost:5000/payment/cancel/${order.id}`,
            amount: order.totalAmount,
            currency: 'BDT',
            desc: 'BuildHut Product Purchase',
            cus_name: ((_a = order.user) === null || _a === void 0 ? void 0 : _a.name) || 'Guest User',
            cus_email: ((_b = order.user) === null || _b === void 0 ? void 0 : _b.email) || 'guest@buildhut.com',
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: ((_c = order.user) === null || _c === void 0 ? void 0 : _c.phone) || '01711000000',
            type: 'json'
        };
        try {
            const { data } = await axios_1.default.post(process.env.AAMARPAY_URL, formData);
            if (data && data.result === 'true') {
                return { url: data.payment_url };
            }
            else {
                return {
                    message: "⚠️ Aamarpay did not return a Gateway URL. Check error:",
                    errorDetails: data
                };
            }
        }
        catch (error) {
            throw new common_1.BadRequestException('Payment initiation failed with Aamarpay');
        }
    }
    async paymentSuccess(orderId) {
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'PROCESSING' },
        });
        return `
      <html>
        <body>
          <script>
            window.location.href="http://localhost:3000/payment/success?tran_id=${orderId}";
          </script>
        </body>
      </html>
    `;
    }
    async paymentFail(orderId) {
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });
        return `
      <html>
        <body>
          <script>
            window.location.href="http://localhost:3000/payment/fail";
          </script>
        </body>
      </html>
    `;
    }
    async paymentCancel(orderId) {
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });
        return `
      <html>
        <body>
          <script>
            window.location.href="http://localhost:3000/payment/fail";
          </script>
        </body>
      </html>
    `;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map
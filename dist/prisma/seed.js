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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const bcrypt = __importStar(require("bcrypt"));
const initial_catalog_1 = require("../src/catalog/initial-catalog");
dotenv.config();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg(pool) });
const slugify = (value) => value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
async function upsertCategory(seed, parentId, level, sortOrder, path = []) {
    var _a;
    const nextPath = [...path, seed.name];
    const slug = slugify(nextPath.join('-'));
    const category = await prisma.category.upsert({
        where: { slug },
        create: {
            name: seed.name,
            slug,
            parentId,
            level,
            sortOrder,
            status: 'ACTIVE',
        },
        update: {
            name: seed.name,
            parentId,
            level,
            sortOrder,
            status: 'ACTIVE',
        },
    });
    for (const [index, child] of ((_a = seed.children) !== null && _a !== void 0 ? _a : []).entries()) {
        await upsertCategory(child, category.id, level + 1, index, nextPath);
    }
}
const demoProducts = [
    { name: 'ASUS ROG Strix Gaming Laptop', sku: 'DEMO-LAPTOP-ROG', categorySlug: 'laptop-asus', image: '/uploads/demo/laptop.svg', shortDescription: 'ROG gaming laptop, RTX graphics, RGB keyboard', componentType: 'other-component', meta: { power_watt: '180' } },
    { name: 'Lenovo Legion 5 Gaming Laptop', sku: 'DEMO-LAPTOP-LEGION5', categorySlug: 'laptop-lenovo', image: '/uploads/demo/laptop.svg', shortDescription: 'Legion gaming laptop with high refresh display', componentType: 'other-component', meta: { power_watt: '170' } },
    { name: 'HP Omen Gaming Laptop', sku: 'DEMO-LAPTOP-OMEN', categorySlug: 'laptop-hp', image: '/uploads/demo/laptop.svg', shortDescription: 'Premium Omen gaming laptop with thermal cooling', componentType: 'other-component', meta: { power_watt: '165' } },
    { name: 'Intel Core i9 Processor', sku: 'DEMO-CPU-I9', categorySlug: 'desktop-and-server-desktop-component-processor', image: '/uploads/demo/cpu.svg', shortDescription: 'High-end Intel Core i9 desktop processor', componentType: 'cpu', meta: { cpu_socket: 'LGA1700', socket: 'LGA1700', generation: '14th Gen', power_watt: '125' } },
    { name: 'AMD Ryzen 9 Processor', sku: 'DEMO-CPU-R9', categorySlug: 'desktop-and-server-desktop-component-processor', image: '/uploads/demo/cpu.svg', shortDescription: 'AMD Ryzen 9 processor for premium builds', componentType: 'cpu', meta: { cpu_socket: 'AM5', socket: 'AM5', generation: 'Ryzen 7000', power_watt: '120' } },
    { name: 'Intel Core i7 Processor', sku: 'DEMO-CPU-I7', categorySlug: 'desktop-and-server-desktop-component-processor', image: '/uploads/demo/cpu.svg', shortDescription: 'Intel Core i7 gaming and productivity CPU', componentType: 'cpu', meta: { cpu_socket: 'LGA1700', socket: 'LGA1700', generation: '13th Gen', power_watt: '95' } },
    { name: 'ASUS ROG Motherboard', sku: 'DEMO-MB-ROG', categorySlug: 'desktop-and-server-desktop-component-motherboard', image: '/uploads/demo/motherboard.svg', shortDescription: 'ROG motherboard with DDR5 and PCIe support', componentType: 'motherboard', meta: { motherboard_socket: 'AM5', socket: 'AM5', motherboard_ram_type: 'DDR5', ram_type: 'DDR5', form_factor: 'ATX', supported_generation: 'Ryzen 7000', power_watt: '55' } },
    { name: 'MSI Gaming Motherboard', sku: 'DEMO-MB-MSI', categorySlug: 'desktop-and-server-desktop-component-motherboard', image: '/uploads/demo/motherboard.svg', shortDescription: 'MSI gaming motherboard for Intel builds', componentType: 'motherboard', meta: { motherboard_socket: 'LGA1700', socket: 'LGA1700', motherboard_ram_type: 'DDR5', ram_type: 'DDR5', form_factor: 'ATX', supported_generation: '13th/14th Gen', power_watt: '50' } },
    { name: 'Gigabyte AORUS Motherboard', sku: 'DEMO-MB-AORUS', categorySlug: 'desktop-and-server-desktop-component-motherboard', image: '/uploads/demo/motherboard.svg', shortDescription: 'AORUS motherboard with gaming-grade VRM', componentType: 'motherboard', meta: { motherboard_socket: 'AM5', socket: 'AM5', motherboard_ram_type: 'DDR5', ram_type: 'DDR5', form_factor: 'mATX', supported_generation: 'Ryzen 7000', power_watt: '48' } },
    { name: 'Samsung Odyssey Gaming Monitor', sku: 'DEMO-MONITOR-ODYSSEY', categorySlug: 'monitor-samsung', image: '/uploads/demo/monitor.svg', shortDescription: 'Curved high refresh Samsung Odyssey monitor', componentType: 'monitor', meta: { power_watt: '45' } },
    { name: 'LG UltraGear Monitor', sku: 'DEMO-MONITOR-ULTRAGEAR', categorySlug: 'monitor-lg', image: '/uploads/demo/monitor.svg', shortDescription: 'LG UltraGear gaming monitor for esports', componentType: 'monitor', meta: { power_watt: '42' } },
    { name: 'ASUS TUF Gaming Monitor', sku: 'DEMO-MONITOR-TUF', categorySlug: 'monitor-asus', image: '/uploads/demo/monitor.svg', shortDescription: 'ASUS TUF high refresh gaming display', componentType: 'monitor', meta: { power_watt: '40' } },
    { name: 'Corsair Vengeance RGB RAM', sku: 'DEMO-RAM-CORSAIR', categorySlug: 'desktop-and-server-desktop-component-desktop-ram', image: '/uploads/demo/ram.svg', shortDescription: 'Corsair Vengeance RGB DDR5 RAM', componentType: 'ram', meta: { ram_type: 'DDR5', ddr_type: 'DDR5', capacity: '32GB', bus_speed: '6000MHz', power_watt: '8' } },
    { name: 'G.Skill Trident Z RGB RAM', sku: 'DEMO-RAM-GSKILL', categorySlug: 'desktop-and-server-desktop-component-desktop-ram', image: '/uploads/demo/ram.svg', shortDescription: 'G.Skill Trident Z DDR5 RGB memory', componentType: 'ram', meta: { ram_type: 'DDR5', ddr_type: 'DDR5', capacity: '32GB', bus_speed: '6400MHz', power_watt: '8' } },
    { name: 'Kingston Fury Beast RAM', sku: 'DEMO-RAM-KINGSTON', categorySlug: 'desktop-and-server-desktop-component-desktop-ram', image: '/uploads/demo/ram.svg', shortDescription: 'Kingston Fury Beast DDR4 memory kit', componentType: 'ram', meta: { ram_type: 'DDR4', ddr_type: 'DDR4', capacity: '16GB', bus_speed: '3200MHz', power_watt: '6' } },
    { name: 'Samsung 990 Pro NVMe SSD', sku: 'DEMO-SSD-990PRO', categorySlug: 'desktop-and-server-storage-internal-ssd', image: '/uploads/demo/storage.svg', shortDescription: 'Samsung 990 Pro NVMe performance SSD', componentType: 'ssd', meta: { storage_interface: 'NVMe', storage_type: 'SSD/NVMe', power_watt: '7' } },
    { name: 'WD Black SN850X SSD', sku: 'DEMO-SSD-SN850X', categorySlug: 'desktop-and-server-storage-internal-ssd', image: '/uploads/demo/storage.svg', shortDescription: 'WD Black SN850X NVMe gaming SSD', componentType: 'ssd', meta: { storage_interface: 'NVMe', storage_type: 'SSD/NVMe', power_watt: '7' } },
    { name: 'Seagate Barracuda HDD', sku: 'DEMO-HDD-BARRACUDA', categorySlug: 'desktop-and-server-storage-internal-hdd', image: '/uploads/demo/storage.svg', shortDescription: 'Seagate Barracuda SATA hard drive', componentType: 'hdd', meta: { storage_interface: 'SATA', storage_type: 'HDD/SATA', power_watt: '9' } },
    { name: 'NVIDIA RTX 4090 Graphics Card', sku: 'DEMO-GPU-RTX4090', categorySlug: 'desktop-and-server-desktop-component-graphics-card', image: '/uploads/demo/gpu.svg', shortDescription: 'NVIDIA RTX 4090 flagship graphics card', componentType: 'graphics-card', meta: { gpu_power_requirement: '450', required_watt: '450', interface: 'PCIe 4.0', power_watt: '450' } },
    { name: 'NVIDIA RTX 4080 Graphics Card', sku: 'DEMO-GPU-RTX4080', categorySlug: 'desktop-and-server-desktop-component-graphics-card', image: '/uploads/demo/gpu.svg', shortDescription: 'NVIDIA RTX 4080 high-end graphics card', componentType: 'graphics-card', meta: { gpu_power_requirement: '320', required_watt: '320', interface: 'PCIe 4.0', power_watt: '320' } },
    { name: 'AMD Radeon RX 7900 XTX', sku: 'DEMO-GPU-7900XTX', categorySlug: 'desktop-and-server-desktop-component-graphics-card', image: '/uploads/demo/gpu.svg', shortDescription: 'AMD Radeon RX 7900 XTX graphics card', componentType: 'graphics-card', meta: { gpu_power_requirement: '355', required_watt: '355', interface: 'PCIe 4.0', power_watt: '355' } },
    { name: 'Gaming Keyboard', sku: 'DEMO-ACC-KEYBOARD', categorySlug: 'desktop-and-server-desktop-component-keyboard', image: '/uploads/demo/accessory.svg', shortDescription: 'Mechanical RGB gaming keyboard', componentType: 'keyboard', meta: { power_watt: '5' } },
    { name: 'Gaming Mouse', sku: 'DEMO-ACC-MOUSE', categorySlug: 'desktop-and-server-desktop-component-mouse', image: '/uploads/demo/accessory.svg', shortDescription: 'High DPI wired gaming mouse', componentType: 'mouse', meta: { power_watt: '3' } },
    { name: 'Gaming Headset', sku: 'DEMO-ACC-HEADSET', categorySlug: 'sound-headphone', image: '/uploads/demo/accessory.svg', shortDescription: 'Surround sound gaming headset', componentType: 'other-component', meta: { power_watt: '4' } },
    { name: 'CPU Cooler', sku: 'DEMO-ACC-CPUCOOLER', categorySlug: 'desktop-and-server-desktop-component-cpu-cooler', image: '/uploads/demo/accessory.svg', shortDescription: 'RGB liquid CPU cooler', componentType: 'cpu-cooler', meta: { power_watt: '12' } },
    { name: 'Power Supply', sku: 'DEMO-ACC-PSU', categorySlug: 'desktop-and-server-desktop-component-power-supply', image: '/uploads/demo/accessory.svg', shortDescription: '850W 80+ Gold modular power supply', componentType: 'power-supply', meta: { psu_watt: '850', watt: '850', power_watt: '0' } },
    { name: 'Casing Fan', sku: 'DEMO-ACC-FAN', categorySlug: 'desktop-and-server-desktop-component-casing-fan', image: '/uploads/demo/accessory.svg', shortDescription: 'ARGB casing fan for airflow', componentType: 'casing-fan', meta: { power_watt: '4' } },
    { name: 'ATX Gaming Casing', sku: 'DEMO-ACC-CASING', categorySlug: 'desktop-and-server-desktop-component-casing', image: '/uploads/demo/accessory.svg', shortDescription: 'Tempered glass ATX gaming casing', componentType: 'casing', meta: { form_factor: 'ATX/mATX/ITX', supported_form_factor: 'ATX/mATX/ITX', power_watt: '0' } },
    { name: 'IP Dome CC Camera', sku: 'DEMO-CC-CAMERA-IP', categorySlug: 'security-ip-camera', image: '/uploads/demo/cctv.svg', shortDescription: 'IP dome security camera with night vision', componentType: 'camera', meta: { camera_type: 'IP', resolution: '4MP', power_type: 'PoE', power_watt: '8' } },
    { name: '8 Channel NVR Recorder', sku: 'DEMO-CC-NVR-8CH', categorySlug: 'security-nvr', image: '/uploads/demo/cctv.svg', shortDescription: '8 channel NVR for IP camera system', componentType: 'recorder', meta: { recorder_type: 'IP', channel_support: '8 Channel', storage_support: 'SATA', power_watt: '18' } },
    { name: 'Security Surveillance HDD', sku: 'DEMO-CC-HDD', categorySlug: 'desktop-and-server-storage-internal-hdd', image: '/uploads/demo/storage.svg', shortDescription: 'Surveillance-grade SATA HDD', componentType: 'storage', meta: { storage_interface: 'SATA', storage_support: 'SATA', power_watt: '8' } },
    { name: 'PoE Power Source', sku: 'DEMO-CC-POWER', categorySlug: 'accessories-electrical-power-power-strip', image: '/uploads/demo/accessory.svg', shortDescription: 'PoE power source for IP camera', componentType: 'power-source', meta: { power_type: 'PoE', output_voltage: '48V', power_watt: '0' } },
    { name: 'Cat6 Network Cable', sku: 'DEMO-CC-CABLE', categorySlug: 'network-network-cable', image: '/uploads/demo/accessory.svg', shortDescription: 'Cat6 cable for IP camera installation', componentType: 'cable', meta: { cable_type: 'IP/Cat6', power_watt: '0' } },
    { name: 'Camera Connector Kit', sku: 'DEMO-CC-CONNECTOR', categorySlug: 'network-network-accessories-connector', image: '/uploads/demo/accessory.svg', shortDescription: 'Connector kit for CCTV installation', componentType: 'connector', meta: { power_watt: '0' } },
    { name: 'PlayStation Gaming Console', sku: 'DEMO-GAMING-CONSOLE', categorySlug: 'gaming-gaming-component-gaming-console', image: '/uploads/demo/accessory.svg', shortDescription: 'Premium gaming console for entertainment setup', componentType: 'other-component', meta: { power_watt: '200' } },
    { name: 'Wireless Gaming Controller', sku: 'DEMO-GAMING-CONTROLLER', categorySlug: 'gaming-gaming-component-gaming-controller', image: '/uploads/demo/accessory.svg', shortDescription: 'Wireless controller for PC and console gaming', componentType: 'other-component', meta: { power_watt: '2' } },
    { name: 'VR Gaming Headset', sku: 'DEMO-GAMING-VR', categorySlug: 'gaming-gaming-component-virtual-reality-vr', image: '/uploads/demo/accessory.svg', shortDescription: 'Virtual reality headset for immersive gaming', componentType: 'other-component', meta: { power_watt: '18' } },
    { name: 'Samsung Galaxy Tablet', sku: 'DEMO-TAB-SAMSUNG', categorySlug: 'tablet-pc-regular-tablet-pc-samsung', image: '/uploads/demo/laptop.svg', shortDescription: 'Slim Android tablet for work and media', componentType: 'other-component', meta: { power_watt: '18' } },
    { name: 'Lenovo Tab Performance Edition', sku: 'DEMO-TAB-LENOVO', categorySlug: 'tablet-pc-regular-tablet-pc-lenovo', image: '/uploads/demo/laptop.svg', shortDescription: 'Lenovo tablet with bright display and long battery', componentType: 'other-component', meta: { power_watt: '16' } },
    { name: 'Apple iPad Demo Edition', sku: 'DEMO-TAB-IPAD', categorySlug: 'tablet-pc-apple-tablet-pc-ipad', image: '/uploads/demo/laptop.svg', shortDescription: 'Premium tablet for creative and office workflows', componentType: 'other-component', meta: { power_watt: '20' } },
    { name: 'Laser Document Printer', sku: 'DEMO-PRINTER-LASER', categorySlug: 'printer-document-printer-laser-printer', image: '/uploads/demo/accessory.svg', shortDescription: 'Fast laser printer for office documents', componentType: 'other-component', meta: { power_watt: '400' } },
    { name: 'Ink Tank Color Printer', sku: 'DEMO-PRINTER-INK', categorySlug: 'printer-document-printer-ink-printer', image: '/uploads/demo/accessory.svg', shortDescription: 'Color ink printer for home and office', componentType: 'other-component', meta: { power_watt: '20' } },
    { name: 'POS Receipt Printer', sku: 'DEMO-PRINTER-POS', categorySlug: 'printer-pos-printer', image: '/uploads/demo/accessory.svg', shortDescription: 'Compact POS receipt printer for retail checkout', componentType: 'other-component', meta: { power_watt: '35' } },
    { name: 'DSLR Camera Body', sku: 'DEMO-CAMERA-DSLR', categorySlug: 'camera-digital-slr-camera-dslr-camera', image: '/uploads/demo/cctv.svg', shortDescription: 'Professional DSLR camera for photography', componentType: 'other-component', meta: { power_watt: '12' } },
    { name: 'Mirrorless Camera Kit', sku: 'DEMO-CAMERA-MIRRORLESS', categorySlug: 'camera-digital-slr-camera-mirrorless-camera', image: '/uploads/demo/cctv.svg', shortDescription: 'Mirrorless camera kit for creators', componentType: 'other-component', meta: { power_watt: '10' } },
    { name: 'Webcam Streaming Camera', sku: 'DEMO-CAMERA-WEBCAM', categorySlug: 'camera-webcam', image: '/uploads/demo/cctv.svg', shortDescription: 'Full HD webcam for meetings and streaming', componentType: 'camera', meta: { camera_type: 'IP', resolution: '1080p', power_type: 'USB', power_watt: '5' } },
    { name: 'Analog Bullet CC Camera', sku: 'DEMO-SECURITY-ANALOG-CAM', categorySlug: 'security-cc-camera', image: '/uploads/demo/cctv.svg', shortDescription: 'Analog bullet camera for CCTV systems', componentType: 'camera', meta: { camera_type: 'Analog', resolution: '2MP', power_type: '12V', power_watt: '7' } },
    { name: '4 Channel DVR Recorder', sku: 'DEMO-SECURITY-DVR', categorySlug: 'security-dvr', image: '/uploads/demo/cctv.svg', shortDescription: '4 channel DVR for analog CCTV setup', componentType: 'recorder', meta: { recorder_type: 'Analog', channel_support: '4 Channel', storage_support: 'SATA', power_watt: '14' } },
    { name: 'Smart Door Bell Camera', sku: 'DEMO-SECURITY-DOORBELL', categorySlug: 'security-home-security-smart-door-bell', image: '/uploads/demo/cctv.svg', shortDescription: 'Smart door bell with camera and mobile alerts', componentType: 'camera', meta: { camera_type: 'IP', resolution: '2MP', power_type: 'Battery', power_watt: '4' } },
    { name: 'WiFi 6 Network Router', sku: 'DEMO-NETWORK-ROUTER', categorySlug: 'network-network-router', image: '/uploads/demo/accessory.svg', shortDescription: 'Dual-band WiFi 6 router for gaming and streaming', componentType: 'router', meta: { power_watt: '12' } },
    { name: 'Gigabit Network Switch', sku: 'DEMO-NETWORK-SWITCH', categorySlug: 'network-network-switch', image: '/uploads/demo/accessory.svg', shortDescription: 'Gigabit switch for office and camera networks', componentType: 'other-component', meta: { power_watt: '18' } },
    { name: 'USB WiFi Adapter', sku: 'DEMO-NETWORK-WIFI', categorySlug: 'network-wifi-adapter', image: '/uploads/demo/accessory.svg', shortDescription: 'Compact WiFi adapter for desktops', componentType: 'other-component', meta: { power_watt: '2' } },
    { name: 'Bluetooth Speaker', sku: 'DEMO-SOUND-SPEAKER', categorySlug: 'sound-speaker', image: '/uploads/demo/accessory.svg', shortDescription: 'Portable Bluetooth speaker with deep bass', componentType: 'other-component', meta: { power_watt: '15' } },
    { name: 'Studio Microphone', sku: 'DEMO-SOUND-MIC', categorySlug: 'sound-microphone', image: '/uploads/demo/accessory.svg', shortDescription: 'USB studio microphone for streaming', componentType: 'other-component', meta: { power_watt: '5' } },
    { name: 'Wireless Earbuds', sku: 'DEMO-SOUND-EARBUDS', categorySlug: 'sound-earbuds', image: '/uploads/demo/accessory.svg', shortDescription: 'Premium wireless earbuds with low latency', componentType: 'other-component', meta: { power_watt: '2' } },
    { name: 'Flatbed Scanner', sku: 'DEMO-OFFICE-SCANNER', categorySlug: 'office-items-scanner-flatbed-scanner', image: '/uploads/demo/accessory.svg', shortDescription: 'Flatbed scanner for office documents', componentType: 'other-component', meta: { power_watt: '18' } },
    { name: 'Conference Projector', sku: 'DEMO-OFFICE-PROJECTOR', categorySlug: 'office-items-projector', image: '/uploads/demo/monitor.svg', shortDescription: 'Bright projector for office presentations', componentType: 'display', meta: { power_watt: '220' } },
    { name: 'Barcode QR Scanner', sku: 'DEMO-OFFICE-BARCODE', categorySlug: 'office-items-pos-system-barcode-and-qr-scanner', image: '/uploads/demo/accessory.svg', shortDescription: 'Barcode and QR scanner for POS systems', componentType: 'other-component', meta: { power_watt: '3' } },
    { name: 'Bluetooth Adapter', sku: 'DEMO-ACCESSORY-BT', categorySlug: 'accessories-cable-converter-hub-bluetooth-adapter', image: '/uploads/demo/accessory.svg', shortDescription: 'USB Bluetooth adapter for desktop PCs', componentType: 'accessories', meta: { power_watt: '1' } },
    { name: 'Power Strip Surge Protector', sku: 'DEMO-ACCESSORY-POWERSTRIP', categorySlug: 'accessories-electrical-power-power-strip', image: '/uploads/demo/accessory.svg', shortDescription: 'Power strip with surge protection', componentType: 'power-source', meta: { power_type: 'AC', output_voltage: '220V', power_watt: '0' } },
    { name: 'USB-C Wall Charger', sku: 'DEMO-ACCESSORY-CHARGER', categorySlug: 'accessories-tablet-accessories-wall-charger', image: '/uploads/demo/accessory.svg', shortDescription: 'Fast USB-C wall charger for devices', componentType: 'power-source', meta: { power_type: 'USB-C', output_voltage: '20V', power_watt: '0' } },
];
async function upsertDemoProducts() {
    var _a, _b, _c;
    for (const product of demoProducts) {
        const category = await prisma.category.findUnique({ where: { slug: product.categorySlug } });
        if (!category) {
            console.warn(`Skipping ${product.name}: missing category ${product.categorySlug}`);
            continue;
        }
        const isCcComponent = ['camera', 'recorder', 'storage', 'power-source', 'connector', 'cable', 'display', 'router'].includes((_a = product.componentType) !== null && _a !== void 0 ? _a : '');
        const builderType = isCcComponent ? 'CC_CAMERA' : 'PC';
        await prisma.product.upsert({
            where: { sku: product.sku },
            create: {
                name: product.name,
                sku: product.sku,
                slug: slugify(product.name),
                categoryId: category.id,
                productBadge: 'Featured',
                price: 10,
                specialPrice: 10,
                regularPrice: 10,
                stockStatus: 'IN_STOCK',
                totalQuantity: 50,
                status: 'ACTIVE',
                isFeatured: true,
                isCompareEnabled: true,
                isWishlistEnabled: true,
                shortDescription: product.shortDescription,
                fullDescription: `${product.shortDescription}. Demo product for BuildHut premium storefront and system builder testing.`,
                warranty: 'Demo warranty included',
                imageUrl: product.image,
                images: { create: [{ imageUrl: product.image, sortOrder: 0, isPrimary: true }] },
                overviews: {
                    create: [
                        { title: 'Category', value: category.name, sortOrder: 0 },
                        { title: 'Stock Status', value: 'In Stock', sortOrder: 1 },
                        { title: 'Demo Price', value: 'Tk 10', sortOrder: 2 },
                    ],
                },
                componentMaps: product.componentType ? { create: [{ builderType, componentType: product.componentType }] } : undefined,
                specMeta: { create: Object.entries((_b = product.meta) !== null && _b !== void 0 ? _b : {}).map(([key, value]) => ({ key, value })) },
            },
            update: {
                name: product.name,
                categoryId: category.id,
                productBadge: 'Featured',
                price: 10,
                specialPrice: 10,
                regularPrice: 10,
                stockStatus: 'IN_STOCK',
                totalQuantity: 50,
                status: 'ACTIVE',
                isFeatured: true,
                isCompareEnabled: true,
                isWishlistEnabled: true,
                shortDescription: product.shortDescription,
                fullDescription: `${product.shortDescription}. Demo product for BuildHut premium storefront and system builder testing.`,
                warranty: 'Demo warranty included',
                imageUrl: product.image,
                images: { deleteMany: {}, create: [{ imageUrl: product.image, sortOrder: 0, isPrimary: true }] },
                overviews: {
                    deleteMany: {},
                    create: [
                        { title: 'Category', value: category.name, sortOrder: 0 },
                        { title: 'Stock Status', value: 'In Stock', sortOrder: 1 },
                        { title: 'Demo Price', value: 'Tk 10', sortOrder: 2 },
                    ],
                },
                componentMaps: Object.assign({ deleteMany: {} }, (product.componentType ? { create: [{ builderType, componentType: product.componentType }] } : {})),
                specMeta: { deleteMany: {}, create: Object.entries((_c = product.meta) !== null && _c !== void 0 ? _c : {}).map(([key, value]) => ({ key, value })) },
            },
        });
    }
}
const inferDemoVisual = (slug) => {
    if (slug.includes('laptop') || slug.includes('tablet'))
        return '/uploads/demo/laptop.svg';
    if (slug.includes('processor'))
        return '/uploads/demo/cpu.svg';
    if (slug.includes('motherboard'))
        return '/uploads/demo/motherboard.svg';
    if (slug.includes('monitor') || slug.includes('display') || slug.includes('projector'))
        return '/uploads/demo/monitor.svg';
    if (slug.includes('ram') || slug.includes('memory'))
        return '/uploads/demo/ram.svg';
    if (slug.includes('ssd') || slug.includes('hdd') || slug.includes('storage') || slug.includes('drive'))
        return '/uploads/demo/storage.svg';
    if (slug.includes('graphics-card'))
        return '/uploads/demo/gpu.svg';
    if (slug.includes('camera') || slug.includes('dvr') || slug.includes('nvr') || slug.includes('security'))
        return '/uploads/demo/cctv.svg';
    return '/uploads/demo/accessory.svg';
};
const inferBuilder = (slug) => {
    if (slug.includes('processor'))
        return { builderType: 'PC', componentType: 'cpu', meta: { cpu_socket: 'AM5', socket: 'AM5', generation: 'Demo Gen', power_watt: '65' } };
    if (slug.includes('motherboard'))
        return { builderType: 'PC', componentType: 'motherboard', meta: { motherboard_socket: 'AM5', socket: 'AM5', motherboard_ram_type: 'DDR5', ram_type: 'DDR5', form_factor: 'ATX', power_watt: '45' } };
    if (slug.includes('ram'))
        return { builderType: 'PC', componentType: 'ram', meta: { ram_type: 'DDR5', capacity: '16GB', bus_speed: '5600MHz', power_watt: '6' } };
    if (slug.includes('ssd'))
        return { builderType: 'PC', componentType: 'ssd', meta: { storage_interface: 'NVMe', storage_type: 'SSD/NVMe', power_watt: '6' } };
    if (slug.includes('hdd'))
        return { builderType: 'PC', componentType: 'hdd', meta: { storage_interface: 'SATA', storage_type: 'HDD/SATA', power_watt: '8' } };
    if (slug.includes('graphics-card'))
        return { builderType: 'PC', componentType: 'graphics-card', meta: { gpu_power_requirement: '250', required_watt: '250', interface: 'PCIe 4.0', power_watt: '250' } };
    if (slug.includes('monitor') || slug.includes('display'))
        return { builderType: 'PC', componentType: 'monitor', meta: { power_watt: '35' } };
    if (slug.includes('keyboard'))
        return { builderType: 'PC', componentType: 'keyboard', meta: { power_watt: '3' } };
    if (slug.includes('mouse'))
        return { builderType: 'PC', componentType: 'mouse', meta: { power_watt: '2' } };
    if (slug.includes('casing-fan'))
        return { builderType: 'PC', componentType: 'casing-fan', meta: { power_watt: '4' } };
    if (slug.includes('casing'))
        return { builderType: 'PC', componentType: 'casing', meta: { form_factor: 'ATX/mATX/ITX', supported_form_factor: 'ATX/mATX/ITX', power_watt: '0' } };
    if (slug.includes('power-supply'))
        return { builderType: 'PC', componentType: 'power-supply', meta: { psu_watt: '750', watt: '750', power_watt: '0' } };
    if (slug.includes('cpu-cooler'))
        return { builderType: 'PC', componentType: 'cpu-cooler', meta: { power_watt: '10' } };
    if (slug.includes('ups'))
        return { builderType: 'PC', componentType: 'ups', meta: { power_watt: '0' } };
    if (slug.includes('optical'))
        return { builderType: 'PC', componentType: 'optical-device', meta: { power_watt: '15' } };
    if (slug.includes('ip-camera') || slug.includes('cc-camera') || slug.includes('webcam') || slug.includes('smart-door-bell'))
        return { builderType: 'CC_CAMERA', componentType: 'camera', meta: { camera_type: slug.includes('cc-camera') ? 'Analog' : 'IP', resolution: '2MP', power_type: slug.includes('cc-camera') ? '12V' : 'PoE', power_watt: '7' } };
    if (slug.includes('dvr'))
        return { builderType: 'CC_CAMERA', componentType: 'recorder', meta: { recorder_type: 'Analog', channel_support: '4 Channel', storage_support: 'SATA', power_watt: '14' } };
    if (slug.includes('nvr'))
        return { builderType: 'CC_CAMERA', componentType: 'recorder', meta: { recorder_type: 'IP', channel_support: '8 Channel', storage_support: 'SATA', power_watt: '18' } };
    if (slug.includes('network-cable') || slug.includes('cable-lan'))
        return { builderType: 'CC_CAMERA', componentType: 'cable', meta: { cable_type: 'IP/Cat6', power_watt: '0' } };
    if (slug.includes('connector'))
        return { builderType: 'CC_CAMERA', componentType: 'connector', meta: { power_watt: '0' } };
    if (slug.includes('router'))
        return { builderType: 'CC_CAMERA', componentType: 'router', meta: { power_watt: '12' } };
    return null;
};
async function upsertBulkDemoProducts() {
    var _a, _b;
    const categories = await prisma.category.findMany({
        where: { status: 'ACTIVE' },
        include: { children: true },
        orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const allowedRootSlugs = new Set(initial_catalog_1.categorySeeds.map((category) => slugify(category.name)));
    const rootSlugFor = (category) => {
        let current = category;
        while (current.parentId && categoryById.has(current.parentId)) {
            current = categoryById.get(current.parentId);
        }
        return current.slug;
    };
    const productCategories = categories
        .filter((category) => category.children.length === 0)
        .filter((category) => allowedRootSlugs.has(rootSlugFor(category)))
        .filter((category) => !['laptop-all-laptop', 'monitor-all-monitor'].includes(category.slug));
    for (let index = 0; index < 200; index += 1) {
        const category = productCategories[index % productCategories.length];
        const number = String(index + 1).padStart(3, '0');
        const sku = `BULK-DEMO-${number}`;
        const image = inferDemoVisual(category.slug);
        const builder = inferBuilder(category.slug);
        const productName = `${category.name} Premium Demo Product ${number}`;
        const shortDescription = `${category.name} premium BuildHut demo item with active stock and Tk 10 testing price.`;
        await prisma.product.upsert({
            where: { sku },
            create: {
                name: productName,
                sku,
                slug: `bulk-${category.slug}-${number}`,
                categoryId: category.id,
                productBadge: index % 3 === 0 ? 'New Arrival' : index % 3 === 1 ? 'Discount' : 'Featured',
                price: 10,
                specialPrice: 10,
                regularPrice: 10,
                stockStatus: 'IN_STOCK',
                totalQuantity: 100,
                status: 'ACTIVE',
                isFeatured: true,
                isCompareEnabled: true,
                isWishlistEnabled: true,
                shortDescription,
                fullDescription: `${shortDescription} Generated to keep every category filled for demo browsing.`,
                warranty: 'Demo warranty included',
                imageUrl: image,
                images: { create: [{ imageUrl: image, sortOrder: 0, isPrimary: true }] },
                overviews: {
                    create: [
                        { title: 'Category', value: category.name, sortOrder: 0 },
                        { title: 'Stock Status', value: 'In Stock', sortOrder: 1 },
                        { title: 'Demo Price', value: 'Tk 10', sortOrder: 2 },
                    ],
                },
                componentMaps: builder ? { create: [{ builderType: builder.builderType, componentType: builder.componentType }] } : undefined,
                specMeta: { create: Object.entries((_a = builder === null || builder === void 0 ? void 0 : builder.meta) !== null && _a !== void 0 ? _a : { power_watt: '5' }).map(([key, value]) => ({ key, value })) },
            },
            update: {
                name: productName,
                categoryId: category.id,
                price: 10,
                specialPrice: 10,
                regularPrice: 10,
                stockStatus: 'IN_STOCK',
                totalQuantity: 100,
                status: 'ACTIVE',
                isFeatured: true,
                isCompareEnabled: true,
                isWishlistEnabled: true,
                shortDescription,
                fullDescription: `${shortDescription} Generated to keep every category filled for demo browsing.`,
                warranty: 'Demo warranty included',
                imageUrl: image,
                images: { deleteMany: {}, create: [{ imageUrl: image, sortOrder: 0, isPrimary: true }] },
                overviews: {
                    deleteMany: {},
                    create: [
                        { title: 'Category', value: category.name, sortOrder: 0 },
                        { title: 'Stock Status', value: 'In Stock', sortOrder: 1 },
                        { title: 'Demo Price', value: 'Tk 10', sortOrder: 2 },
                    ],
                },
                componentMaps: Object.assign({ deleteMany: {} }, (builder ? { create: [{ builderType: builder.builderType, componentType: builder.componentType }] } : {})),
                specMeta: { deleteMany: {}, create: Object.entries((_b = builder === null || builder === void 0 ? void 0 : builder.meta) !== null && _b !== void 0 ? _b : { power_watt: '5' }).map(([key, value]) => ({ key, value })) },
            },
        });
    }
}
async function main() {
    var _a, _b, _c, _d;
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@buildhut.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
        where: { email: adminEmail },
        create: {
            name: 'BuildHut Admin',
            email: adminEmail,
            phone: '01000000000',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
        },
        update: {
            name: 'BuildHut Admin',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
        },
    });
    for (const [index, zone] of initial_catalog_1.branchZoneSeeds.entries()) {
        await prisma.branch.upsert({
            where: { slug: slugify(zone) },
            create: {
                name: zone,
                slug: slugify(zone),
                sortOrder: index,
                status: 'ACTIVE',
            },
            update: {
                name: zone,
                sortOrder: index,
                status: 'ACTIVE',
            },
        });
    }
    for (const [index, component] of initial_catalog_1.pcBuilderComponentSeeds.entries()) {
        await prisma.builderComponent.upsert({
            where: { builderType_slug: { builderType: 'PC', slug: component.slug } },
            create: Object.assign(Object.assign({}, component), { builderType: 'PC', sortOrder: index, allowMultiple: (_a = component.allowMultiple) !== null && _a !== void 0 ? _a : false }),
            update: {
                name: component.name,
                sortOrder: index,
                isRequired: component.isRequired,
                allowMultiple: (_b = component.allowMultiple) !== null && _b !== void 0 ? _b : false,
            },
        });
    }
    for (const [index, component] of initial_catalog_1.ccBuilderComponentSeeds.entries()) {
        await prisma.builderComponent.upsert({
            where: { builderType_slug: { builderType: 'CC_CAMERA', slug: component.slug } },
            create: Object.assign(Object.assign({}, component), { builderType: 'CC_CAMERA', sortOrder: index, allowMultiple: (_c = component.allowMultiple) !== null && _c !== void 0 ? _c : false }),
            update: {
                name: component.name,
                sortOrder: index,
                isRequired: component.isRequired,
                allowMultiple: (_d = component.allowMultiple) !== null && _d !== void 0 ? _d : false,
            },
        });
    }
    for (const [index, category] of initial_catalog_1.categorySeeds.entries()) {
        await upsertCategory(category, null, 0, index);
    }
    await upsertDemoProducts();
    await upsertBulkDemoProducts();
}
main()
    .then(async () => {
    await prisma.$disconnect();
    await pool.end();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
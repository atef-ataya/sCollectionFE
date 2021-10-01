// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Product } from '../../../../products/src/lib/models/product';
export class OrderItem {
    product?: Product;
    quantity?: number;
}

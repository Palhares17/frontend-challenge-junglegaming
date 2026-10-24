import { catalogHandlers } from '@/feature/home/mocks/catalog.handlers';
import { cartHandlers } from '@/feature/cart/mocks/cart.handlers';
import { favoriteHandlers } from '@/feature/favorites/mocks/favorites.handlers';
import { orderHandlers } from '@/feature/orders/mocks/orders.handlers';
import { profileHandlers } from '@/feature/profile/mocks/profile.handlers';
import { walletHandlers } from '@/feature/wallets/mocks/wallets.handlers';
import { controlHandlers } from './control.handlers';
import { navigationHandlers } from './navigation.handlers';
import { realtimeHandlers } from './realtime';
import { sessionHandlers } from './session.handlers';

export const handlers = [...controlHandlers, ...catalogHandlers, ...sessionHandlers, ...navigationHandlers, ...cartHandlers, ...favoriteHandlers, ...profileHandlers, ...walletHandlers, ...orderHandlers, ...realtimeHandlers];

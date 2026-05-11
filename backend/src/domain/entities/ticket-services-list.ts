import { WatchedList } from '../core/watched-list';
import { TicketServices } from './ticket-services';

export class TicketServicesList extends WatchedList<TicketServices> {
	compareItems(a: TicketServices, b: TicketServices): boolean {
		return a.id.equals(b.id);
	}
}

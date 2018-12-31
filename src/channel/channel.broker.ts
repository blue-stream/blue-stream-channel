
import * as rabbit from '../utils/rabbit';

export class ChannelBroker {
    public static async publish(routingKey: string,
                                message: any) {
        rabbit.publish('application', 'topic' , routingKey, message);
    }
}

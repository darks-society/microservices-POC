import { Channel, Connection, ConsumeMessage } from 'amqplib';

interface Event {
	subject: string;
	data: any;
}

export abstract class ListenerAbstract<T extends Event> {
	abstract onMessage(msg: ConsumeMessage | null): void;
	abstract queueName: string;
	protected channel!: Channel;

	constructor(private connection: Connection) {}

	public async listen() {
		this.channel = await this.connection.createChannel();

		await this.channel.assertQueue(this.queueName, { durable: true });

		await this.channel.consume(this.queueName, this.onMessage, {
			noAck: false,
		});

		console.log('[+] Awaiting MQ messages');
	}
}

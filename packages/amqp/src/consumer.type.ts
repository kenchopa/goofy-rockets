import type { Message } from 'amqplib';

type Consumer = (msg: Message) => Promise<void>;

export default Consumer;

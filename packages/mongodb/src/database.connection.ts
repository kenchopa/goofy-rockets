import logger from '@wgp/logger';
import mongoose, { Connection, ConnectOptions } from 'mongoose';

const { connection }: { connection: Connection } = mongoose;

interface MongoConnectParams {
  host: string;
  db: string;
  port?: number;
  user: string;
  password: string;
  protocol?: string;
  options?: string;
}

export const connectMongoDB = async ({
  host,
  db,
  user,
  password,
  port = 27017,
  protocol = 'mongodb',
  options = '',
}: MongoConnectParams): Promise<typeof mongoose> => {
  const meta = JSON.stringify({ db, host, options, port, protocol, user });

  connection.on('error', (error) => logger.error(`MongoDB error - ${error}`));
  connection.on('open', () => logger.info(`MongoDB connected - ${meta}`));
  connection.on('disconnected', () =>
    logger.info(`MongoDB disconnected - ${meta}`),
  );

  logger.info('MongoDB connecting...');

  mongoose.set('strictQuery', true);

  // Add the port to the connection string
  const connectionString = `${protocol}://${host}:${port}/${db}?${options}`;
  const connectOptions: ConnectOptions = {
    pass: password,
    user,
  };

  return mongoose.connect(connectionString, connectOptions);
};

export const disconnectMongoDB = async (): Promise<void> => {
  logger.info('MongoDB disconnecting...');
  await mongoose.disconnect();
};

interface TransformedObject {
  id?: string;
  _id?: string;
  __v?: number;
  [key: string]: any;
}

export const transformObject = (
  obj: TransformedObject | null,
): TransformedObject | null => {
  if (obj === null) return null;

  const newObj = { ...obj };
  newObj.id = newObj._id;
  delete newObj._id;
  delete newObj.__v;

  return newObj;
};

export const transformObjects = (
  arr: TransformedObject[],
): TransformedObject[] => {
  return arr
    .map((x: TransformedObject) => transformObject(x)) // Apply the transformation
    .filter((x): x is TransformedObject => x !== null); // Filter out null values
};

// Export mongoose for external usage if needed
export { mongoose };

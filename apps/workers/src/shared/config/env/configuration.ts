export default () => ({
  queue: {
    QUEUE_HOST: process.env.QUEUE_HOST,
    QUEUE_PORT: process.env.QUEUE_PORT,
    QUEUE_PASSWORD: process.env.QUEUE_PASSWORD,
    QUEUE_USERNAME: process.env.QUEUE_USERNAME,
    QUEUE_SSL: process.env.QUEUE_SSL,
  },
});

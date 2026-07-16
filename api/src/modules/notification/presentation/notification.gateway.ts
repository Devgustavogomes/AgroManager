import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ForbiddenError } from 'src/shared/domain/errors/forbiddenError';
import { JwtPayload } from 'src/shared/application/types/jwtPayload';
import { NotificationProviderContract } from '../domain/providers/notificationProvider.contract';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationProviderContract,
  ) {}

  afterInit(server: Server) {
    this.notificationService.setServer(server);
  }

  async handleConnection(client: Socket) {
    const authHeader: string | undefined = client.handshake.auth?.token;

    try {
      if (!authHeader) {
        throw new ForbiddenError('Missing Token');
      }

      const token: string = authHeader.split(' ')[1];

      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      const producerId = payload.id;

      await client.join(`producer-${producerId}`);
    } catch (error) {
      client.disconnect(true);
      throw error;
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsServiceImpl } from '../src/modules/notifications/services/notifications.service.impl';
import { NotificationsRepository } from '../src/modules/notifications/repositories/notifications.repository';

describe('NotificationsServiceImpl', () => {
  let service: NotificationsServiceImpl;
  let repository: jest.Mocked<NotificationsRepository>;

  const mockLog = {
    id: 'notif-123',
    recipient: 'test@example.com',
    message: 'Order created',
    channel: 'EMAIL',
    status: 'SENT',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsServiceImpl,
        { provide: NotificationsRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<NotificationsServiceImpl>(NotificationsServiceImpl);
    repository = module.get(NotificationsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should create and log notification with SENT status', async () => {
      repository.create.mockResolvedValue(mockLog);

      const result = await service.sendNotification({
        recipient: 'test@example.com',
        message: 'Order created',
        channel: 'EMAIL',
      });

      expect(repository.create).toHaveBeenCalledWith({
        recipient: 'test@example.com',
        message: 'Order created',
        channel: 'EMAIL',
        status: 'SENT',
      });
      expect(result).toEqual(mockLog);
    });

    it('should default channel to EMAIL when not provided', async () => {
      repository.create.mockResolvedValue(mockLog);

      await service.sendNotification({
        recipient: 'test@example.com',
        message: 'Order created',
      });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'EMAIL' }),
      );
    });
  });

  describe('getNotificationLogs', () => {
    it('should return all notification logs', async () => {
      repository.findAll.mockResolvedValue([mockLog]);

      const result = await service.getNotificationLogs();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockLog]);
    });
  });
});

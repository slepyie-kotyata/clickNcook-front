import {MessageType, RequestType} from './types';

// Интерфейс для хранения токенов аутентификации
export interface ITokens {
  // Основной токен доступа
  access_token: string;
  // Токен для обновления доступа
  refresh_token: string;
}

// Интерфейс для сообщений, отправляемых через API
export interface IMessage {
  // Тип сообщения (например, request или response)
  message_type: MessageType;
  // Тип запроса
  request_type: RequestType;
  // Уникальный идентификатор запроса
  request_id?: string;
  // Данные, связанные с сообщением
  data: {
    // Токен аутентификации
    token: string;
    // Дополнительные данные
    [key: string]: any;
  };
}




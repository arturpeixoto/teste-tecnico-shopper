export type ServiceMessage = { message: string };

type ServiceResponseErrorType = 'INVALID_DATA' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_SERVER_ERROR' | 'DOUBLE_REPORT' | 'BAD_REQUEST'; 

type ServiceResponseSuccessType = 'SUCCESSFUL' | 'CREATED';

export type ServiceResponseError = {
  status: ServiceResponseErrorType,
  data: ServiceMessage
};

export type ServiceResponseSuccess<T> = {
  status: ServiceResponseSuccessType,
  data: T
};

export type ServiceResponse<T> = ServiceResponseError | ServiceResponseSuccess<T>;
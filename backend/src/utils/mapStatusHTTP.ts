export default function mapStatusHTTP(status: string): number {
  switch (status) {
    case 'SUCCESSFUL': return 200;
    case 'CREATED': return 201;
    case 'INVALID_DATA': return 400;
    case 'BAD_REQUEST': return 400;
    case 'NOT_FOUND': return 404;
    case 'CONFLICT': return 409;
    case 'DOUBLE_REPORT': return 409;
    case 'CONFIRMATION_DUPLICATE': return 409;
    case 'UNAUTHORIZED': return 401;
    case 'INTERNAL_SERVER_ERROR': return 500;
    default: return 500;
  }
}
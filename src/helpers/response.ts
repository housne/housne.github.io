export class JsonResponse extends Response {
  constructor(data: any, init?: ResponseInit | undefined) {
    super(
      JSON.stringify(data), 
      {
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {})
        },
        ...(init || {})
      },
    )
  }
}

export class BadRequestResponse extends JsonResponse {
  constructor() {
    super(
      {message: 'bad request'},
      { status: 403 }
    )
  }
}
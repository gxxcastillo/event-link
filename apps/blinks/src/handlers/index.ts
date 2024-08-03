import {
  APIGatewayEventRequestContextV2,
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { createActionHeaders } from '@solana/actions';

import { getHandler } from './get';
import { postHandler } from './post';

type HttpMethod = 'POST' | 'GET';
type HttpHandler = () => Promise<unknown>;
type HandlerMap = Record<HttpMethod, HttpHandler>;
type HandlerEvent = APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2>;

const handlerMap: HandlerMap = {
  GET: getHandler,
  POST: postHandler,
};

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export async function handler(event: HandlerEvent): Promise<APIGatewayProxyResult> {
  const method = event.requestContext.http.method.toUpperCase() as HttpMethod;

  if (handlerMap[method]) {
    try {
      const result = await handlerMap[method]();
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers,
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error }),
        headers,
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers,
    };
  }
}

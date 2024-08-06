import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { createActionHeaders } from '@solana/actions';

import { getHandler } from './get';
import { postHandler } from './post';

type HttpMethod = 'POST' | 'GET' | 'OPTIONS';
type HttpHandler = (eventID: string, inviteID: string, response: string) => Promise<unknown>;
type HandlerMap = Record<HttpMethod, HttpHandler>;

export type IRsvpHandler = {
  eventID: string;
  responseID: string;
  response: string;
};

export type HandlerEvent = APIGatewayProxyEvent & {
  pathParameters?: { eventID?: string; inviteID?: string; rsvp?: string };
};

const handlerMap: HandlerMap = {
  GET: getHandler,
  POST: postHandler,
  OPTIONS: () => Promise.resolve(null),
};

const headers = createActionHeaders();
delete headers['Access-Control-Allow-Origin'];

export async function handler(event: HandlerEvent): Promise<APIGatewayProxyResult> {
  const method = event.requestContext.httpMethod.toUpperCase() as HttpMethod;
  const { response } = event.queryStringParameters || {};
  const { eventID, inviteID } = event.pathParameters || {};
  if (handlerMap[method] && eventID && inviteID && response) {
    try {
      const result = await handlerMap[method](eventID, inviteID, response);
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

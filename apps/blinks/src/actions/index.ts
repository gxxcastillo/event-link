import { APIGatewayProxyResult } from 'aws-lambda';
import { createActionHeaders } from '@solana/actions';

const headers = createActionHeaders();
delete headers['Access-Control-Allow-Origin'];

export async function handler(): Promise<APIGatewayProxyResult> {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ rules: [] }),
      headers,
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error }),
      headers,
    };
  }
}

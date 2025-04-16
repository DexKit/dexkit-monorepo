import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
//@ts-ignore
import qrcode from 'yaqrcode';
export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const payment = searchParams.get('payment');

  const size = 500;
  const base64 = qrcode(payment, {
    size,
  });

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'black',
          background: '#f6f6f6',
          width: '100%',
          height: '100%',
          paddingTop: 20,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p style={{ paddingBottom: 20 }}>Payment</p>
        <img
          alt={(payment as string) || ''}
          height={size}
          src={base64}
          width={size}
          style={{ paddingBottom: 50 }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 700,
    }
  );
}

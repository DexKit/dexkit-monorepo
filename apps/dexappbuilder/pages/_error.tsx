import type { NextPage } from 'next';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode = 500 }) => {
  // Add debugging
  console.log('Error component rendered with statusCode:', statusCode);

  const getErrorMessage = () => {
    switch (statusCode) {
      case 404:
        return {
          title: '404',
          message: 'Page Not Found',
          description: 'The page you are looking for does not exist.'
        };
      case 500:
        return {
          title: '500',
          message: 'Server Error',
          description: 'Something went wrong on our end. Please try again later.'
        };
      default:
        return {
          title: 'Error',
          message: 'An Error Occurred',
          description: 'Something went wrong.'
        };
    }
  };

  const { title, message, description } = getErrorMessage();

  console.log('Error message object:', { title, message, description });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0', color: statusCode === 404 ? '#1976d2' : '#d32f2f' }}>
        {title}
      </h1>
      <h2 style={{ fontSize: '1.5rem', margin: '10px 0', color: '#666' }}>
        {message}
      </h2>
      <p style={{ fontSize: '1rem', color: '#888', margin: '20px 0' }}>
        {description}
      </p>
      <a
        href="/"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#1976d2',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginTop: '20px'
        }}
      >
        Go Home
      </a>
    </div>
  );
};

Error.getInitialProps = (context: any) => {
  const { res, err } = context;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
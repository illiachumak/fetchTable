import React, { useState } from 'react';
import { login } from '../redux/slices/loginSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks/hooks';
import { Alert, Button, Form, Row, Col, Stack, Spinner } from 'react-bootstrap'
import { RootState } from '../redux/store';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch()
  const { error: validationError, isAuthenticated, loading } = useAppSelector((state: RootState) => state.login);
  const user = localStorage.getItem('user')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }))
  };
  if (isAuthenticated || user) {
    return <Navigate to="/" />;
}

  return (
    <>
        <Form onSubmit={handleSubmit}>
            <Row style={{
                height: "100vh",
                justifyContent: "center",
                paddingTop: "10%"
            }}>
                <Col xs={6}>
                    <Stack gap={3}>
                        <h2>Login</h2>
                        <Form.Control type='username' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />
                        <Form.Control type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                        <Button variant='primary' type='submit' disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                        </Button>
                        { validationError && (<Alert variant='danger'>{`${validationError}`}</Alert>)  }
                    </Stack>
                </Col>
            </Row>
        </Form>  
    </> 
  );
}

export default LoginPage;
